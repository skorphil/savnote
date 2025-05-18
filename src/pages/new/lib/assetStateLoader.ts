import { redirect, type LoaderFunctionArgs } from "react-router";
import {
  RecordDraft,
  validateRecordDraftAsset,
  type RecordDraftAssetSchema,
} from "@/features/create-record";

const defaultState: RecordDraftAssetSchema = {
  // date: 0,
  institution: "",
  name: "",
  amount: 0,
  currency: "",
  isEarning: false,
  description: "",
  isDirty: false,
  isNew: true,
  isDeleted: false,
};

type AssetStateLoaderData = {
  assetData: RecordDraftAssetSchema;
  institutionId: string;
  assetId?: string;
};
export function assetStateLoader({
  params,
}: LoaderFunctionArgs): AssetStateLoaderData | never {
  const { assetId, institutionId } = params;
  // if no institutionId in uri, thats probably edge case
  if (institutionId === undefined) return redirect("/new") as never;

  // if no assetId in uri, thats a new asset creation
  if (assetId === undefined) {
    const institutionName = institutionId;
    return {
      assetData: {
        ...defaultState,
        institution: institutionName,
      },
      institutionId,
    };
  }

  /* ---------- CODE BLOCK: Get existing recordDraft asset data ---------- */
  const recordDraft = RecordDraft.resume();
  const recordDraftAssetState = recordDraft?.getAssetData(assetId);
  if (recordDraftAssetState === undefined) {
    const institutionName = institutionId;
    return {
      assetData: {
        ...defaultState,
        institution: institutionName,
        // date: institutionDate,
      },
      institutionId,
    };
  }

  const validatedRecordDraftAsset = validateRecordDraftAsset(
    recordDraftAssetState
  );

  return { assetData: validatedRecordDraftAsset, assetId, institutionId };
}

// const getJournalInstitutionData = (institutionId: string) => {
//   const journal = Journal.instance;
//   if (!journal) return redirect("/open") as never;
//   return journal.getInstitution(institutionId);
// };
