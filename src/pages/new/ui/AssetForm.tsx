import { RecordDraft } from "@/features/create-record";
import type { ValueIds } from "@/features/create-record/model/RecordDraftStore";
import { BlockTitle, Checkbox, List, ListInput, ListItem } from "konsta/react";
import { useRef, useState, type ChangeEvent } from "react";

export function AssetForm({ assetId }: { assetId: ValueIds<"assets"> }) {
  const recordDraft = RecordDraft.instance;
  if (!recordDraft) return;
  const { currency, description, institution, isEarning, name } =
    recordDraft.useInstitutionAsset(assetId);

  /*



  */
  return (
    <>
      <BlockTitle>{`${institution} / ${name}`}</BlockTitle>
      <List>
        <ListInput label="name" value={`${name}`} />
        <div className="flex flex-row">
          <AmountInput assetId={assetId} />
          <ListInput
            className="w-12"
            label="currency"
            value={currency}
            onChange={(e) =>
              handleCurrencyChange(
                e as ChangeEvent<HTMLInputElement>,
                recordDraft,
                assetId
              )
            }
          />
        </div>
        <ListItem
          label
          title="Earning asset"
          media={
            <Checkbox
              component="div"
              name="isEarning"
              checked={isEarning}
              // onChange={() => toggleGroupValue('Books')}
            />
          }
        />
        <ListInput
          type="textarea"
          label="Description"
          value={description}
          inputClassName="!h-20 resize-none"
        />
      </List>
    </>
  );
}

function AmountInput({ assetId }: { assetId: ValueIds<"assets"> }) {
  // TODO add formatting of numbers like "1 000
  // BUG cursor position resets if input non-valid characters
  // input.setSelectionRange(cursorPosition, cursorPosition);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordDraft = RecordDraft.instance;
  if (!recordDraft) return;

  const { amount } = recordDraft.useInstitutionAsset(assetId);
  const [value, setValue] = useState<string | null>(null); // how to update state

  return (
    <ListInput
      input={
        <input
          value={value || amount}
          onChange={(e) =>
            handleAmountChange(
              e,
              recordDraft,
              assetId,
              setValue,
              inputRef,
              amount
            )
          }
          className="bg-black"
          ref={inputRef}
        ></input>
      }
      onChange={(e) =>
        handleAmountChange(
          e as ChangeEvent<HTMLInputElement>,
          recordDraft,
          assetId,
          setValue,
          inputRef,
          amount
        )
      }
      inputMode="text"
      type="text"
      label="amount"
      value={value || amount}
    />
  );
}

function handleAmountChange(
  e: ChangeEvent<HTMLInputElement>,
  recordDraft: RecordDraft,
  assetId: string,
  setValue: React.Dispatch<React.SetStateAction<string | null>>,
  inputRef: React.RefObject<HTMLInputElement>,
  currentValue?: number
) {
  const input = inputRef.current; // e.target;
  const cursorPosition = input?.selectionStart;

  const numberValue = extractNumber(e.target.value);
  const letterDifference = e.target.value.length - numberValue.length;
  if (letterDifference > 0) {
    setTimeout(() => {
      input?.setSelectionRange(
        cursorPosition ? cursorPosition - letterDifference : null,
        cursorPosition ? cursorPosition - letterDifference : null
      );
    }, 0);
  }
  const hasTrailingDot = getValueWithTrailingDot(numberValue);
  if (hasTrailingDot) {
    if (currentValue && /^\d+(?:\s*\d+)*\.+[0-9]$/.test(String(currentValue))) {
      const value = Number(numberValue);
      recordDraft.setAssetAmount(value, assetId);
    }
    setValue(hasTrailingDot);
    return;
  }
  setValue(null);
  const value = Number(numberValue); // trailing dot cleaned

  recordDraft.setAssetAmount(value, assetId);
}

function getValueWithTrailingDot(value: string) {
  const match = value.match(/^\d+(?:\s*\d+)*\.(?![0-9])/);
  return match ? match[0] : null;
}

function handleCurrencyChange(
  e: ChangeEvent<HTMLInputElement>,
  recordDraft: RecordDraft,
  assetId: string
) {
  const value = e.target.value;
  recordDraft.setAssetCurrency(value, assetId);
}

function extractNumber(value: string) {
  const number = value.replace(/[a-zA-Z]/g, "");
  return number; // Return the number or null if no match
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
