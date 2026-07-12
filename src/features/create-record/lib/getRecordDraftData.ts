import { Journal } from "@/entities/journal";
import type {
  RecordDraftAssetSchema,
  RecordDraftInstitutionSchema,
  RecordDraftMetaSchema,
} from "../model/recordDraftSchema";
import { redirect } from "react-router";

/**
 * Retrieves current record draft data from the journal for initializing the create record form.
 *
 * @returns Object containing the record draft data structures (assets, institutions, meta)
 * keyed by their respective IDs, along with the record date as a number.
 *
 * @throws Redirects to "/" if no journal exists or resume fails.
 *
 * @example
 * ```ts
 * const { recordDraftData, recordDate } = getRecordDraftData();
 * ```
 */
export function getRecordDraftData() {
  const journal = Journal.resume(() => redirect("/") as never);
  const {
    recordData: { assets, institutions },
    date,
  } = journal.getLatestRecord();

  /* ---------- CODE BLOCK: Convert Journal entries to recordDraft entries ---------- */
  const recordDraftInstitutions: Record<string, RecordDraftInstitutionSchema> =
    {};
  Object.values(institutions).forEach((institution: any) => {
    const { date, name, ...data } = institution;
    void date;
    recordDraftInstitutions[name] = {
      ...data,
      name,
      country: data.country || "",
      isDirty: false,
      isDeleted: false,
      isNew: false,
    };
  });

  const recordDraftAssets: Record<string, RecordDraftAssetSchema> = {};
  Object.values(assets).forEach((asset: any) => {
    const { date, name, institution, ...data } = asset;
    void date;
    recordDraftAssets[`${institution}.${name}`] = {
      ...data,
      institution,
      name,
      amount: data.amount || 0,
      currency: data.currency || "",
      isEarning: data.isEarning || false,
      description: data.description || "",
      isDirty: false,
      isDeleted: false,
      isNew: false,
    };
  });

  const recordDraftMeta: Record<"0", RecordDraftMetaSchema> = {
    0: { journalId: journal.meta.id },
  };

  return {
    recordDraftData: {
      assets: recordDraftAssets,
      institutions: recordDraftInstitutions,
      meta: recordDraftMeta,
    },
    recordDate: Number(date),
  };
}
