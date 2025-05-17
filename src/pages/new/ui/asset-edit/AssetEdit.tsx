import {
  RecordDraft,
  type RecordDraftAssetSchema,
} from "@/features/create-record";
import { Button, Card, Link, List, Navbar, Page } from "konsta/react";
import { MdClose, MdDeleteOutline } from "react-icons/md";
import { useLoaderData, useNavigate } from "react-router";
import { AmountInput } from "./AmountInput";
import { useAssetDispatch, type AssessmentAction } from "./useAssetDispatch";
import { IsEarningCheckbox } from "./IsEarningCheckbox";
import { CurrencyInput } from "./CurrencyInput";
import { DescriptionInput } from "./DescriptionInput";
import { BottomAppBar } from "../BottomAppBar";
import type { assetStateLoader } from "../../lib/assetStateLoader";
import { NameInput } from "./NameInput";

/**
 * Page with a fullscreen modal with a form for editing asset
 * It contains local state and commit changes to recordDraft with Save button
 */
export function AssetEdit() {
  const {
    assetData: initialState,
    assetId,
    institutionId,
  } = useLoaderData<ReturnType<typeof assetStateLoader>>(); // how to type?
  const navigate = useNavigate();
  const [assetState, assetDispatch] = useAssetDispatch({
    ...initialState,
    errors: [],
  });
  const {
    amount,
    currency,
    description,
    institution,
    name,
    isDeleted,
    isEarning,
    errors,
  } = assetState;

  const topBarCTA = !isDeleted ? (
    <Button
      disabled={errors.length === 0 ? false : true}
      clear
      // className="min-w-20"
      rounded
      onClick={() => {
        handleAssetSave(assetState, assetId);
        void navigate(-1);
      }}
    >
      Save asset
    </Button>
  ) : (
    <Button
      // outline
      // className="min-w-24"
      rounded
      onClick={() => {
        assetDispatch({
          type: "update_value",
          payload: { property: "isDeleted", value: false },
        });
      }}
    >
      Restore asset
    </Button>
  );

  return (
    <Page className="pb-[80px]">
      <Navbar
        left={
          <Link navbar onClick={() => void navigate(-1)}>
            <MdClose size={24} />
          </Link>
        }
        title={"Edit asset"}
        subtitle={`${institution} / ${name}`}
        right={<div className="pr-3">{topBarCTA}</div>}
        colors={{ bgMaterial: "bg-transparent" }}
        className="top-0 bg-neutral-800"
        transparent={false}
      />
      <List>
        {isDeleted && <Card>To edit asset, restore it first</Card>}
        <NameInput
          institutionAssetsNames={getInstitutionAssetsNames(institutionId)}
          autoFocus={!assetId ? true : false}
          assetDispatch={assetDispatch}
          value={name}
          disabled={assetId !== undefined || isDeleted}
        />
        <div className="flex flex-row w-full">
          <AmountInput
            autoFocus={assetId ? true : false}
            // key={assetId + "amount"}
            // inputKey={assetId + "amount"}
            assetDispatch={assetDispatch}
            value={amount}
            disabled={isDeleted}
          />
          <CurrencyInput
            assetDispatch={assetDispatch}
            value={currency}
            disabled={isDeleted}
          />
        </div>
        <IsEarningCheckbox
          assetDispatch={assetDispatch}
          value={isEarning}
          disabled={isDeleted}
        />
        <DescriptionInput
          assetDispatch={assetDispatch}
          value={description}
          disabled={isDeleted}
        />
      </List>

      {isDeleted || (
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
                void handleAssetSave(updatedState, assetId);
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

function handleAssetSave(
  assetValues: RecordDraftAssetSchema,
  assetId?: string
) {
  if (assetId === undefined) {
    const { name, institution } = assetValues;
    assetId = `${institution}.${name}`;
  }
  // TODO compare current values with initial to define isDirty
  const recordDraft = RecordDraft.instance;
  if (!recordDraft) throw Error("recordDraft instance not exist");
  const currentValues = recordDraft.getAssetData(assetId);

  const keys = new Set([
    ...Object.keys(assetValues),
    ...(currentValues ? Object.keys(currentValues) : []),
  ]);

  for (const key of keys as Set<keyof RecordDraftAssetSchema>) {
    if (currentValues && assetValues[key] !== currentValues[key]) {
      return recordDraft.saveAsset(assetId, { ...assetValues, isDirty: true });
    }
  }
  return recordDraft.saveAsset(assetId, { ...assetValues, isDirty: false });
}

function getInstitutionAssetsNames(institutionId: string) {
  const recordDraft = RecordDraft.instance;
  if (!recordDraft) throw Error("recordDraft instance not exist");
  const institutionAssets = recordDraft.getInstitutionAssets(institutionId);
  if (institutionAssets.length === 0) return undefined;
  const assetNames: string[] = [];
  institutionAssets.forEach((assetId) => {
    const assetData = recordDraft.getAssetData(assetId);
    if (assetData) {
      assetNames.push(assetData.name);
    }
  });
  return assetNames;
}

export type AssetInputsProps<Value> = {
  assetDispatch: React.Dispatch<AssessmentAction>;
  value: Value;
  disabled?: boolean;
  inputKey?: string;
  autoFocus?: boolean;
};

/* ---------- CODE BLOCK: Description ----------

*/
