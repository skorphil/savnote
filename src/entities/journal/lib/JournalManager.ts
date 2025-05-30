import { redirect } from "react-router";
import { validateJournal } from "../model/validateJournal";
import { Journal } from "./Journal";
import type { JournalSchema } from "@/shared/journal-schema";

let _journalInstance: Journal | undefined = undefined;
let _journalUri: string | undefined = undefined;

/**
 * Object provides methods for managing Journal instance lifecycle.
 */
export const JournalManager = {
	getJournal() {
		return _journalInstance;
	},
	getJournalDirectory() {
		return _journalUri;
	},
	/**
	 * Creates journal instance from existing journal JSON.
	 * Owervrites existing journal instance
	 * @param journalUri Existing file directory
	 * @param errorCallback Runs if error catched during reading journal. Receives error: unknown
	 * @returns Journal instance or undefined if errorCallback handles the error
	 */
	async open(
		journalUri: string,
		errorCallback?: (e: unknown) => void,
	): Promise<Journal> {
		_journalUri = journalUri;
		JournalManager.delete();

		try {
			const fileContent = await Journal.deviceReader(_journalUri);

			const unvalidatedJournal: unknown = JSON.parse(fileContent);
			if (typeof unvalidatedJournal !== "object" || unvalidatedJournal === null)
				throw new Error("Can't read a journal. Is it in SavNote format?");

			const validatedJournal = validateJournal(unvalidatedJournal);
			const journal = new Journal({
				journalData: validatedJournal,
			});
			_journalInstance = journal;
			return _journalInstance;
		} catch (e) {
			console.error(e);
			if (errorCallback) {
				errorCallback(e);
			}
			throw e;
		}
	},

	/**
	 * Creates new journal and saves json to target directory.
	 * Owervrites existing journal instance
	 * @param directory Existing file directory
	 * @returns Journal instance
	 */
	async create(directory: string, journalData: JournalSchema) {
		_journalUri = directory;
		JournalManager.delete();
		validateJournal(journalData);
		const journal = new Journal({ journalData });
		await JournalManager.saveToDevice();
		_journalInstance = journal;
		return _journalInstance;
	},

	/**
	 * @returns journal instanse (singletone)
	 * @param errorCallback run if there is no journal instance
	 */
	resume(errorCallback?: () => never) {
		if (_journalInstance) return _journalInstance;
		if (errorCallback) return errorCallback();
		return redirect("/") as never;
	},

	/**
	 * Deletes current Journal instance:
	 * - in-memory storage of journal Data
	 * - journal instance
	 */
	delete() {
		if (_journalInstance === undefined) return;
		_journalInstance.store.delTables();
		_journalInstance = undefined;
	},

	/**
	 * Saves journalData to device
	 */
	async saveToDevice() {
		if (!_journalUri)
			throw Error(
				"No journal instance created. Did you run JournalManager.create()?",
			);
		const journalJson = JSON.stringify(_journalInstance?.toJournalSchema());

		await Journal.deviceSaver(_journalUri, journalJson); // TODO refactor to new JournalStorage class
	},
};
