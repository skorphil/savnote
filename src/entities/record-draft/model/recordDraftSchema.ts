import {
  assetSchema,
  quoteSchema,
  instiutionSchema,
} from "@/shared/journal-schema";
import { z } from "zod";

const recordDraftAssetSchema = assetSchema.extend({ isDirty: z.boolean() });
const recordDraftInstitutionSchema = instiutionSchema.extend({
  isDirty: z.boolean(),
});
const recordDraftQuoteSchema = quoteSchema;

export {
  recordDraftAssetSchema,
  recordDraftInstitutionSchema,
  recordDraftQuoteSchema,
};
