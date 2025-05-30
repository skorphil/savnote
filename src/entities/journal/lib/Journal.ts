import type {
	EncryptionSchema,
	JournalSchema,
	MetaSchema,
	RecordsSchema,
} from "@/shared/journal-schema";
import type {
	Indexes,
	NoValuesSchema,
	Queries,
	Store,
} from "tinybase/with-schemas";

import {
	journalStore,
	journalStoreIndexes,
	journalStoreQueries,
} from "../model/JournalStore";
import {
	validateInstitution,
	validateJournal,
	validateRecord,
} from "../model/validateJournal";
import { readFileFromAndroid } from "./readFileFromAndroid";
import { writeFileToAndroid } from "./writeFileToAndroid";

import type { tinyBaseJournalSchema } from "../model/tinyBaseJournalSchema";

type JournalConctructorProps = {
	/**
	 * Local directoy of json journal file. Need write and read permissions.
	 */
	journalData: JournalSchema;
	// store-related functions added to constructor for testing purposes
	store?: Store<[typeof tinyBaseJournalSchema, NoValuesSchema]>;
	storeIndexes?: Indexes<[typeof tinyBaseJournalSchema, NoValuesSchema]>;
	storeQueries?: Queries<[typeof tinyBaseJournalSchema, NoValuesSchema]>;
};

/**
 * Private class. Represents savings Journal. Used as a singletone.
 * Created with JournalManager's .open() .create() .resume() methods
 * @example
 * const userJournal = JournalManager.resume(...)
 * const data = userJournal.addRecord(...)
 */
export class Journal {
	/**
	 * Journal's meta data
	 */
	meta: MetaSchema;
	/* ---------- CODE BLOCK: Encryption ---------- */
	// private cipher: string | 0 = 0;
	// private encryptionKey: CryptoKey | null = null;
	private encryption: EncryptionSchema | undefined = undefined;

	/* ---------- CODE BLOCK: Storage ---------- */
	store: Store<[typeof tinyBaseJournalSchema, NoValuesSchema]>;
	storeIndexes: Indexes<[typeof tinyBaseJournalSchema, NoValuesSchema]>;
	storeQueries: Queries<[typeof tinyBaseJournalSchema, NoValuesSchema]>;

	static deviceSaver: DeviceSaver = writeFileToAndroid;
	static deviceReader: DeviceReader = readFileFromAndroid;

	constructor({
		store = journalStore,
		storeIndexes = journalStoreIndexes,
		storeQueries = journalStoreQueries,
		...props
	}: JournalConctructorProps) {
		const { journalData } = props;

		this.store = store;
		this.storeIndexes = storeIndexes;
		this.storeQueries = storeQueries;
		this.meta = journalData.meta;
		this.encryption = journalData.encryption;

		/* ---------- CODE BLOCK: Check if provided journal is encrypted ---------- */
		if (journalData.records && typeof journalData.records === "object") {
			this.store.setTables(journalData.records);
		}
		// this.saveToDevice(); // need to mock because its android-related

		// if (journalData.records && typeof journalData.records === "string") {
		//   this.cipher = journalData.records;
		// }
	}

	// async decrypt(password: string) {
	//   // Derive encryption password
	//   // Decrypt cipher
	//   // Write plainText to PouchDb
	// }

	// async createEncryption(baseKey: string) {
	//   if (this.encryptionKey)
	//     throw Error(
	//       "Encryption password already exist. To change encription, run .changeEncryption()"
	//     );
	//   const encryptionParameters = await createEncryptionKey(baseKey);

	//   this.encryptionKey = encryptionParameters.encryptionKey;
	//   // this.meta.encryption = encryptionParameters.encryptionMeta; // The left-hand side of an assignment expression may not be an optional property access.
	// }

	/* ---------- CODE BLOCK: Getters ---------- */
	// Journal methods
	getEncryptionState() {
		return {
			encryption: this.encryption !== null,
			decrypted: this.store.hasTable("institutions"),
		};
	}
	getJournalName() {
		return this.meta.name;
	}

	getEncryptionParameters() {
		return this.encryption?.derivedKeyAlgorithmName || null;
	}

	getInstitution(institutionId: string) {
		const institutionData = validateInstitution(
			this.store.getRow("institutions", institutionId),
		);
		return institutionData;
	}

	getLatestRecord() {
		const latestRecordDate =
			this.storeIndexes.getSliceIds("InstitutionsByDate")[0];

		/* ---------- CODE BLOCK: Get latest institutions ---------- */
		const latestInstitutionsQueryId = "latestRecordInstitutions";
		journalStoreQueries.setQueryDefinition(
			latestInstitutionsQueryId,
			"institutions",
			({ select, where }) => {
				select("country");
				select("date");
				select("name");
				where("date", Number(latestRecordDate));
			},
		);
		const latestRecordInstitutions = this.storeQueries.getResultTable(
			latestInstitutionsQueryId,
		);

		/* ---------- CODE BLOCK: Get latest assets ---------- */
		const latestAssetsQueryId = "latestRecordAssets";
		this.storeQueries.setQueryDefinition(
			latestAssetsQueryId,
			"assets",
			({ select, where }) => {
				select("amount");
				select("currency");
				select("date");
				select("description");
				select("institution");
				select("isEarning");
				select("name");
				where("date", Number(latestRecordDate));
			},
		);
		const latestRecordAssets =
			this.storeQueries.getResultTable(latestAssetsQueryId);

		/* ---------- CODE BLOCK: Get latest quotes ---------- */
		const latestQuotesQueryId = "latestRecordQuotes";
		this.storeQueries.setQueryDefinition(
			latestQuotesQueryId,
			"quotes",
			({ select, where }) => {
				select("baseCurrency");
				select("counterCurrency");
				select("date");
				select("rate");
				where("date", Number(latestRecordDate));
			},
		);
		const latestRecordQuotes =
			this.storeQueries.getResultTable(latestQuotesQueryId);

		/* ---------- CODE BLOCK: Type output record ---------- */
		const latestRecord = validateRecord({
			institutions: latestRecordInstitutions,
			assets: latestRecordAssets,
			quotes: latestRecordQuotes,
		});

		return {
			recordData: latestRecord,
			date: latestRecordDate,
		};
	}

	/**
	 * @returns journal object
	 */
	toJournalSchema(): JournalSchema {
		// let cipher: string | null = null;
		// if (this.encryptionPassword && this.meta.encryption) {
		//   cipher = this.encrypt({ plainText = JSON.stringify(data) });
		// }
		const journal: object = {
			meta: this.meta,
			encryption: this.encryption,
			records:
				Object.keys(this.store.getTables()).length > 0
					? this.store.getTables()
					: undefined, // TODO add encryption
		};
		const validatedJournal = validateJournal(journal);
		return validatedJournal;
	}

	/* ---------- CODE BLOCK: Setters ---------- */
	async addRecord(recordData: RecordsSchema) {
		// setRow used because setTable overwrites tinyBase store.
		const { assets, institutions, quotes } = recordData;
		for (const [assetId, assetData] of Object.entries(assets)) {
			this.store.setRow("assets", assetId, assetData);
		}
		for (const [institutionId, institutionData] of Object.entries(
			institutions,
		)) {
			this.store.setRow("institutions", institutionId, institutionData);
		}
		for (const [quoteId, quoteData] of Object.entries(quotes)) {
			this.store.setRow("quotes", quoteId, quoteData);
		}
		// await this.saveToDevice(); // Need to explicitely save to device! Via JournalManager
	}
}

type DeviceSaver = (uri: string, content: string) => Promise<void>;
type DeviceReader = (uri: string) => Promise<string>;

/* ---------- Comments ----------
30may2025
Moved lifecycle methods to JournalManager

===
22May2025
Moved hooks to separate file src/entities/journal/ui/useJournal.tsx

===
- Used singletone pattern because app is managing single journal only.

- Choosed singletone over `object` or `static class`
to make it more extendable in the future
Object.assign(MyClass.prototype, utils);
Object.assign(MyClass, utils);

- I planned to store unencrypted records in PouchDB in memory, but
Pouch-DB memory-adapter not designed to work in browser
https://www.reddit.com/r/CouchDB/comments/1jgigdp/pouchdbadaptermemory_uncaught_referenceerror/
Storing records in indexedDB is not suitable because they are unencrypted.
There is no reliable way to clean indexedDB on app close.
*/
