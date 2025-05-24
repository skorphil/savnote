import type { RecordDraftAssetSchema } from "@/features/create-record";
import { useReducer } from "react";

type AssetFormErrors = Partial<
	Record<
		keyof Omit<RecordDraftAssetSchema, "isDeleted" | "isDirty" | "isNew">,
		string[] | undefined
	>
>;

export type ExtendedDraftAssetState = RecordDraftAssetSchema & {
	errors?: AssetFormErrors;
};

type UpdateAssetValuePayload<T extends keyof ExtendedDraftAssetState> = {
	property: T;
	value: ExtendedDraftAssetState[T];
};

type AddErrorValuePayload = {
	// how to get
	property: keyof AssetFormErrors;
	value: string[] | undefined;
};

export type AssetAction =
	| {
			type: "update_value";
			payload: UpdateAssetValuePayload<keyof ExtendedDraftAssetState>;
	  }
	| {
			type: "set_error";
			payload: AddErrorValuePayload;
	  };

function assetReducer(
	assetState: ExtendedDraftAssetState,
	action: AssetAction,
) {
	const payload = action.payload;

	switch (action.type) {
		case "update_value":
			return {
				...assetState,
				[payload.property]: payload.value,
			};
		case "set_error":
			return {
				...assetState,
				errors: {
					...assetState.errors,
					[payload.property]: payload.value,
				},
			};
	}
}

/**
 * Provides state and dispatch function for AssetEditComponent
 * @returns [ assetState, assetDispatch ]
 */
export function useAssetDispatch(
	initialState: ExtendedDraftAssetState,
): [ExtendedDraftAssetState, React.Dispatch<AssetAction>] {
	const [assetState, assetDispatch] = useReducer(assetReducer, {
		...initialState,
	});

	return [assetState, assetDispatch];
}
