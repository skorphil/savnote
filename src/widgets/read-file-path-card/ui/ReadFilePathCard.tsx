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

import { readTextFile } from "@tauri-apps/plugin-fs";

export function ReadFilePathCard() {
  const [state, setState] = useState<string>("Not run yet");
  const [fileName, setFileName] = useState<string>(
    "/storage/emulated/0/Documents/file"
  );

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Read app's file from filesystem (full path)</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>
          Reads file created by app. Files created by other apps or user can't
          be read this way.
        </p>
        ---
        <pre>
          {`{
  "identifier": "fs:allow-read-text-file",
  "allow": [{ "path": "$HOME/Documents/*" }]
}`}
        </pre>
        <IonItem>
          <IonInput
            type={"text"}
            value={fileName}
            onIonInput={(e) => setFileName(String(e.target.value))} // how to
            label="File Name (without extension)"
            labelPlacement="floating"
            placeholder="Enter File name"
          ></IonInput>
        </IonItem>
        <IonButton
          onClick={async (e) => {
            e.preventDefault();
            setState("Trying to read...");
            try {
              const content = await readTxtFile(`${fileName}.txt`);
              setState(`File content: ${content}`);
            } catch (error) {
              setState(error as string);
            }
          }}
        >
          Read file
        </IonButton>
        <p>{state}</p>
      </IonCardContent>
    </IonCard>
  );
}

async function readTxtFile(fileName: string) {
  const file = await readTextFile(fileName);

  return file;
}
