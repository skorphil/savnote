import { ListInput } from "konsta/react";
import type { AssetInputsProps } from "./AssetEdit";
import { ReadOnlyInput } from "./ReadOnlyInput";
import { type ChangeEvent, useState } from "react";
import type { AssessmentAction } from "./useAssetDispatch";
import { assetSchema } from "@/shared/journal-schema";

const assetNameSchema = assetSchema.shape.name;
const label = "Name";

type NameInputProps = {
  institutionAssetsNames: string[] | undefined;
};

/**
 * Asset name input
 */
export function NameInput(props: AssetInputsProps<string> & NameInputProps) {
  const { assetDispatch, value, disabled, autoFocus, institutionAssetsNames } =
    props;
  const [error, setError] = useState<string | undefined>(undefined);

  if (disabled) return <ReadOnlyInput label={label} value={value} />;

  return (
    <ListInput
      required
      outline
      autoFocus={autoFocus}
      error={error}
      type="text"
      label={label}
      value={value}
      inputClassName="resize-none"
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setError(undefined);
        assetDispatch({
          type: "update_value",
          payload: { property: "errors", value: [] },
        });
        const validationErrors = handleChange(
          assetDispatch,
          e.target.value,
          institutionAssetsNames
        );
        if (validationErrors) {
          setError(validationErrors.join(","));
          assetDispatch({
            type: "update_value",
            payload: {
              property: "errors",
              value: [...value, ...validationErrors],
            },
          });
        }
      }}
    />
  );
}

function handleChange(
  assetDispatch: React.Dispatch<AssessmentAction>,
  value: string,
  institutionAssetsNames: string[] | undefined
) {
  const validationErrors: string[] = [];

  const validatedValue = assetNameSchema.safeParse(value);
  if (!validatedValue.success)
    validatedValue.error.issues.forEach((issue) =>
      validationErrors.push(issue.message)
    );

  if (institutionAssetsNames && institutionAssetsNames.includes(value))
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
