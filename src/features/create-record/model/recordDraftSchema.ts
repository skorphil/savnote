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

type RecordDraftAssetSchema = z.infer<typeof recordDraftAssetSchema>;
type RecordDraftInstitutionSchema = z.infer<
  typeof recordDraftInstitutionSchema
>;
type RecordDraftQuoteSchema = z.infer<typeof recordDraftQuoteSchema>;

export type {
  RecordDraftAssetSchema,
  RecordDraftInstitutionSchema,
  RecordDraftQuoteSchema,
};

export {
  recordDraftAssetSchema,
  recordDraftInstitutionSchema,
  recordDraftQuoteSchema,
};
