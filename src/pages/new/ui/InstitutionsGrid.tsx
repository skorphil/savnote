import { Card } from "konsta/react";
import { MdAdd } from "react-icons/md";
import { type NavigateFunction, useParams } from "react-router";
import type { Table } from "tinybase/store";
import styles from "./InstitutionsGrid.module.css";

type InstitutionsGridProps = {
	institutions: Table;
	navigate: NavigateFunction;
};
export function InstitutionsGrid(props: InstitutionsGridProps) {
	const { institutionId: selectedInstitutionId } = useParams();
	const { institutions, navigate /*isInstitutionSelected*/ } = props;
	return (
		<div className={styles.institutionsGrid}>
			{Object.entries(institutions).map(([institutionId, institution]) => (
				<Card
					key={institutionId}
					outline={institutionId === selectedInstitutionId}
					className={`${styles.institutionCard} ${
						institution.isDeleted && "line-through opacity-40" // fix
					}`}
					onClick={() =>
						void navigate(`/newrecord/institutions/${institutionId}`, {
							replace: true,
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
				onClick={() => void navigate("/newrecord/institutions/create")}
			>
				<MdAdd className="m-auto" opacity={0.5} size={24} />
			</Card>
		</div>
	);
}
