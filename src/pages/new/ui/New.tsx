import styles from "./New.module.css";
import { Button, Page, Link, Navbar, Card } from "konsta/react";
import { MdArrowBack, MdUpdate } from "react-icons/md";
import { useNavigate } from "react-router";

/**
 * Page displaying new record form
 */
function New() {
  const navigate = useNavigate();
  const institut = [1, 2, 3, 4, 5, 6];
  return (
    <Page className="no-scrollbar pb-24-safe">
      <Navbar
        left={
          <Link navbar onClick={() => void navigate(-1)}>
            <MdArrowBack size={24} />
          </Link>
        }
        title="Overview"
        subtitle="Draft saved"
        right={
          <div className="pr-4">
            <Button className="min-w-32" rounded>
              Save
            </Button>
          </div>
        }
        colors={{ bgMaterial: "bg-transparent" }}
        className="top-0"
        transparent={false}
      />

      <div className={styles.institutionsGrid}>
        {institut.map(() => (
          <Card className={styles.institutionCard}>
            <strong>Acba Bank long</strong>
            <MdUpdate size={24} />
          </Card>
        ))}
      </div>
    </Page>
  );
}

export { New };
