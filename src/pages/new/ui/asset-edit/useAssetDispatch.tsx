import { type RecordDraftAssetSchema } from "@/features/create-record";
import { useReducer } from "react";

type ExtendedDraftAssetState = RecordDraftAssetSchema & { errors: string[] };

type assetActionTypes = "update_value";

type UpdateAssetValuePayload<T extends keyof ExtendedDraftAssetState> = {
  property: T;
  value: ExtendedDraftAssetState[T];
};

export type AssessmentAction = {
  type: assetActionTypes;
  payload: UpdateAssetValuePayload<keyof ExtendedDraftAssetState>;
};

function assetReducer(
  assetState: ExtendedDraftAssetState,
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

/**
 * Provides state and dispatch function for AssetEditComponent
 * @returns [ assetState, assetDispatch ]
 */
export function useAssetDispatch(
  initialState: ExtendedDraftAssetState
): [ExtendedDraftAssetState, React.Dispatch<AssessmentAction>] {
  const [assetState, assetDispatch] = useReducer(assetReducer, {
    ...initialState,
    errors: [],
  });

  return [assetState, assetDispatch];
}
