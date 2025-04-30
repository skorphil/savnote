import { RecordDraft } from "@/features/create-record";
import type { ValueIds } from "@/features/create-record/model/RecordDraftStore";
import { ListInput } from "konsta/react";
import { NumericFormat } from "react-number-format";

export function AmountInput({ assetId }: { assetId: ValueIds<"assets"> }) {
  const recordDraft = RecordDraft.instance;
  if (!recordDraft) return;

  const { amount } = recordDraft.useInstitutionAsset(assetId);

  return (
    <NumericFormat
      label={"amount"}
      thousandSeparator={" "}
      value={amount}
      customInput={ListInput}
      onValueChange={({ value }) =>
        handleAmountChange(value, recordDraft, assetId)
      }
    />
  );
}

function handleAmountChange(
  value: string,
  recordDraft: RecordDraft,
  assetId: string
) {
  // TODO validate ZOD
  recordDraft.setAssetAmount(Number(value), assetId);
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
