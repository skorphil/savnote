import { ListInput } from "konsta/react";
import type { AssetInputsProps } from "./AssetEdit";
import type { AssessmentAction } from "./useAssetState";
import type { ChangeEvent } from "react";

/**
 * New component
 *
 */
export function DescriptionInput(props: AssetInputsProps<string>) {
  const { assetDispatch, value } = props;
  return (
    <ListInput
      type="textarea"
      label="Description"
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
