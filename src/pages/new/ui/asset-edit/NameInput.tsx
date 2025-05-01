import { ListInput } from "konsta/react";
import type { AssetInputsProps } from "./AssetEdit";

/**
 * New component
 *
 */
export function NameInput(props: AssetInputsProps<string>) {
  const { value } = props;
  return <ListInput label="name" value={value} />;
}
