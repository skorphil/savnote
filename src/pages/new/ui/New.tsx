import { Sheet } from "react-modal-sheet";
import styles from "./New.module.css";
import {
  Button,
  Page,
  Link,
  Navbar,
  Card,
  BlockTitle,
  Block,
  ListInput,
  List,
} from "konsta/react";
import { MdAdd, MdArrowBack, MdInfoOutline } from "react-icons/md";
import { type NavigateFunction, useNavigate, useParams } from "react-router";
import { recordDraftStore } from "@/features/create-record/model/RecordDraftStore";

import * as UiReact from "tinybase/ui-react/with-schemas";

import type { tinyBaseRecordDraftSchema } from "@/features/create-record/model/tinyBaseRecordDraftSchema";
import type { NoValuesSchema } from "tinybase/with-schemas";
import { unixToHumanReadable } from "@/shared/lib/date-time-format";
import { RecordDraft } from "@/features/create-record";
import type { Table } from "tinybase/store";
type Schemas = [typeof tinyBaseRecordDraftSchema, NoValuesSchema];

const { useTable, useRow } = UiReact as UiReact.WithSchemas<Schemas>;

/**
 * Page displaying new record form
 */
function New() {
  const { institutionId } = useParams();
  const institutions = useTable("institutions", recordDraftStore);
  const navigate = useNavigate();
  const date = RecordDraft.instance?.previousRecordDate;

  return (
    <Page
      className={`${institutionId && "pb-[240px]"} no-scrollbar flex flex-col`}
    >
      <Navbar
        left={
          <Link navbar onClick={() => void navigate(-1)}>
            <MdArrowBack size={24} />
          </Link>
        }
        title="Overview"
        subtitle="Draft saved"
        right={
          <div className="pr-3">
            <Button className="min-w-32" rounded>
              Save
            </Button>
          </div>
        }
        colors={{ bgMaterial: "bg-transparent" }}
        className="top-0"
        transparent={false}
      />

      {date ? (
        <BlockTitle withBlock={false}>
          Institutions from {unixToHumanReadable(date)}
        </BlockTitle>
      ) : (
        false
      )}

      <InstitutionsGrid institutions={institutions} navigate={navigate} />

      <Block className="opacity-40 gap-2 flex items-center mt-auto">
        <span>
          <MdInfoOutline size={24} />
        </span>
        <span>
          Select institution and update assets to reflect current savings
        </span>
      </Block>

      {institutionId && (
        <InstitutionSheet
          navigate={navigate}
          institutionId={institutionId}
          isOpen={institutionId ? true : false}
        />
      )}
    </Page>
  );
}

export { New };

type InstitutionsGridProps = {
  institutions: Table;
  navigate: NavigateFunction;
};
function InstitutionsGrid(props: InstitutionsGridProps) {
  const { institutions, navigate } = props;
  return (
    <div className={`${styles.institutionsGrid}`}>
      <Card
        key={"add-institution"}
        className={styles.institutionCard}
        onClick={() => void navigate(`/new/sheet`)}
      >
        <MdAdd className="m-auto" opacity={0.5} size={24} />
      </Card>
      {Object.entries(institutions).map(([institutionId, institution]) => (
        <Card
          key={institutionId}
          className={styles.institutionCard}
          onClick={() => void navigate(`/new/${institutionId}`)}
        >
          <strong>{institution.name}</strong>
          <span className="mt-auto">{institution.country}</span>
        </Card>
      ))}
    </div>
  );
}

type InstitutionSheetProps = {
  isOpen: boolean;
  institutionId: string;
  navigate: NavigateFunction;
};

function InstitutionSheet(props: InstitutionSheetProps) {
  const { isOpen, institutionId, navigate } = props;
  const recordDraftInstance = RecordDraft.instance;
  const institutionAssetsIds =
    recordDraftInstance?.useInstitutionAssets(institutionId);
  const institutionData =
    recordDraftInstance?.getInstitutionData(institutionId);
  return (
    <Sheet
      dragVelocityThreshold={100}
      isOpen={isOpen}
      onClose={() => void navigate("/new")}
      snapPoints={[-10]}
      initialSnap={0}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content disableDrag>
          {institutionId &&
            recordDraftStore.getCell("institutions", institutionId, "name")}
        </Sheet.Content>
        <Sheet.Scroller>
          <ListInput value={institutionData?.name} />
          {institutionAssetsIds &&
            institutionAssetsIds.map((assetId) => (
              <AssetForm assetId={assetId} />
            ))}
        </Sheet.Scroller>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
}

function AssetForm({ assetId }: { assetId: string }) {
  const { amount, currency, description, institution, isEarning, name } =
    useRow("assets", assetId, recordDraftStore);

  return (
    <>
      <BlockTitle>{`${institution} / ${name}`}</BlockTitle>
      <List>
        <ListInput label="name" value={`${name}`} />
        <div className="flex flex-row">
          <ListInput type="number" label="amount" value={amount} />
          <ListInput className="w-12" label="currency" value={currency} />
        </div>
        <ListInput value={isEarning} />
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
