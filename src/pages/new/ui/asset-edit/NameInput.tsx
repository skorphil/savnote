import { ListInput } from "konsta/react";
import type { AssetInputsProps } from "./AssetEdit";
import { ReadOnlyInput } from "./ReadOnlyInput";
import { type ChangeEvent } from "react";
import type { AssetAction } from "./useAssetDispatch";
import { assetSchema } from "@/shared/journal-schema";

const assetNameSchema = assetSchema.shape.name;
const label = "Name";

type NameInputProps = {
  /**
   * All asset names for given institution for current record
   */
  institutionAssetsNames: string[] | undefined;
};

/**
 * Asset name input
 */
export function NameInput(props: AssetInputsProps<string> & NameInputProps) {
  const {
    assetDispatch,
    value,
    disabled,
    autoFocus,
    institutionAssetsNames,
    errors,
  } = props;
  // const [errors, setErrors] = useState<string[] | undefined>(errors);

  if (disabled) return <ReadOnlyInput label={label} value={value} />;

  return (
    <ListInput
      required
      outline
      autoFocus={autoFocus}
      error={errors?.[0]}
      type="text"
      label={label}
      value={value}
      inputClassName="resize-none"
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        // setError(undefined);
        assetDispatch({
          type: "set_error",
          payload: {
            property: "name",
            value: undefined,
          },
        });
        const validationErrors = handleChange(
          assetDispatch,
          e.target.value,
          institutionAssetsNames
        );
        if (validationErrors) {
          assetDispatch({
            type: "set_error",
            payload: {
              property: "name",
              value: validationErrors,
            },
          });
        }
      }}
    />
  );
}

function handleChange(
  assetDispatch: React.Dispatch<AssetAction>,
  value: string,
  institutionAssetsNames: string[] | undefined
) {
  const validationErrors: string[] = [];

  const validatedValue = assetNameSchema.safeParse(value);
  if (!validatedValue.success)
    validatedValue.error.issues.forEach((issue) =>
      validationErrors.push(issue.message)
    );

  if (institutionAssetsNames?.includes(value))
    validationErrors.push(
      `This asset name already exists in the institution for this record. Choose unique name or edit existing asset.`
    );
  assetDispatch({
    type: "update_value",
    payload: { value: value, property: "name" },
  });

  return validationErrors.length === 0 ? undefined : validationErrors;
}

/* ---------- COMMENT ---------- 
Konsta input doesnt provide ref, so cant select all text (as in AmountInput) 
```
const inputRef = useRef< HTMLInputElement | null>(null);
  
    useEffect(() => {
      if (!autoFocus) return;
      if (inputRef.current?.inputEl instanceof HTMLInputElement) {
        const inputElement = inputRef.current.inputEl;
        inputElement.focus();
        inputElement.setSelectionRange(0, inputElement.value.length);
      }
    }, [disabled]);
```

*/
