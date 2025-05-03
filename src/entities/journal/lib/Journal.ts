import type {
  EncryptionSchema,
  JournalSchema,
  MetaSchema,
  RecordsSchema,
} from "@/shared/journal-schema";
import { throwError } from "@/shared/error-handling";
import {
  journalStore,
  useJournalQueries,
  useJournalResultTable,
  useJournalSliceIds,
} from "../model/JournalStore";
import { validateJournal } from "../model/validateJournal";
import { createEncryptionKey } from "./encryptionUtils";
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
  private cipher: string | 0 = 0;
  private directory!: string;
  private meta!: MetaSchema;
  private encryption: EncryptionSchema | undefined = undefined;
  private encryptionKey: CryptoKey | null = null;
  store = journalStore;

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

    if (journalData.records && typeof journalData.records === "string") {
      this.cipher = journalData.records;
    }
  }

  /**
   * Creates journal instance from existing journal.
   * Owervrites existing journal instance
   * @param directory Existing file directory
   * @returns Journal instance
   */
  static async create(directory: string) {
    this.delete();
    const journalData = await readJournal(directory);
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
      records: this.store.getTables() || undefined, // TODO add encryption
    };
    const stringifiedJournalData = JSON.stringify(validateJournal(journal));
    writeStringToFile(this.directory, stringifiedJournalData);
  }

  async createEncryption(baseKey: string) {
    if (this.encryptionKey)
      throw Error(
        "Encryption password already exist. To change encription, run .changeEncryption()"
      );
    const encryptionParameters = await createEncryptionKey(baseKey);

    this.encryptionKey = encryptionParameters.encryptionKey;
    // this.meta.encryption = encryptionParameters.encryptionMeta; // The left-hand side of an assignment expression may not be an optional property access.
  }

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
