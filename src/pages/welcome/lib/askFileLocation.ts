import { open } from "@tauri-apps/plugin-dialog";

export async function askFileLocation() {
  const file = await open({
    multiple: false,
    directory: false,
  });
  if (!file) throw Error("Can't open a file.");
  return file;
}
