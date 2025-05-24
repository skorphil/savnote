import { institutionSchema } from "@/shared/journal-schema";
import { ListInput } from "konsta/react";
import { type ChangeEvent, useState } from "react";
import { ReadOnlyInput } from "../asset-edit/ReadOnlyInput";
import type { InstitutionInputsProps } from "./InstitutionEdit";
import type { InstitutionAction } from "./useInstitutionDispatch";

const institutionNameSchema = institutionSchema.shape.name;
const label = "Name";

type InstitutionNameInputProps = {
	/**
	 * All institutions names in current record
	 */
	recordInstitutionsNames: string[] | undefined;
};

/**
 * Asset name input
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

	if (disabled) return <ReadOnlyInput label={label} value={value} />;

	return (
		<ListInput
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

function handleBlur(value: string, recordInstitutionsNames?: string[]) {
	const validationErrors: string[] = [];
	if (recordInstitutionsNames?.includes(value))
		validationErrors.push(
			"This institution name already exists in current record. Choose unique name or edit existing institution.",
		);
	return validationErrors.length === 0 ? undefined : validationErrors;
}

function handleChange(
	assetDispatch: React.Dispatch<InstitutionAction>,
	value: string,
	recordInstitutionsNames: string[] | undefined,
) {
	const validationErrors: string[] = [];

	const validatedValue = institutionNameSchema.safeParse(value);
	if (!validatedValue.success)
		for (const issue of validatedValue.error.issues)
			validationErrors.push(issue.message);

	if (recordInstitutionsNames?.includes(value))
		validationErrors.push(
			"This institution name already exists in current record. Choose unique name or edit existing institution.",
		);
	assetDispatch({
		type: "update_value",
		payload: { value: value, property: "name" },
	});

	return validationErrors.length === 0 ? undefined : validationErrors;
}

/* ---------- COMMENT ---------- 

*/
