import { handleJournalOpen } from "./handleJournalOpen";
import styles from "./Welcome.module.css";
import { List, ListItem, Page } from "konsta/react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";

const itemClass = "touch-ripple-white h-14 flex flex-col justify-center";

function Welcome() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>(undefined);

  return (
    <Page className={styles.page}>
      <div className={styles.heroBlock}>
        <img
          className="w-[50%] mb-10 mx-auto"
          src="journal.png"
          alt="Illustration with a person standing next to a safe"
        />
        <h2 className="text-[40px] leading-[44px] font-medium">
          Create your savings journal
        </h2>
        <p className="mt-5">
          Journal – password-protected file that safely stores your financial
          records{" "}
          <span className="py-[2px] px-[6px] rounded-sm bg-white bg-opacity-10">
            on this device
          </span>
        </p>
      </div>

      <List inset className={styles.linksBlock}>
        <ListItem
          aria-label="create-journal"
          innerClassName={itemClass}
          link
          onClick={() => {
            void navigate("/create");
          }}
          strongTitle={true}
          className="hairline-b relative"
          title="Create new"
        />
        <ListItem
          aria-label="open-journal"
          link
          onClick={() => {
            setError(undefined);
            const handler = async () => {
              await handleJournalOpen();
              void navigate("/open", { replace: true });
            };
            handler().catch((e: Error) => { setError(e.message); });
          }}
          innerClassName={itemClass}
          strongTitle={false}
          title="Open existing"
        />
      </List>
      {error && (
        <div className="text-sm p-4 bg-red-950 flex flex-row items-center gap-2">
          <MdErrorOutline />
          {error}
        </div>
      )}
    </Page>
  );
}

export default Welcome;

// TODO add start with sample

/* <ListItem
          link
          innerClassName={itemClass}
          strongTitle={false}
          title="Try sample"
        />

        <p className="mt-2">
              Regular <strong>manual backups</strong> are recommended to prevent
              accidental data loss.
            </p>

        <Block className="opacity-60 gap-2 flex items-center mt-20">
        <span>
          <MdInfoOutline size={24} />
        </span>
        <span>
          Journal remains accessible even if you uninstall SavNote, as long as
          you have the password.
        </span>
      </Block>

        */
