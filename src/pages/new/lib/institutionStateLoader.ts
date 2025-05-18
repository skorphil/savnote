import { redirect, type LoaderFunctionArgs } from "react-router";
import {
  RecordDraft,
  type RecordDraftInstitutionSchema,
} from "@/features/create-record";
import { validateRecordDraftInstitution } from "@/features/create-record/model/validateRecordDraft";

const defaultState: RecordDraftInstitutionSchema = {
  name: "New institution",
  country: "",
  isDirty: false,
  isNew: true,
  isDeleted: false,
};

type InstitutionStateLoaderReturnData = {
  institutionData: RecordDraftInstitutionSchema;
  institutionId: string | undefined;
};
export function institutionStateLoader({
  params,
}: LoaderFunctionArgs): InstitutionStateLoaderReturnData | never {
  const { institutionId } = params;

  // if no institutionId in uri, thats a new asset creation
  if (institutionId === undefined) {
    // TODO generate institutionName (must be unique)
    return {
      institutionData: {
        ...defaultState,
      },
      institutionId: undefined,
    };
  }

  /* ---------- CODE BLOCK: Load institution data from recordDraft ---------- */
  const recordDraft = RecordDraft.resume();
  const recordDraftAssetState = recordDraft?.getInstitutionData(institutionId);
  if (recordDraftAssetState === undefined) return redirect("/new") as never;

  const validatedRecordDraftInstitution = validateRecordDraftInstitution(
    recordDraftAssetState
  );

  return { institutionData: validatedRecordDraftInstitution, institutionId };
}
