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
import { BaseDirectory, create } from "@tauri-apps/plugin-fs";
import { useState } from "react";

export function SaveFileCard() {
  const [state, setState] = useState<string>("Not run yet");
  const [dir, setDir] = useState<keyof typeof BaseDirectory>("Home");
  const [fileName, setFileName] = useState<string>("Documents/file");
  const [fileContent, setFileContent] = useState<string>("Hello World");

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Save .txt file to filesystem</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <p>{state}</p>
        <pre>
          // to access file in internal storage: <br />
          adb shell
          <br />
          run-as com.tauri_fs.app
          <br />
          ls ... <br />
          cat ...file.txt
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
          <IonInput
            type={"text"}
            value={fileContent}
            onIonInput={(e) => setFileContent(String(e.target.value))}
            label="File text"
            labelPlacement="floating"
            placeholder="Enter File content"
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
            setState("Trying to save...");
            try {
              const directory = await saveFile(fileName, fileContent, dir);
              setState(`File Saved to ${directory}`);
            } catch (error) {
              setState(error as string);
            }
          }}
        >
          Save file
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
}

async function saveFile(
  fileName: string = "FooBar",
  fileContent: string = "Hello World",
  directory: keyof typeof BaseDirectory
) {
  const file = await create(`${fileName}.txt`, {
    baseDir: BaseDirectory[directory],
  });

  await file.write(new TextEncoder().encode(fileContent));
  await file.close();

  return BaseDirectory[directory];
}
