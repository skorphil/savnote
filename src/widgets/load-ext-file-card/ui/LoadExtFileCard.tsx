import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";

import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";

export function LoadExtFileCard() {
  const [state, setState] = useState<string>("Not run yet");

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Load file from filesystem with dialog</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <IonButton
          onClick={async (e) => {
            e.preventDefault();
            setState("Trying to read...");
            try {
              const directory = await loadExtFile();
              if (!directory) {
                setState("No directory loaded");
                return;
              }
              const content = await readTxtFile(directory);

              setState(`File: ${directory} content: ${content}`);
            } catch (error) {
              setState(error as string);
            }
          }}
        >
          Load file dialog
        </IonButton>
      </IonCardContent>
      <p>{state}</p>
    </IonCard>
  );
}

async function loadExtFile() {
  const path = await open({
    multiple: false,
    directory: false,
  });

  return path;
}

async function readTxtFile(fileName: string) {
  const fileContent = await readTextFile(fileName);

  return fileContent;
}
