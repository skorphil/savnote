import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
} from "@ionic/react";

import { useState } from "react";
import Database from "tauri-plugin-sqlcipher-api";
import { copyFile, BaseDirectory } from "@tauri-apps/plugin-fs";

export function SaveDbCard() {
  const [state, setState] = useState<string>("Not run yet");
  const [fileName, setFileName] = useState<string>(
    "storage/emulated/0/Documents/testSql.db"
  );
  const [targetDir, setTargetDir] = useState<string>(
    "Documents/testSqlCopy.db"
  );

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Save DB to fs relative to $APPCONFIG</IonCardTitle>
      </IonCardHeader>
      <IonItem>
        <IonInput
          type={"text"}
          value={fileName}
          onIonInput={(e) => setFileName(String(e.target.value))}
          label="Path + file Name"
          labelPlacement="floating"
          placeholder="Enter File name"
        ></IonInput>
      </IonItem>
      <IonCardContent>
        <IonButton
          onClick={async (e) => {
            e.preventDefault();
            setState("Trying to createDb...");
            try {
              const db = await Database.load(`sqlite:${fileName}`, "password");
              await db.execute(`
               CREATE TABLE "testTable" (
    "test" CHAR(20) PRIMARY KEY
);

INSERT INTO testTable VALUES("testValue");

PRAGMA wal_checkpoint;
              `);
              setState(`DB saved`);
            } catch (error) {
              setState(error as string);
            }
          }}
        >
          Create DB
        </IonButton>

        <IonItem>
          <IonInput
            type={"text"}
            value={targetDir}
            onIonInput={(e) => setTargetDir(String(e.target.value))}
            label="Target direction, relative to $HOME"
            labelPlacement="floating"
            placeholder="Enter File name"
          ></IonInput>
        </IonItem>

        <IonButton
          onClick={async (e) => {
            e.preventDefault();
            setState("Trying to copy...");
            try {
              await copyFile(fileName, targetDir, {
                fromPathBaseDir: BaseDirectory.AppConfig,
                toPathBaseDir: BaseDirectory.Home,
              });
              setState(`DB copied`);
            } catch (error) {
              setState(error as string);
            }
          }}
        >
          Copy DB
        </IonButton>
      </IonCardContent>
      <p>{state}</p>
    </IonCard>
  );
}
