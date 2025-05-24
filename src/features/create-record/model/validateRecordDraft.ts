import { throwError } from "@/shared/error-handling";
import { ZodError } from "zod";
import {
	type RecordDraftAssetSchema,
	type RecordDraftInstitutionSchema,
	recordDraftAssetSchema,
	recordDraftInstitutionSchema,
} from "./recordDraftSchema";

export function validateRecordDraftAsset(data: object): RecordDraftAssetSchema {
	try {
		return recordDraftAssetSchema.parse(data);
	} catch (e) {
		if (e instanceof ZodError) {
			throw Error(
				`recordDraftAsset validation failed with zod errors:${JSON.stringify(
					e.errors,
				)}`,
			);
		}
		throwError(e);
	}
}
export function validateRecordDraftInstitution(
	data: object,
): RecordDraftInstitutionSchema {
	try {
		return recordDraftInstitutionSchema.parse(data);
	} catch (e) {
		if (e instanceof ZodError) {
			throw Error(
				`recordDraftAsset validation failed with zod errors:${JSON.stringify(
					e.errors,
				)}`,
			);
		}
		throwError(e);
	}
}
