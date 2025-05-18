import {
  type NavigateFunction,
  useLoaderData,
  useNavigate,
} from "react-router";
import type { institutionStateLoader } from "../../lib/institutionStateLoader";
import {
  type ExtendedDraftInstitutionState,
  type InstitutionAction,
  useInstitutionDispatch,
} from "./useInstitutionDispatch";
import { InstitutionNameInput } from "./InstitutionNameInput";
import { Link, List, ListItem, Navbar, Page, Toggle } from "konsta/react";
import { MdClose } from "react-icons/md";
import { RecordDraft } from "@/features/create-record";
import { countriesList } from "@/shared/countries-names/countries";
import { useState } from "react";
import { SearchSelect } from "../SearchSelect";

/**
 * Fullscreen modal, containing institution form.
 * Can be used for editing existing institution or creating new one.
 */
export function InstitutionEdit() {
  const navigate = useNavigate();
  // New or existing
  const { institutionData: initialData, institutionId } =
    useLoaderData<ReturnType<typeof institutionStateLoader>>(); // how to type?
  const [institutionState, institutionDispatch] = useInstitutionDispatch({
    ...initialData,
  });
  const [noCountry, setNoCountry] = useState(false);

  const { country, name, errors } = institutionState;

  return (
    <Page className="pb-[80px]">
      <Navbar
        left={
          <Link navbar onClick={() => void navigate(-1)}>
            <MdClose size={24} />
          </Link>
        }
        title={`${institutionId ? "Edit" : "New"} institution`}
        subtitle={name}
        right={
          <Link
            toolbar
            onClick={() =>
              handleInstitutionSave({
                institutionDispatch,
                institutionValues: institutionState,
                noCountry,
                institutionId,
                navigate,
              })
            }
          >
            Save
          </Link>
        }
        colors={{ bgMaterial: "bg-transparent" }}
        className="!z-10 top-0 bg-neutral-800"
        transparent={false}
      />
      <List>
        <InstitutionNameInput
          recordInstitutionsNames={getRecordInstitutionsNames()}
          autoFocus={true}
          institutionDispatch={institutionDispatch}
          value={name}
        />
        <ListItem
          label
          title="Without country"
          media={
            <Toggle
              component="div"
              name="noCountry"
              checked={noCountry}
              onChange={() => setNoCountry((state) => !state)}
            />
          }
        />
        {noCountry || (
          <SearchSelect
            keysToSearch={["en"]}
            titleKey="en"
            valueKey="alpha2"
            errors={errors?.country || undefined}
            required
            value={country.length === 0 ? "Select country..." : country}
            data={countriesList}
            label="Country"
            outline
            onValueChange={(value) => {
              institutionDispatch({
                type: "update_value",
                payload: {
                  property: "errors",
                  value: { ...errors, country: [] },
                },
              });
              institutionDispatch({
                type: "update_value",
                payload: { property: "country", value: value as string },
              });
            }}
          />
        )}
      </List>
    </Page>
  );
}

type HandleInstitutionSaveProps = {
  institutionValues: ExtendedDraftInstitutionState;
  institutionId?: string;
  institutionDispatch: React.Dispatch<InstitutionAction>;
  noCountry: boolean;
  navigate: NavigateFunction;
};
function handleInstitutionSave(props: HandleInstitutionSaveProps) {
  const { institutionDispatch, institutionValues, noCountry, navigate } = props;
  let { institutionId } = props;

  if (institutionValues.errors)
    Object.values(institutionValues.errors).forEach((errors) => {
      if (errors.length > 0) {
        console.log(JSON.stringify(institutionValues.errors));
        return;
      }
    });

  if (institutionId === undefined) {
    const { name } = institutionValues;
    institutionId = name;
  }

  if (institutionValues.country.length === 0 && noCountry === false) {
    institutionDispatch({
      type: "update_value",
      payload: {
        property: "errors",
        value: {
          country: [
            ...(institutionValues.errors?.country || []),
            "Select a country",
          ],
        },
      },
    });
    return;
  }

  const institutionData = {
    ...institutionValues,
    errors: undefined,
    country: noCountry ? "" : institutionValues.country,
  };

  const recordDraft = RecordDraft.instance;
  if (!recordDraft) throw Error("recordDraft instance not exist");

  recordDraft.saveInstitution(institutionId, institutionData);
  void navigate(`/newrecord/institutions/${institutionId}`);
}

export type InstitutionInputsProps<Value> = {
  institutionDispatch: React.Dispatch<InstitutionAction>;
  value: Value;
  disabled?: boolean;
  inputKey?: string;
  autoFocus?: boolean;
};

function getRecordInstitutionsNames() {
  const recordDraft = RecordDraft.instance;

  if (!recordDraft) throw Error("recordDraft instance not exist");
  const institutions = recordDraft.getInstitutions();
  if (!institutions) return undefined;
  const institutionsNames: string[] = [];
  institutions.forEach((institutionId) => {
    const institutionsData = recordDraft.getInstitutionData(institutionId);
    if (!institutionsData) return undefined;
    if (institutionsData) {
      institutionsNames.push(institutionsData.name);
    }
  });
  return institutionsNames;
}
