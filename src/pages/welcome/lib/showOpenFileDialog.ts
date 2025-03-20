import { open } from "@tauri-apps/plugin-dialog";

/**
 * Shows native dialog to choose file to open.
 * @returns File uri with read permissions
 */
export async function showOpenFileDialog() {
  const file = await open({
    multiple: false,
    directory: false,
  });
  if (!file) throw Error("Can't open a file.");
  return file;
}
