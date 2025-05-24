import type { RecordDraftInstitutionSchema } from "@/features/create-record";
import { useReducer } from "react";

type InstitutionFormErrors = Partial<
	Record<
		keyof Omit<RecordDraftInstitutionSchema, "isDeleted" | "isDirty" | "isNew">,
		string[]
	>
>;

export type ExtendedDraftInstitutionState = RecordDraftInstitutionSchema & {
	errors?: InstitutionFormErrors;
};

type institutionActionTypes = "update_value";

type UpdateInstitutionValuePayload<
	T extends keyof ExtendedDraftInstitutionState,
> = {
	property: T;
	value: ExtendedDraftInstitutionState[T];
};

export type InstitutionAction = {
	type: institutionActionTypes;
	payload: UpdateInstitutionValuePayload<keyof ExtendedDraftInstitutionState>;
};

function institutionReducer(
	institutionState: ExtendedDraftInstitutionState,
	action: InstitutionAction,
) {
	const payload = action.payload;

	switch (action.type) {
		case "update_value":
			return {
				...institutionState,
				[payload.property]: payload.value,
			};
	}
}

/**
 * Provides state and dispatch function for InstitutionEdit Component
 * @returns [ institutionState, institutionDispatch ]
 */
export function useInstitutionDispatch(
	initialState: ExtendedDraftInstitutionState,
): [ExtendedDraftInstitutionState, React.Dispatch<InstitutionAction>] {
	const [institutionState, institutionDispatch] = useReducer(
		institutionReducer,
		{
			...initialState,
		},
	);

	return [institutionState, institutionDispatch];
}
