import styles from "./InstitutionsGrid.module.css";
import { Card } from "konsta/react";
import { MdAdd } from "react-icons/md";
import type { NavigateFunction } from "react-router";
import type { Table } from "tinybase/store";

type InstitutionsGridProps = {
  institutions: Table;
  navigate: NavigateFunction;
  isInstitutionSelected: boolean;
};
export function InstitutionsGrid(props: InstitutionsGridProps) {
  const { institutions, navigate /*isInstitutionSelected*/ } = props;
  return (
    <div className={`${styles.institutionsGrid}`}>
      {Object.entries(institutions).map(([institutionId, institution]) => (
        <Card
          key={institutionId}
          className={styles.institutionCard}
          onClick={() =>
            void navigate(`/newrecord/institutions/${institutionId}`, {
              replace: true, // isInstitutionSelected ? true : false,
            })
          }
        >
          <strong>{institution.name}</strong>
          <span className="mt-auto">{institution.country}</span>
        </Card>
      ))}
      <Card
        key={"add-institution"}
        className={styles.institutionCard}
        onClick={() => void navigate(``)} // TODO add Link
      >
        <MdAdd className="m-auto" opacity={0.5} size={24} />
      </Card>
    </div>
  );
}
