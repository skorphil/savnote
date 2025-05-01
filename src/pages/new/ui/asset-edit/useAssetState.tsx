import {
  RecordDraft,
  type RecordDraftAssetSchema,
  validateRecordDraftAsset,
} from "@/features/create-record";
import { useReducer } from "react";
import { useParams } from "react-router";

type assetActionTypes = "update_value";

type UpdateAssetValuePayload<T extends keyof RecordDraftAssetSchema> = {
  property: T;
  value: RecordDraftAssetSchema[T];
};

export type AssessmentAction = {
  type: assetActionTypes;
  payload: UpdateAssetValuePayload<keyof RecordDraftAssetSchema>;
};

function assetReducer(
  assetState: RecordDraftAssetSchema,
  action: AssessmentAction
) {
  const payload = action.payload;

  switch (action.type) {
    case "update_value":
      return {
        ...assetState,
        [payload.property]: payload.value,
      };
  }
}

const defaultState = {
  date: 0,
  institution: "",
  name: "",
  amount: 0,
  currency: "",
  isEarning: false,
  description: "",
  isDirty: false,
};

function getAssetState(assetId: string | undefined): RecordDraftAssetSchema {
  if (assetId === undefined) return defaultState;

  const recordDraft = RecordDraft.instance;
  const recordDraftAssetState = recordDraft?.getAssetData(assetId);
  if (recordDraftAssetState === undefined) return defaultState;

  const validatedRecordDraftAsset = validateRecordDraftAsset(
    recordDraftAssetState
  );
  return validatedRecordDraftAsset;
}

/**
 * Provides state and functions for AssetEditComponent
 */
export function useAssetState() {
  const { assetId } = useParams();
  const [assetState, assetDispatch] = useReducer(
    assetReducer,
    assetId,
    getAssetState
  );
  return assetId ? { assetDispatch, assetState, assetId } : null;
}
