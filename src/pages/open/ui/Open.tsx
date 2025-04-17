import { Journal } from "@/entities/journal";
import { Preferences, usePreferenceValue } from "@/entities/preferences";
import { throwError } from "@/shared/lib/error-handling";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import styles from "./Open.module.css";
import {
  Button,
  Link,
  List,
  ListInput,
  ListItem,
  Navbar,
  Page,
} from "konsta/react";
import { MdExitToApp } from "react-icons/md";

/**
 * Page for opening provided Journal
 */
function Open() {
  const navigate = useNavigate();
  const journalUri = usePreferenceValue("currentJournalDirectory");
  const [journal, setJournal] = useState<undefined | Journal>(undefined);
  useEffect(() => {
    if (!journalUri) {
      void navigate("/");
      return;
    }
    async function openJournal() {
      const journal = await Journal.open({ directory: journalUri as string });
      setJournal(journal);
    }

    openJournal().catch((e: unknown) => throwError(e));
  }, [journalUri]);

  if (!journal) return <div>load</div>;

  const journalName = journal.getJournalName();
  const journalEncryption = journal.getEncryptionParameters();
  return (
    <Page className={styles.page}>
      <Navbar
        title={journalName}
        right={
          <Link onClick={handleJournalExit} navbar>
            <MdExitToApp size={24} />
          </Link>
        }
        medium
        colors={{ bgMaterial: "bg-transparent" }}
        className="top-0"
        transparent={false}
      />
      <List strong inset className="my-1">
        <ListItem
          className="break-words"
          title="Directory"
          text={journal.getJournalDirectory()}
        />

        <ListItem
          className="hairline-b relative"
          title="Encryption"
          text={journalEncryption || "Password not set"}
        />
        <div className="mt-4">
          {journalEncryption && (
            <ListInput
              required
              outline
              label="Password"
              type="password"
              autoFocus={true} // works only on manual navigation to page. not working if page is opened after rerendering
            />
          )}
          <NavLink to="/app">
            <Button className="w-[calc(100%-32px)] m-4" large rounded>
              Open
            </Button>
          </NavLink>
          {journalEncryption || (
            <NavLink to="/app">
              <Button className="w-[calc(100%-32px)] m-4" large outline rounded>
                Protect with a password
              </Button>
            </NavLink>
          )}
        </div>
      </List>
    </Page>
  );
}

export { Open };

function handleJournalExit() {
  Journal.delete();
  new Preferences().deleteValue("currentJournalDirectory");
}
