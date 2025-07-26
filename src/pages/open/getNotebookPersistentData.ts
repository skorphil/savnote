import type { JournalSchema } from "@/shared/journal-schema";

/**
 * @returns notebook DTO from encrypted persistent storage
 */
export async function getNotebookPersistentData(
	readNotebook: readNotebook,
	isNotebook: isNotebook,
): Promise<JournalSchema> {
	let notebookDataString: string;
	try {
		notebookDataString = await readNotebook();
	} catch (e) {
		console.error(e);
		throw new Error("Can't read a file. Please submit a bug to our GitHub");
	}

	let notebookObject: unknown;
	try {
		notebookObject = JSON.parse(notebookDataString);
	} catch {
		throw Error("Can't validate notebook. Is it in SavNote format?");
	}

	if (isNotebook(notebookObject)) return notebookObject;
	throw Error("Can't validate notebook. Is it in SavNote format?");
}

/**
 * @returns JSON string with NotebookData from persistent storage
 */
type readNotebook = () => Promise<string>;

/**
 * Validates notebook against schema
 * @returns validated notebook DTO
 */
type isNotebook = (data: unknown) => data is JournalSchema;
