import { useEffect, useState } from "react";
import { getNotebookPersistentData } from "./getNotebookPersistentData";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { throwError } from "@/shared/error-handling";
import { usePreferenceValue } from "@/entities/user-config";
import { isNotebook } from "./isNotebook";
import type { JournalSchema } from "@/shared/journal-schema";

/**
 * Gets notebook DTO from persistent store
 * @returns [notebook, filePath]
 */
export function useNotebookPersistendData(): [
	JournalSchema | null,
	string | null,
] {
	const filePath = usePreferenceValue("currentJournalDirectory") || null;
	const [notebook, setNotebook] = useState<JournalSchema | null>(null);

	useEffect(() => {
		async function fetchAndSetNotebook() {
			if (!filePath) {
				setNotebook(null);
				return;
			}

			try {
				const notebookData = await getNotebookPersistentData(
					() => readTextFile(filePath),
					isNotebook,
				);

				setNotebook(notebookData);
			} catch (e: unknown) {
				setNotebook(null);
				throwError(e);
			}
		}

		fetchAndSetNotebook();
	}, [filePath]);

	return [notebook, filePath];
}

/* ---------- CODE BLOCK: Description ----------
Hook acting as DI container, injecting dependencies.
*/
