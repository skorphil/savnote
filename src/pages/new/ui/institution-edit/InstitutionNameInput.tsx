import { ListInput } from "konsta/react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { institutionSchema } from "@/shared/journal-schema";
import { ReadOnlyInput } from "../asset-edit/ReadOnlyInput";
import type { InstitutionInputsProps } from "./InstitutionEdit";
import type { InstitutionAction } from "./useInstitutionDispatch";

/**
 * Zod schema for validating institution name.
 */
const institutionNameSchema = institutionSchema.shape.name;
/**
 * Label text for the input field.
 */
const label = "Name";

/**
 * Props for InstitutionNameInput component.
 */
type InstitutionNameInputProps = {
	/**
	 * All institution names in current record.
	 * Used to check for duplicates.
	 */
	recordInstitutionsNames: string[] | undefined;
};

/**
 * Institution name input component with validation.
 * Provides a text input for entering institution name with real-time and blur validation.
 */
export function InstitutionNameInput(
	props: InstitutionInputsProps<string> & InstitutionNameInputProps,
) {
	const {
		institutionDispatch,
		value,
		disabled,
		autoFocus,
		recordInstitutionsNames,
	} = props;
	const [error, setError] = useState<string | undefined>(undefined);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!autoFocus) return;
		if (inputRef.current instanceof HTMLInputElement) {
			const inputElement = inputRef.current;
			inputElement.focus();
			inputElement.setSelectionRange(0, inputElement.value.length);
		}
	}, [autoFocus]);

	if (disabled) return <ReadOnlyInput label={label} value={value} />;

	return (
		<ListInput
			inputRef={inputRef}
			required
			outline
			autoFocus={autoFocus}
			error={error}
			type="text"
			label={label}
			value={value}
			inputClassName="resize-none"
			onBlur={(e: ChangeEvent<HTMLInputElement>) => {
				setError(undefined);
				const validationErrors = handleBlur(
					e.target.value,
					recordInstitutionsNames,
				);
				if (validationErrors) {
					setError(validationErrors.join(","));
					institutionDispatch({
						type: "update_value",
						payload: {
							property: "errors",
							value: { name: validationErrors },
						},
					});
				}
			}}
			onChange={(e: ChangeEvent<HTMLInputElement>) => {
				setError(undefined);
				institutionDispatch({
					type: "update_value",
					payload: { property: "errors", value: undefined },
				});
				const validationErrors = handleChange(
					institutionDispatch,
					e.target.value,
					recordInstitutionsNames,
				);
				if (validationErrors) {
					setError(validationErrors.join(","));
					institutionDispatch({
						type: "update_value",
						payload: {
							property: "errors",
							value: { name: validationErrors },
						},
					});
				}
			}}
		/>
	);
}

/**
 * Validates institution name on blur.
 * @param value - The institution name value to validate
 * @param recordInstitutionsNames - All institution names in the current record
 * @returns Validation error message or undefined if valid
 */
function handleBlur(value: string, recordInstitutionsNames?: string[]) {
	const validationErrors: string[] = [];
	if (recordInstitutionsNames?.includes(value))
		validationErrors.push(
			`This institution name already exists in current record. Choose unique name or edit existing institution.`,
		);
	return validationErrors.length === 0 ? undefined : validationErrors;
}

/**
 * Validates and updates institution name on change.
 * @param assetDispatch - Dispatch function for institution state
 * @param value - The institution name to validate and update
 * @param recordInstitutionsNames - All institution names in the current record
 * @returns Validation error messages or undefined if valid
 */
function handleChange(
	assetDispatch: React.Dispatch<InstitutionAction>,
	value: string,
	recordInstitutionsNames: string[] | undefined,
) {
	const validationErrors: string[] = [];

	const validatedValue = institutionNameSchema.safeParse(value);
	if (!validatedValue.success)
		validatedValue.error.issues.forEach((issue) => {
			validationErrors.push(issue.message);
		});

	if (recordInstitutionsNames?.includes(value))
		validationErrors.push(
			`This institution name already exists in current record. Choose unique name or edit existing institution.`,
		);
	assetDispatch({
		type: "update_value",
		payload: { value: value, property: "name" },
	});

	return validationErrors.length === 0 ? undefined : validationErrors;
}
