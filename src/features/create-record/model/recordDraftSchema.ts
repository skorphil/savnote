import {
  assetSchema,
  quoteSchema,
  quotesSchema,
  institutionSchema,
} from "@/shared/journal-schema";
import { z } from "zod";

const recordDraftAssetSchema = assetSchema
  .extend({
    isDirty: z.boolean(),
    isDeleted: z.boolean(),
    isNew: z.boolean(),
  })
  .omit({ date: true });
const recordDraftInstitutionSchema = institutionSchema
  .extend({
    isDirty: z.boolean(),
    isDeleted: z.boolean(),
    isNew: z.boolean(),
  })
  .omit({ date: true });

const recordDraftQuoteSchema = quoteSchema;
const recordDraftQuotesSchema = quotesSchema;

type RecordDraftAssetSchema = z.infer<typeof recordDraftAssetSchema>;
type RecordDraftInstitutionSchema = z.infer<
  typeof recordDraftInstitutionSchema
>;
type RecordDraftQuoteSchema = z.infer<typeof recordDraftQuoteSchema>;
type RecordDraftQuotesSchema = z.infer<typeof recordDraftQuotesSchema>;

export type {
  RecordDraftAssetSchema,
  RecordDraftInstitutionSchema,
  RecordDraftQuoteSchema,
  RecordDraftQuotesSchema,
};

export {
  recordDraftAssetSchema,
  recordDraftInstitutionSchema,
  recordDraftQuoteSchema,
  recordDraftQuotesSchema,
};
