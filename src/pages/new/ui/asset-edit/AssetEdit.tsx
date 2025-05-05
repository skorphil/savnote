import {
  RecordDraft,
  type RecordDraftAssetSchema,
} from "@/features/create-record";
import { Button, Card, Link, List, Navbar, Page } from "konsta/react";
import { MdArrowBack, MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router";
import { AmountInput } from "./AmountInput";
import { useAssetState, type AssessmentAction } from "./useAssetState";
import { IsEarningCheckbox } from "./IsEarningCheckbox";
import { CurrencyInput } from "./CurrencyInput";
import { DescriptionInput } from "./DescriptionInput";
import { BottomAppBar } from "../BottomAppBar";
import { ReadOnlyInput } from "./ReadOnlyInput";

/**
 * Fullscreen modal with a form for editing asset
 */
export function AssetEdit() {
  const navigate = useNavigate();
  const assetData = useAssetState();
  if (!assetData) return null;
  const { assetDispatch, assetState, assetId } = assetData;
  const { institution, name } = assetState;

  const topBarCTA = !assetState.isDeleted ? (
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
  ) : (
    <Button
      outline
      className="min-w-24"
      rounded
      onClick={() => {
        assetDispatch({
          type: "update_value",
          payload: { property: "isDeleted", value: false },
        });
        // const updatedState = {
        //   ...assetState,
        //   isDeleted: false,
        // };
        // handleAssetSave(assetId, updatedState);
      }}
    >
      Restore
    </Button>
  );

  return (
    <Page className="pb-[80px]">
      <Navbar
        left={
          <Link navbar onClick={() => void navigate(-1)}>
            <MdArrowBack size={24} />
          </Link>
        }
        title={"Edit asset"}
        subtitle={`${institution} / ${name}`}
        right={<div className="pr-3">{topBarCTA}</div>}
        colors={{ bgMaterial: "bg-transparent" }}
        className="top-0"
        transparent={false}
      />
      <List>
        {assetState.isDeleted && <Card>To edit asset, restore it first</Card>}
        <ReadOnlyInput label="Name" value={assetState.name} />
        <div className="flex flex-row w-full">
          <AmountInput
            assetDispatch={assetDispatch}
            value={assetState.amount}
            disabled={assetState.isDeleted}
          />
          <CurrencyInput
            assetDispatch={assetDispatch}
            value={assetState.currency}
            disabled={assetState.isDeleted}
          />
        </div>
        <IsEarningCheckbox
          assetDispatch={assetDispatch}
          value={assetState.isEarning}
          disabled={assetState.isDeleted}
        />
        <DescriptionInput
          assetDispatch={assetDispatch}
          value={assetState.description}
          disabled={assetState.isDeleted}
        />
      </List>

      {assetState.isDeleted || (
        <BottomAppBar
          leftButtons={[
            <Link
              navbar
              onClick={() => {
                void navigate(-1);
                const updatedState = {
                  ...assetState,
                  isDeleted: true,
                };
                void handleAssetSave(assetId, updatedState);
              }}
            >
              <MdDeleteOutline size={24} />
            </Link>,
          ]}
          bg="bg-md-light-surface dark:bg-md-dark-surface"
        />
      )}
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
  disabled?: boolean;
};

/* ---------- CODE BLOCK: Description ----------

*/
