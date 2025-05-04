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

  /* ---------- CODE BLOCK: Add isDirty property to draft entities ---------- */
  const recordDraftInstitutions: Record<string, RecordDraftInstitutionSchema> =
    {};
  Object.entries(institutions).forEach(
    ([institutionId, institutionData]) =>
      (recordDraftInstitutions[institutionId] = {
        ...institutionData,
        isDirty: false,
      })
  );

  const recordDraftAssets: Record<string, RecordDraftAssetSchema> = {};
  Object.entries(assets).forEach(
    ([assetId, assetData]) =>
      (recordDraftAssets[assetId] = { ...assetData, isDirty: false })
  );

  return {
    recordDraftData: {
      assets: recordDraftAssets,
      institutions: recordDraftInstitutions,
    },
    recordDate: Number(date),
  };
}
