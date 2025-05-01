import { ListInput } from "konsta/react";
import type { AssetInputsProps } from "./AssetEdit";
import type { ChangeEvent } from "react";
import type { AssessmentAction } from "./useAssetState";

/**
 * New component
 *
 */
export function CurrencyInput(props: AssetInputsProps<string>) {
  const { assetDispatch, value } = props;
  return (
    <ListInput
      type="select"
      className="w-12"
      label="currency"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        handleCurrencyChange(e.target.value, assetDispatch)
      }
    >
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
