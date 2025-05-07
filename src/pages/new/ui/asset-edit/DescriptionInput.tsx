import { ListInput } from "konsta/react";
import type { AssetInputsProps } from "./AssetEdit";
import type { AssessmentAction } from "./useAssetState";
import type { ChangeEvent } from "react";
import { ReadOnlyInput } from "./ReadOnlyInput";

/**
 * New component
 *
 */
export function DescriptionInput(props: AssetInputsProps<string>) {
  const { assetDispatch, value, disabled } = props;
  const label = "Description";

  if (disabled) return <ReadOnlyInput label={label} value={value} />;

  return (
    <ListInput
      outline
      type="textarea"
      label={label}
      value={value}
      inputClassName="!h-20 resize-none"
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        handleChange(assetDispatch, e.target.value)
      }
    />
  );
}

function handleChange(
  assetDispatch: React.Dispatch<AssessmentAction>,
  value: string
) {
  assetDispatch({
    type: "update_value",
    payload: { value: value, property: "description" },
  });
}
