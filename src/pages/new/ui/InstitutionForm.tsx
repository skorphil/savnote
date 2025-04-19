import { useParams } from "react-router";
/**
 * New component
 *
 */
function InstitutionForm() {
  const { institutionId } = useParams();
  return <div>{institutionId}</div>;
}

export { InstitutionForm };
