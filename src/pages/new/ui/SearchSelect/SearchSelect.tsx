import { ListInput } from "konsta/react";
import { useState } from "react";
import { SearchDialog } from "./SearchDialog";

type SearchSelectProps = {
	onValueChange: (value: string | number) => unknown;
	data: readonly Record<string, unknown>[];
	outline?: boolean;
	label?: string;
	value: string | number;
	required?: boolean;
	errors?: string[];
	keysToSearch: string[];
	subtitleKey?: string;
	titleKey: string;
	valueKey: string;
};

/**
 * Select input component (dropdown) with option search
 */
export function SearchSelect(props: SearchSelectProps) {
	const {
		data,
		onValueChange,
		outline,
		label,
		value,
		required,
		errors,
		keysToSearch,
		titleKey,
		valueKey,
		subtitleKey,
	} = props;
	const [isOpened, setIsOpened] = useState<boolean>(false);
	return (
		<div className="relative z-9000">
			{isOpened && (
				<SearchDialog
					titleKey={titleKey}
					valueKey={valueKey}
					subtitleKey={subtitleKey}
					keysToSearch={keysToSearch}
					value={value}
					outline={outline}
					onClose={() => {
						setIsOpened(false);
					}}
					data={data}
					onOptionSelect={(value) => {
						setIsOpened(false);
						onValueChange(value);
					}}
					label={label}
				/>
			)}
			<ListInput
				error={errors?.[0] || undefined}
				dropdown
				required={required}
				readOnly
				value={value}
				label={label}
				outline={outline}
				onClick={() => {
					setIsOpened(true);
				}}
			/>
		</div>
	);
}
