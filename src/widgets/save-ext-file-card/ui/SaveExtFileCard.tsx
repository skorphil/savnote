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
import { save } from "@tauri-apps/plugin-dialog";

export function SaveExtFileCard() {
  const [state, setState] = useState<string>("Not run yet");
  const [fileName, setFileName] = useState<string>("Documents/file");

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Save file to filesystem with dialog</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <p>{state}</p>
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
        <IonButton
          onClick={async (e) => {
            e.preventDefault();
            setState("Trying to save...");
            try {
              const directory = await saveExtFile(fileName);
              setState(`File Saved to ${directory}`);
            } catch (error) {
              setState(error as string);
            }
          }}
        >
          Save file dialog
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
}

async function saveExtFile(fileName: string = "FooBar") {
  const path = await save({
    defaultPath: `${fileName}.txt`,
  });

  return path;
}
