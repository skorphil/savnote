import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { BaseDirectory } from "@tauri-apps/plugin-fs";
import { useState } from "react";

import { readTextFile } from "@tauri-apps/plugin-fs";

export function ReadFileCard() {
  const [state, setState] = useState<string>("Not run yet");
  const [dir, setDir] = useState<keyof typeof BaseDirectory>("Home");
  const [fileName, setFileName] = useState<string>("Documents/file");

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Read .txt file from filesystem</IonCardTitle>
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
            onIonInput={(e) => setFileName(String(e.target.value))}
            label="File Name (without extension)"
            labelPlacement="floating"
            placeholder="Enter File name"
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonSelect
            label="Base Directory"
            placeholder="Favorite Fruit"
            value={dir}
            onIonChange={(e) => setDir(e.target.value)}
          >
            {Object.keys(BaseDirectory)
              .filter((key) => isNaN(Number(key)))
              .map((directory) => {
                const option = directory as keyof typeof BaseDirectory;
                return (
                  <IonSelectOption key={directory} value={option}>
                    {`$${option.toUpperCase()}`}
                  </IonSelectOption>
                );
              })}
          </IonSelect>
        </IonItem>
        <IonButton
          onClick={async (e) => {
            e.preventDefault();
            setState("Trying to read...");
            try {
              const content = await readTxtFile(`${fileName}.txt`, dir);
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

async function readTxtFile(
  fileName: string,
  directory: keyof typeof BaseDirectory
) {
  const file = await readTextFile(fileName, {
    baseDir: BaseDirectory[directory],
  });

  return file;
}
