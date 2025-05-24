import { z } from "zod";

const encryptionSchema1 = z.object({
	derivedKeyAlgorithm: z.object({
		name: z.literal("AES-GCM"),
		length: z.literal(256),
	}),
	derivationAlgorithm: z.object({
		name: z.literal("PBKDF2"),
		hash: z.literal("SHA-256"),
	}),
	iterations: z.number(),
	salt: z.string(),
	iv: z.string(),
});

const metaSchema1 = z.object({
	appName: z.literal("savnote"),
	encryption: z.union([encryptionSchema1, z.null()]),
	version: z.literal(1),
	name: z.string().optional(),
	dataFormat: z.literal("base64"),
});

const quoteSchema1 = z.object({
	baseCurrency: z.string(),
	rates: z.array(
		z.object({
			currency: z.string(),
			rate: z.number(),
		}),
	),
});

const assetSchema1 = z.object({
	name: z.string().optional(),
	amount: z.number(),
	currency: z.string(),
	isEarning: z.boolean(),
	description: z.string().optional(),
});

const instiutionSchema1 = z.object({
	name: z.string(),
	country: z.string(),
	assets: z.array(assetSchema1).refine(
		(assets) => {
			const names = assets
				.map((asset) => asset.name)
				.filter((name) => name !== undefined);
			return new Set(names).size === names.length;
		},
		{
			message: "Asset names must be unique within the institution",
		},
	),
});

const recordSchema1 = z.object({
	uuid: z.string(),
	date: z.number(),
	quotes: z.array(quoteSchema1),
	institutions: z.array(instiutionSchema1).refine(
		(institutions) => {
			const names = institutions
				.map((institution) => institution.name)
				.filter((name) => name !== undefined);
			return new Set(names).size === names.length;
		},
		{
			message: "Institution names must be unique within the record",
		},
	),
});

const journalSchema1 = z
	.object({
		meta: metaSchema1,
		data: z.union([
			z.object({
				decrypted: z.boolean(),
				records: z.union([z.array(recordSchema1), z.null()]),
			}),
			z.string(),
		]),
	})
	.superRefine((data, ctx) => {
		if (data.meta.encryption === undefined && typeof data.data !== "object") {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Data must be an object when encryption is undefined",
			});
		} else if (
			data.meta.encryption !== undefined &&
			typeof data.data !== "string"
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Data must be a string when encryption is defined",
			});
		}
	});

type JournalSchema1 = z.infer<typeof journalSchema1>;
type RecordSchema1 = z.infer<typeof recordSchema1>;
type MetaSchema1 = z.infer<typeof metaSchema1>;
type EncryptionSchema1 = z.infer<typeof encryptionSchema1>;

export type { JournalSchema1, RecordSchema1, MetaSchema1, EncryptionSchema1 };
export { journalSchema1 };
