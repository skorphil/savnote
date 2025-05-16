import { redirect, type LoaderFunctionArgs } from "react-router";
import {
  RecordDraft,
  type RecordDraftInstitutionSchema,
  validateRecordDraftAsset,
  type RecordDraftAssetSchema,
} from "@/features/create-record";
import { Journal } from "@/entities/journal";

const defaultState: RecordDraftInstitutionSchema = {
  name: "",
  country: "",
  isDirty: false,
  isNew: true,
  isDeleted: false,
};

type InstitutionStateLoaderData = {
  institutionData: RecordDraftAssetSchema;
  institutionId: string;
};
export function institutionStateLoader({
  params,
}: LoaderFunctionArgs): InstitutionStateLoaderData | never {
  return;
}
//   const { institutionId } = params;

//   // if no institutionId in uri, thats a new asset creation
//   if (institutionId === undefined) {
//     // TODO what to do with a date?
//     const { date: institutionDate, name: institutionName } =
//       getInstitutionData(institutionId);
//     return {
//       assetData: {
//         ...defaultState,
//         institution: institutionName,
//         date: institutionDate,
//       },
//       institutionId,
//     };
//   }

//   const recordDraft = RecordDraft.resume();
//   const recordDraftAssetState = recordDraft?.getAssetData(assetId);
//   if (recordDraftAssetState === undefined) {
//     const { date: institutionDate, name: institutionName } =
//       getInstitutionData(institutionId);
//     return {
//       assetData: {
//         ...defaultState,
//         institution: institutionName,
//         date: institutionDate,
//       },
//       institutionId,
//     };
//   }

//   const validatedRecordDraftAsset = validateRecordDraftAsset(
//     recordDraftAssetState
//   );

//   return { assetData: validatedRecordDraftAsset, assetId, institutionId };
// }

// const getInstitutionData = (institutionId: string) => {
//   const journal = Journal.instance;
//   if (!journal) return redirect("/open") as never;
//   return journal.getInstitution(institutionId);
// };
