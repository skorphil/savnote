import { Checkbox, ListItem } from "konsta/react";
import type { AssetInputsProps } from "./AssetEdit";
import type { AssessmentAction } from "./useAssetState";

export function IsEarningCheckbox(props: AssetInputsProps<boolean>) {
  const { assetDispatch, value } = props;
  return (
    <ListItem
      label
      title="Earning asset"
      media={
        <Checkbox
          component="div"
          name="isEarning"
          checked={value}
          onChange={() => handleChange(assetDispatch, value)}
        />
      }
    />
  );
}

function handleChange(
  assetDispatch: React.Dispatch<AssessmentAction>,
  currentValue: boolean
) {
  assetDispatch({
    type: "update_value",
    payload: { value: !currentValue, property: "isEarning" },
  });
}
