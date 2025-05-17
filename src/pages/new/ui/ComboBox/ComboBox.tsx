import { ListInput } from "konsta/react";
import { useState } from "react";
import { SearchDialog } from "./SearchDialog";

type ComboBoxProps = {
  onValueChange: (value: string | number) => unknown;
  data: readonly Record<string, unknown>[];
  outline?: boolean;
  label?: string;
  value: string | number;
  required?: boolean;
  errors?: string[];
};

/**
 * New component
 */
function ComboBox(props: ComboBoxProps) {
  const { data, onValueChange, outline, label, value, required, errors } =
    props;
  const [isOpened, setIsOpened] = useState<boolean>(false);
  return (
    <>
      {isOpened && (
        <SearchDialog
          value={value}
          outline={outline}
          onClose={() => setIsOpened(false)}
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
        value={value === "" ? "No country" : value}
        label={label}
        outline={outline}
        onClick={() => {
          console.log("clicked on input");
          setIsOpened(true);
        }}
      />
    </>
  );
}

export default ComboBox;
