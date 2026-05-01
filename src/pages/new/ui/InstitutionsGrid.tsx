import { Card } from "konsta/react";
import { MdAdd } from "react-icons/md";
import { type NavigateFunction, useParams } from "react-router";
import type { Table } from "tinybase/store";
import styles from "./InstitutionsGrid.module.css";

/**
 * Props for the InstitutionsGrid component.
 * @param institutions - A table of institutions keyed by their ID.
 * @param navigate - Navigation function to route to different pages.
 */
type InstitutionsGridProps = {
	institutions: Table;
	navigate: NavigateFunction;
};

/**
 * Grid component that displays a list of institutions as cards.
 * Allows selection and navigation to individual institution pages.
 * Includes an "add new institution" card at the end.
 * @param props - The component props containing institutions and navigate function.
 */
export function InstitutionsGrid(props: InstitutionsGridProps) {
	const { institutionId: selectedInstitutionId } = useParams();
	const { institutions, navigate /*isInstitutionSelected*/ } = props;
	return (
		<div className={`${styles.institutionsGrid}`}>
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
				onClick={() => void navigate(`/newrecord/institutions/create`)}
			>
				<MdAdd className="m-auto" opacity={0.5} size={24} />
			</Card>
		</div>
	);
}
