import { Journal, journalStoreQueries } from "@/entities/journal";
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
} from "konsta/react";
import { MdAdd, MdArrowBack, MdInfoOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router";

/**
 * Page displaying new record form
 */
function New() {
  const { institutionId } = useParams();
  const journal = Journal.instance;
  const latestRecordDate = journal?.useJournalSliceIds("InstitutionsByDate")[0];
  const navigate = useNavigate();

  if (!latestRecordDate) return <p>No records</p>;
  journalStoreQueries.setQueryDefinition(
    latestRecordDate,
    "institutions",
    ({ select, where }) => {
      select("name");
      select("date");
      select("country");
      where("date", Number(latestRecordDate));
    }
  );
  const institutionsAtDate =
    journalStoreQueries.getResultTable(latestRecordDate);

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

      <BlockTitle withBlock={false}>Institutions from latest record</BlockTitle>
      <div className={`${styles.institutionsGrid}`}>
        <Card
          key={institutionId}
          className={styles.institutionCard}
          onClick={() => void navigate(`/new/sheet`)}
        >
          <MdAdd className="m-auto" opacity={0.5} size={24} />
        </Card>
        {Object.entries(institutionsAtDate).map(
          ([institutionId, institution]) => (
            <Card
              key={institutionId}
              className={styles.institutionCard}
              onClick={() => void navigate(`/new/${institutionId}`)}
            >
              <strong>{institution.name}</strong>
              <span className="mt-auto">{institution.country}</span>
            </Card>
          )
        )}
      </div>
      <Block className="opacity-40 gap-2 flex items-center mt-auto">
        <span>
          <MdInfoOutline size={24} />
        </span>
        <span>
          Select institution and update assets to reflect current savings
        </span>
      </Block>

      <Sheet
        prefersReducedMotion
        dragVelocityThreshold={100}
        isOpen={institutionId ? true : false}
        onClose={() => void navigate("/new")}
        snapPoints={[-10, 280]}
        initialSnap={1}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content disableDrag>
            <p>{institutionId || "no id selected"}</p>
            <ListInput />
          </Sheet.Content>
        </Sheet.Container>
        {/* <Sheet.Backdrop /> */}
      </Sheet>
    </Page>
  );
}

export { New };
