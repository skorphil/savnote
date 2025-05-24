import {
  RecordDraft,
  // type RecordDraftAssetSchema,
} from "@/features/create-record";
import { Button, Card, Link, List, Navbar, Page } from "konsta/react";
import { MdClose, MdDeleteOutline } from "react-icons/md";
import {
  type NavigateFunction,
  useLoaderData,
  useNavigate,
} from "react-router";
import { AmountInput } from "./AmountInput";
import {
  type ExtendedDraftAssetState,
  useAssetDispatch,
  type AssetAction,
} from "./useAssetDispatch";
import { IsEarningCheckbox } from "./IsEarningCheckbox";
import { DescriptionInput } from "./DescriptionInput";
import { BottomAppBar } from "../BottomAppBar";
import type { assetStateLoader } from "../../lib/assetStateLoader";
import { NameInput } from "./NameInput";
import { currenciesByCode } from "@/shared/currencies";
import { SearchSelect } from "../SearchSelect";

const currenciesList = Object.entries(currenciesByCode).map(
  ([code, nameEn]) => {
    return { code: code, en: nameEn };
  }
);

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
      clear
      // className="min-w-20"
      rounded
      onClick={() => {
        handleAssetSave(navigate, assetState, assetDispatch, assetId);
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
    <Page className="z-1 pb-[80px]">
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
        className=" top-0 bg-neutral-800"
        transparent={false}
      />
      <List className="static">
        {isDeleted && <Card>To edit asset, restore it first</Card>}
        <div className="relative z-10">
          <NameInput
            errors={errors?.name}
            institutionAssetsNames={getInstitutionAssetsNames(institutionId)}
            autoFocus={!assetId ? true : false}
            assetDispatch={assetDispatch}
            value={name}
            disabled={assetId !== undefined || isDeleted}
          />
        </div>
        <div className="relative z-20 flex flex-row w-full gap-0">
          <AmountInput
            autoFocus={assetId ? true : false}
            // key={assetId + "amount"}
            // inputKey={assetId + "amount"}
            assetDispatch={assetDispatch}
            value={amount}
            disabled={isDeleted}
          />

          <SearchSelect
            errors={errors?.currency}
            keysToSearch={["en", "code"]}
            titleKey="en"
            valueKey="code"
            subtitleKey="code"
            data={currenciesList}
            onValueChange={(value) => {
              assetDispatch({
                type: "set_error",
                payload: {
                  property: "currency",
                  value: undefined,
                },
              });
              assetDispatch({
                type: "update_value",
                payload: { property: "currency", value: value },
              });
            }}
            value={currency.length > 0 ? currency : "Select currency..."}
            label="Currency"
            required
            outline
          />
          {/* <CurrencyInput
            assetDispatch={assetDispatch}
            value={currency}
            disabled={isDeleted}
          /> */}
        </div>
        <div className="relative z-10">
          <IsEarningCheckbox
            assetDispatch={assetDispatch}
            value={isEarning}
            disabled={isDeleted}
          />
        </div>
        <div className="relative z-10">
          <DescriptionInput
            assetDispatch={assetDispatch}
            value={description}
            disabled={isDeleted}
          />
        </div>
      </List>

      {isDeleted || (
        <div className="relative z-10">
          <BottomAppBar
            leftButtons={[
              <Link
                navbar
                onClick={() => {
                  void navigate(`/newrecord/institutions/${institutionId}`);
                  const updatedState = {
                    ...assetState,
                    isDeleted: true,
                  };
                  handleAssetSave(
                    navigate,
                    updatedState,
                    assetDispatch,
                    assetId
                  );
                }}
              >
                <MdDeleteOutline size={24} />
              </Link>,
            ]}
            bg="!-z-5 bg-md-light-surface dark:bg-md-dark-surface"
          />
        </div>
      )}
    </Page>
  );
}

function handleAssetSave(
  navigate: NavigateFunction,
  assetValues: ExtendedDraftAssetState,
  assetDispatch: React.Dispatch<AssetAction>,
  assetId?: string
) {
  if (assetId === undefined) {
    const { name, institution } = assetValues;
    assetId = `${institution}.${name}`;
  }

  let hasErrors = false;

  if (assetValues.errors)
    Object.values(assetValues.errors).forEach((errors) => {
      if (errors.length > 0 && !assetValues.isDeleted) {
        hasErrors = true;
      }
    });

  if (assetValues.name.length === 0) {
    assetDispatch({
      type: "set_error",
      payload: {
        property: "name",
        value: ["Enter institution name"],
      },
    });
    hasErrors = true;
  }
  if (assetValues.currency.length === 0 && !assetValues.isDeleted) {
    assetDispatch({
      type: "set_error",
      payload: {
        property: "currency",
        value: ["Select a currency"],
      },
    });
    hasErrors = true;
  }

  if (hasErrors) {
    console.log(JSON.stringify(assetValues.errors));
    return; // TODO warning chip
  }

  // TODO compare current values with initial to define isDirty
  const recordDraft = RecordDraft.instance;
  if (!recordDraft) throw Error("recordDraft instance not exist");
  // const currentValues = recordDraft.getAssetData(assetId);

  // const keys = new Set([
  //   ...Object.keys(assetValues),
  //   ...(currentValues ? Object.keys(currentValues) : []),
  // ]);

  // for (const key of keys as Set<keyof RecordDraftAssetSchema>) {
  //   if (currentValues && assetValues[key] !== currentValues[key]) {
  //     return recordDraft.saveAsset(assetId, { ...assetValues, isDirty: true });
  //   }
  // }
  recordDraft.saveAsset(assetId, { ...assetValues, isDirty: true });

  void navigate(-1);
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
  assetDispatch: React.Dispatch<AssetAction>;
  value: Value;
  disabled?: boolean;
  inputKey?: string;
  autoFocus?: boolean;
  errors?: string[];
};

/* ---------- CODE BLOCK: Description ----------

*/
