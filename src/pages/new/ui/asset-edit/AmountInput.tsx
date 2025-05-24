import { ListInput } from "konsta/react";
import { useEffect, useRef } from "react";
import { NumericFormat } from "react-number-format";
import type { AssetInputsProps } from "./AssetEdit";
import { ReadOnlyInput } from "./ReadOnlyInput";
import type { AssetAction } from "./useAssetDispatch";

export function AmountInput(props: AssetInputsProps<number>) {
	const { assetDispatch, value, disabled, autoFocus } = props;
	const label = "Amount";
	const inputRef = useRef<{ inputEl: HTMLInputElement } | null>(null);

	useEffect(() => {
		if (!autoFocus) return;
		if (inputRef.current?.inputEl instanceof HTMLInputElement) {
			const inputElement = inputRef.current.inputEl;
			inputElement.focus();
			inputElement.setSelectionRange(0, inputElement.value.length);
		}
	}, [autoFocus]);

	if (disabled) return <ReadOnlyInput label={label} value={value} />;

	return (
		<NumericFormat
			getInputRef={inputRef}
			outline
			isAllowed={(values) => {
				const { floatValue } = values;
				return floatValue ? floatValue > 0 : false;
			}}
			colors={{ bgMaterial: "transparent" }}
			label={label}
			thousandSeparator={" "}
			value={value}
			customInput={ListInput}
			onValueChange={({ value }) => {
				handleAmountChange(value, assetDispatch);
			}}
		/>
	);
}

function handleAmountChange(
	value: string,
	assetDispatch: React.Dispatch<AssetAction>,
) {
	if (Number(value) < 0) return;
	// TODO validate ZOD
	assetDispatch({
		type: "update_value",
		payload: { property: "amount", value: Number(value) },
	});
}

/* ---------- CODE BLOCK: Description ----------
21 mar 2025
DONE support scenario for amount change when
  1) input 1.1 // saved to db
  2) removed 1. // 1 need to be saved
  https://developer.android.com/develop/ui/views/touch-and-input/keyboard-input

DONE inputing non-valid character in the middle, removes afterpart of value
like 123a1.3 => 123

using timeout is triggering flickering of cursor, while
// Not working with ref (limitations of consta)
if (letterDifference > 0) {
    input?.setSelectionRange(
      cursorPosition ? cursorPosition - letterDifference : null,
      cursorPosition ? cursorPosition - letterDifference : null
    );
  }

onInput vs onChange in react: https://react.dev/reference/react-dom/components/textarea#props
Seems like they are the same thing (contrast to browser change and input)
*/
