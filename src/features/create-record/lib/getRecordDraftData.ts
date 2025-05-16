import { Journal } from "@/entities/journal";
import type {
  RecordDraftAssetSchema,
  RecordDraftInstitutionSchema,
} from "../model/recordDraftSchema";

export function getRecordDraftData() {
  if (!Journal.instance) throw Error("No Journal instance available");
  const {
    recordData: { assets, institutions },
    date,
  } = Journal.instance.getLatestRecord();

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

  return {
    recordDraftData: {
      assets: recordDraftAssets,
      institutions: recordDraftInstitutions,
    },
    recordDate: Number(date),
  };
}
