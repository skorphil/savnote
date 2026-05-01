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
  Object.values(institutions).forEach(({ date, name, ...data }) => {
    void date;
    recordDraftInstitutions[name] = {
      ...data,
      name,
      isDirty: false,
      isDeleted: false,
      isNew: false,
    };
  });

  const recordDraftAssets: Record<string, RecordDraftAssetSchema> = {};
  Object.values(assets).forEach(({ date, name, institution, ...data }) => {
    void date;
    recordDraftAssets[`${institution}.${name}`] = {
      ...data,
      institution,
      name,
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
