import { ZodError } from "zod";
import { throwError } from "@/shared/error-handling";
import {
  recordDraftAssetSchema,
  recordDraftInstitutionSchema,
  type RecordDraftInstitutionSchema,
  type RecordDraftAssetSchema,
} from "./recordDraftSchema";

export function validateRecordDraftAsset(data: object): RecordDraftAssetSchema {
  try {
    return recordDraftAssetSchema.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      throw Error(
        `recordDraftAsset validation failed with zod errors:${JSON.stringify(
          e.errors
        )}`
      );
    } else {
      throwError(e);
    }
  }
}
export function validateRecordDraftInstitution(
  data: object
): RecordDraftInstitutionSchema {
  try {
    return recordDraftInstitutionSchema.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      throw Error(
        `recordDraftAsset validation failed with zod errors:${JSON.stringify(
          e.errors
        )}`
      );
    } else {
      throwError(e);
    }
  }
}
