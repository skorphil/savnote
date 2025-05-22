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
import { readJournal } from "./readJournal";
import { writeFileToAndroid } from "./writeFileToAndroid";
import { redirect } from "react-router";

import type { tinyBaseJournalSchema } from "../model/tinyBaseJournalSchema";

type JournalConctructorProps = {
  /**
   * Local directoy of json journal file. Need write and read permissions.
   */
  directory: string;
  journalData: JournalSchema;

  // store-related functions added to constructor for testing purposes
  store?: Store<[typeof tinyBaseJournalSchema, NoValuesSchema]>;
  storeIndexes?: Indexes<[typeof tinyBaseJournalSchema, NoValuesSchema]>;
  storeQueries?: Queries<[typeof tinyBaseJournalSchema, NoValuesSchema]>;

  deviceSaver?: DeviceSaver;
};

/**
 * journal singleton. Provides various methods to work with a journal.
 * Used with .open() .create() .resume() static method
 * @example
 * const userJournal = Journal.resume(...)
 * const data = userJournal.addRecord(...)
 */
export class Journal {
  /**
   * Journal singleton - represents currently opened journal.
   * Provides public API to manage the journal
   */
  static instance: Journal | undefined;
  /**
   * Local directoy of json journal file. Need write and read permissions.
   */
  private directory!: string;
  /**
   * Journal's meta data
   */
  meta!: MetaSchema;
  /* ---------- CODE BLOCK: Encryption ---------- */
  // private cipher: string | 0 = 0;
  // private encryptionKey: CryptoKey | null = null;
  private encryption: EncryptionSchema | undefined = undefined;

  /* ---------- CODE BLOCK: Storage ---------- */
  store: Store<[typeof tinyBaseJournalSchema, NoValuesSchema]>;
  storeIndexes: Indexes<[typeof tinyBaseJournalSchema, NoValuesSchema]>;
  storeQueries: Queries<[typeof tinyBaseJournalSchema, NoValuesSchema]>;

  deviceSaver: DeviceSaver;

  private constructor({
    store = journalStore,
    storeIndexes = journalStoreIndexes,
    storeQueries = journalStoreQueries,
    deviceSaver = writeFileToAndroid,
    ...props
  }: JournalConctructorProps) {
    Journal.instance = this;
    const { directory, journalData } = props;
    if (!directory || !journalData)
      throw Error(
        "provide `directory` and `journalData` to create new Journal instance."
      );
    this.store = store; // store: any, Unsafe assignment of an error typed value
    this.storeIndexes = storeIndexes;
    this.storeQueries = storeQueries;
    this.deviceSaver = deviceSaver;
    this.directory = directory;
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

  /**
   * Creates journal instance from existing journal JSON.
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
  static async create(directory: string, journalData: JournalSchema) {
    this.delete();
    validateJournal(journalData);
    const journal = new Journal({ directory, journalData });
    await journal.saveToDevice();
    return journal;
  }

  /**
   * @returns journal instanse (singletone)
   * @param errorCallback run if there is no journal instance
   */
  static resume(errorCallback?: () => never) {
    if (this.instance) return this.instance;
    if (errorCallback) return errorCallback();
    return redirect("/") as never;
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

  async saveToDevice() {
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
    await this.deviceSaver(this.directory, stringifiedJournalData);
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
      }
    );
    const latestRecordInstitutions = this.storeQueries.getResultTable(
      latestInstitutionsQueryId
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
      }
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
      }
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

  /* ---------- CODE BLOCK: Setters ---------- */
  async addRecord(recordData: RecordsSchema) {
    // setRow used because setTable overwrites tinyBase store.
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
    await this.saveToDevice();
  }
}

type DeviceSaver = (uri: string, content: string) => Promise<void>;

/* ---------- Comments ----------
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
