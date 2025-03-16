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
            The <em>journal</em> is a local file for your records protected with
            a password.
          </p>
          <p className="mt-1">
            Regular backups help prevent accidental data loss. DB: {dbDir}
          </p>
        </div>
      </Block>
      <List className={styles.linksBlock}>
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
            handleJournalOpen().catch((e) => {
              if (e instanceof Error) console.error(e.message);
            });
          }}
          innerClassName={itemClass}
          strongTitle={true}
          title="Open existing"
        />
      </List>
    </Page>
  );
}

export default Welcome;
