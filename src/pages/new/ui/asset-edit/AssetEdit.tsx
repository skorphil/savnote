import { RecordDraft } from "@/features/create-record";
import {
  Button,
  Checkbox,
  Link,
  List,
  ListInput,
  ListItem,
  Navbar,
  Page,
} from "konsta/react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router";

import type { ValueIds } from "@/features/create-record/model/RecordDraftStore";
import { useReducer, type ChangeEvent } from "react";
import { AmountInput } from "./AmountInput";

/**
 * New component
 *
 */
function AssetEdit() {
  // TODO onAssetSave save all reducer values to record draft
  // const {} = useReducer() // TODO add reducer to handle all input changes
  const { assetId } = useParams();
  const navigate = useNavigate();
  const recordDraft = RecordDraft.instance;
  if (!recordDraft || !assetId) return;
  const { currency, description, institution, isEarning, name } =
    recordDraft.useInstitutionAsset(assetId as ValueIds<"assets">);

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
            <Button outline className="min-w-20" rounded>
              Save
            </Button>
          </div>
        }
        colors={{ bgMaterial: "bg-transparent" }}
        className="top-0"
        transparent={false}
      />

      <List>
        <ListInput label="name" value={`${name}`} />
        <div className="flex flex-row w-full">
          <AmountInput assetId={assetId as ValueIds<"assets">} />
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
    </Page>
  );
}

export default AssetEdit;

function handleCurrencyChange(
  e: ChangeEvent<HTMLInputElement>,
  recordDraft: RecordDraft,
  assetId: string
) {
  const value = e.target.value;
  recordDraft.setAssetCurrency(value, assetId);
}

/* ---------- CODE BLOCK: Description ----------

*/
