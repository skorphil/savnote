import {
  RecordDraft,
  type RecordDraftAssetSchema,
} from "@/features/create-record";
import { Button, Link, List, Navbar, Page } from "konsta/react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router";
import { AmountInput } from "./AmountInput";
import { useAssetState, type AssessmentAction } from "./useAssetState";
import { IsEarningCheckbox } from "./IsEarningCheckbox";
import { CurrencyInput } from "./CurrencyInput";
import { DescriptionInput } from "./DescriptionInput";
import { NameInput } from "./NameInput";

/**
 * Fullscreen modal with a form for editing asset
 */
export function AssetEdit() {
  const navigate = useNavigate();
  const assetData = useAssetState();
  if (!assetData) return null;
  const { assetDispatch, assetState, assetId } = assetData;
  const { institution, name } = assetState;

  return (
    <Page>
      <Navbar
        left={
          <Link navbar onClick={() => void navigate(-1)}>
            <MdArrowBack size={24} />
          </Link>
        }
        title="Edit asset"
        subtitle={`${institution} / ${name}`}
        right={
          <div className="pr-3">
            <Button
              outline
              className="min-w-24"
              rounded
              onClick={() => {
                handleAssetSave(assetId, assetState);
                void navigate(-1);
              }}
            >
              Save
            </Button>
          </div>
        }
        colors={{ bgMaterial: "bg-transparent" }}
        className="top-0"
        transparent={false}
      />

      <List>
        <NameInput assetDispatch={assetDispatch} value={assetState.name} />
        <div className="flex flex-row w-full">
          <AmountInput
            assetDispatch={assetDispatch}
            value={assetState.amount}
          />
          <CurrencyInput
            assetDispatch={assetDispatch}
            value={assetState.currency}
          />
        </div>
        <IsEarningCheckbox
          assetDispatch={assetDispatch}
          value={assetState.isEarning}
        />
        <DescriptionInput
          assetDispatch={assetDispatch}
          value={assetState.description}
        />
      </List>
    </Page>
  );
}

function handleAssetSave(assetId: string, assetValues: RecordDraftAssetSchema) {
  const recordDraft = RecordDraft.instance;
  if (!recordDraft) throw Error("recordDraft instance not exist");
  const currentValues = recordDraft.getAssetData(assetId);

  const keys = new Set([
    ...Object.keys(assetValues),
    ...Object.keys(currentValues),
  ]);

  for (const key of keys as Set<keyof RecordDraftAssetSchema>) {
    if (assetValues[key] !== currentValues[key]) {
      return recordDraft.saveAsset(assetId, { ...assetValues, isDirty: true }); // FIX compare with "original draft state" which needs to be created. Now dirty state is wrong
    }
  }
  return recordDraft.saveAsset(assetId, { ...assetValues, isDirty: false });
}

export type AssetInputsProps<Value> = {
  assetDispatch: React.Dispatch<AssessmentAction>;
  value: Value;
};

/* ---------- CODE BLOCK: Description ----------

*/
