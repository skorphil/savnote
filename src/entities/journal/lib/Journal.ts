import {
  type EncryptionSchema,
  type JournalSchema,
  type MetaSchema,
  type RecordsSchema,
} from "@/shared/journal-schema";
import { throwError } from "@/shared/error-handling";
import {
  journalStore,
  journalStoreIndexes,
  journalStoreQueries,
  useJournalQueries,
  useJournalResultTable,
  useJournalSliceIds,
} from "../model/JournalStore";
import {
  validateInstitution,
  validateJournal,
  validateRecord,
} from "../model/validateJournal";
// import { createEncryptionKey } from "./encryptionUtils";
import { readJournal } from "./readJournal";
import { writeStringToFile } from "./writeStringToFile";

/**
 * Represents a journal. Provides various methods to work with a journal.
 * Initialised with .open() static method
 * Instance must be used to manage currently opened journal.
 * @example
 * const userJournal = Journal.open(...)
 * const data = Journal.instance?.useJournalSlices()
 */
export class Journal {
  static instance: Journal | undefined;
  // private cipher: string | 0 = 0;
  private directory!: string;
  meta!: MetaSchema;
  private encryption: EncryptionSchema | undefined = undefined;
  // private encryptionKey: CryptoKey | null = null;
  store = journalStore;
  storeIndexes = journalStoreIndexes;

  private constructor(props: JournalConctructorProps) {
    Journal.instance = this;
    const { directory, journalData } = props;
    if (!directory || !journalData)
      throw Error(
        "provide `directory` and `journalData` to create new Journal instance."
      );

    this.directory = directory;
    this.meta = journalData.meta;
    this.encryption = journalData.encryption;

    /* ---------- CODE BLOCK: Check if provided journal is encrypted ---------- */
    if (journalData.records && typeof journalData.records === "object") {
      this.store.setTables(journalData.records);
    }

    this.saveToDevice();

    // if (journalData.records && typeof journalData.records === "string") {
    //   this.cipher = journalData.records;
    // }
  }

  /**
   * Creates journal instance from existing journal.
   * Owervrites existing journal instance
   * @param directory Existing file directory
   * @param errorCallback Runs if error catched during reading journal. Receives error: unknown
   * @returns Journal instance or undefined if errorCallback handles the error
   */
  static async open(
    directory: string,
    errorCallback?: (e: unknown) => void
  ): Promise<Journal> {
    this.delete();
    try {
      const journalData = await readJournal(directory);
      const journal = new Journal({ directory, journalData });
      return journal;
    } catch (e) {
      if (errorCallback) {
        return errorCallback(e) as never;
      } else {
        throw e;
      }
    }
  }

  /**
   * Creates new journal and saves json to target directory.
   * Owervrites existing journal instance
   * @param directory Existing file directory
   * @returns Journal instance
   */
  static new(directory: string, journalData: JournalSchema) {
    this.delete();
    return new Journal({ directory, journalData });
  }

  /**
   * Deletes current Journal instance:
   * - in-memory storage of journal Data
   * - journal instance
   */
  static delete() {
    this.instance?.store.delTables();
    this.instance = undefined;
  }

  /* ---------- CODE BLOCK: Public methods need to be moved to separate file ---------- */

  // async decrypt(password: string) {
  //   // Derive encryption password
  //   // Decrypt cipher
  //   // Write plainText to PouchDb
  // }

  saveToDevice() {
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
    const stringifiedJournalData = JSON.stringify(validateJournal(journal));
    writeStringToFile(this.directory, stringifiedJournalData);
  }

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
  getEncryptionState() {
    return {
      encryption: this.encryption !== null,
      decrypted: this.store.hasTable("institutions"),
    };
  }
  getJournalName() {
    return this.meta.name;
  }
  getJournalDirectory() {
    return this.directory;
  }
  getEncryptionParameters() {
    return this.encryption?.derivedKeyAlgorithmName || null;
  }

  getInstitution(institutionId: string) {
    const institutionData = validateInstitution(
      this.store.getRow("institutions", institutionId)
    );
    return institutionData;
  }

  getLatestRecord() {
    const latestRecordDate =
      journalStoreIndexes.getSliceIds("InstitutionsByDate")[0];

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
      }
    );
    const latestRecordInstitutions = journalStoreQueries.getResultTable(
      latestInstitutionsQueryId
    );

    /* ---------- CODE BLOCK: Get latest assets ---------- */
    const latestAssetsQueryId = "latestRecordAssets";
    journalStoreQueries.setQueryDefinition(
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
      }
    );
    const latestRecordAssets =
      journalStoreQueries.getResultTable(latestAssetsQueryId);

    /* ---------- CODE BLOCK: Get latest quotes ---------- */
    const latestQuotesQueryId = "latestRecordQuotes";
    journalStoreQueries.setQueryDefinition(
      latestQuotesQueryId,
      "quotes",
      ({ select, where }) => {
        select("baseCurrency");
        select("counterCurrency");
        select("date");
        select("rate");
        where("date", Number(latestRecordDate));
      }
    );
    const latestRecordQuotes =
      journalStoreQueries.getResultTable(latestQuotesQueryId);

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

  /* ---------- CODE BLOCK: Hooks ---------- */
  useJournalSliceIds = useJournalSliceIds;
  useJournalQueries = useJournalQueries;
  useJournalResultTable = useJournalResultTable;

  /* ---------- CODE BLOCK: Setters ---------- */
  addRecord(recordData: RecordsSchema) {
    // setRow used because setTable overwrites tinyBase store.
    try {
      const { assets, institutions, quotes } = recordData;
      Object.entries(assets).forEach(([assetId, assetData]) =>
        this.store.setRow("assets", assetId, assetData)
      );
      Object.entries(institutions).forEach(([institutionId, institutionData]) =>
        this.store.setRow("institutions", institutionId, institutionData)
      );
      Object.entries(quotes).forEach(([quoteId, quoteData]) =>
        this.store.setRow("quotes", quoteId, quoteData)
      );
      this.saveToDevice();
    } catch (e) {
      throwError(e);
    }
  }
}

type JournalConctructorProps = {
  directory: string;
  journalData: JournalSchema;
};

/* ---------- Comments ----------
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
