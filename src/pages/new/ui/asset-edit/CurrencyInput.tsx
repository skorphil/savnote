import { ListInput } from "konsta/react";
import type { AssetInputsProps } from "./AssetEdit";
import type { ChangeEvent } from "react";
import type { AssessmentAction } from "./useAssetDispatch";
import { ReadOnlyInput } from "./ReadOnlyInput";

/**
 * New component
 *
 */
export function CurrencyInput(props: AssetInputsProps<string>) {
  const { assetDispatch, value, disabled } = props;
  const label = "Currency";

  if (disabled) return <ReadOnlyInput label={label} value={value} />;

  return (
    <ListInput
      outline
      type="select"
      // className="w-20"
      label={label}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        handleCurrencyChange(e.target.value, assetDispatch)
      }
    >
      <option value="" disabled hidden>
        Select...
      </option>
      <option value="usd">USD</option>
      <option value="rub">RUB</option>
      <option value="amd">AMD</option>
    </ListInput>
  );
}

function handleCurrencyChange(
  value: string,
  assetDispatch: React.Dispatch<AssessmentAction>
) {
  assetDispatch({
    type: "update_value",
    payload: { property: "currency", value: value },
  });
}
