import { throwError } from "@/shared/error-handling";
import { handleJournalOpen } from "./handleJournalOpen";
import styles from "./Welcome.module.css";
import { Block, List, ListItem, Page } from "konsta/react";
import { useNavigate } from "react-router";

const itemClass = "touch-ripple-white h-14 flex flex-col justify-center";

function Welcome() {
  const navigate = useNavigate();

  return (
    <Page className={styles.page}>
      <Block className={styles.heroBlock}>
        <div className="my-auto">
          <h2 className="text-[40px] leading-[44px] font-medium">
            Create your savings journal
          </h2>
          <p className="mt-5">
            A journal is a password-protected file that safely stores your{" "}
            <strong>records on device</strong>.
          </p>
          <p className="mt-2">
            It remains accessible even if you uninstall SavNote, as long as you
            have the password.
          </p>
          <p className="mt-2">
            Regular <strong>manual backups</strong> are recommended to prevent
            accidental data loss.
          </p>
        </div>
      </Block>
      <List inset className={styles.linksBlock}>
        <ListItem
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
          link
          onClick={() => {
            const handler = async () => {
              await handleJournalOpen();
              await navigate("/");
            };
            handler().catch((e) => throwError(e));
          }}
          innerClassName={itemClass}
          strongTitle={false}
          title="Open existing"
        />
        {/* <ListItem
          link
          innerClassName={itemClass}
          strongTitle={false}
          title="Try sample"
        /> */}
      </List>
    </Page>
  );
}

export default Welcome;
