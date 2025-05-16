import { useParams } from "react-router";
/**
 * New component
 *
 */
export function InstitutionEdit() {
  // New or existing

  const { institutionId } = useParams();
  return <div>{institutionId}</div>;
}

function handleInstitutionSave() {
  return;
}
