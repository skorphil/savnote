import { z } from "zod";

const metaSchema1 = z.object({
  appName: z.literal("savnote"),
  encryption: z
    .object({
      algorithm: z.literal("AES-GCM"),
      iterations: z.number(),
      salt: z.string(),
      iv: z.string(),
    })
    .optional(),
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
    })
  ),
});

const assetSchema1 = z.object({
  name: z.union([z.string(), z.null()]),
  amount: z.number(),
  currency: z.string(),
  isEarning: z.boolean(),
  description: z.string(),
});

const instiutionSchema1 = z.object({
  name: z.string(),
  country: z.string(),
  assets: z.array(assetSchema1).refine(
    (assets) => {
      const names = assets
        .map((asset) => asset.name)
        .filter((name) => name !== null);
      return new Set(names).size === names.length;
    },
    {
      message: "Asset names must be unique within the bank",
    }
  ),
});

const recordSchema1 = z.object({
  uuid: z.string(),
  date: z.number(),
  qutes: z.array(quoteSchema1),
  institutions: z.array(instiutionSchema1),
});

const journalSchema1 = z
  .object({
    meta: metaSchema1,
    data: z.union([
      z.object({
        decrypted: z.boolean(),
        records: z.array(recordSchema1),
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

export type { JournalSchema1 };
export { journalSchema1 };
