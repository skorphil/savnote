import { useState } from "react";
import { handleJournalOpen } from "./handleJournalOpen";
import styles from "./Welcome.module.css";
import { Block, List, ListItem, Page } from "konsta/react";

const itemClass = "h-14 flex flex-col justify-center";

function Welcome() {
  const [dbDir, setDbDir] = useState<null | string>(null);

  return (
    <Page className={styles.page}>
      <Block className={styles.heroBlock}>
        <div className="my-auto">
          <h2 className="text-5xl font-medium">Create your savings journal</h2>
          <p className="mt-5">
            A journal is a password-protected file that safely stores your
            records on device. It remains accessible even if you uninstall
            SavNote, as long as you have the password. Regular manual backups
            are recommended to prevent accidental data loss.
          </p>
          state:{dbDir}
        </div>
        <List outline inset className={styles.linksBlock}>
          <ListItem
            innerClassName={itemClass}
            link
            strongTitle={true}
            title="Create new"
            className="hairline-b relative"
          />
          <ListItem
            link
            innerClassName={itemClass}
            strongTitle={true}
            title="Try sample"
          />
          <ListItem
            link
            onClick={() => {
              const handler = async () => {
                setDbDir(JSON.stringify(await handleJournalOpen()));
              };
              handler().catch((e) => {
                if (e instanceof Error) setDbDir(e.message);
              });
            }}
            innerClassName={itemClass}
            strongTitle={true}
            title="Open existing"
          />
        </List>
      </Block>
    </Page>
  );
}

export default Welcome;
