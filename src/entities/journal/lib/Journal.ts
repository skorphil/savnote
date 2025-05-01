import { readJournal } from "./readJournal";
import { createEncryptionKey } from "./encryptionUtils";
import { validateJournal, validateRecord } from "../model/validateJournal";
import type {
  EncryptionSchema,
  JournalSchema,
  MetaSchema,
  RecordsSchema,
} from "@/shared/journal-schema";
import {
  journalStore,
  useJournalQueries,
  useJournalResultTable,
  useJournalSliceIds,
} from "../model/JournalStore";
import { Preferences } from "@/entities/preferences"; // FIX the dependency in same layer
import { writeStringToFile } from "./writeStringToFile";
import { throwError } from "@/shared/lib/error-handling";

/**
 * Represents a journal instance. Provides various methods to work with a journal.
 * Initialised with .open() or .create() static methods
 * @returns Singletone Journal instance
 * @example
 * const userJournal = Journal.open(...)
 * const data = Journal.instance?.useJournalSlices
 */
export class Journal {
  static instance: Journal | undefined;
  private cipher: string | 0 = 0;
  private directory!: string;
  private meta!: MetaSchema;
  private encryption: EncryptionSchema | undefined = undefined;
  private encryptionKey: CryptoKey | null = null;
  records = journalStore;

  constructor(props: JournalConctructorProps) {
    if (Journal.instance) return Journal.instance;
    Journal.instance = this;
    const { directory, journalData } = props;
    if (!directory || !journalData)
      throw Error(
        "provide `directory` and `journalData` to create new Journal instance."
      );

    this.directory = directory;
    this.meta = journalData.meta;
    this.encryption = journalData.encryption;
    this.saveDirectoryToPersitentStorage();

    if (journalData.records && typeof journalData.records !== "string") {
      this.records.setTables(journalData.records);
    }
    if (journalData.records && typeof journalData.records === "string") {
      this.cipher = journalData.records;
    }
  }

  /**
   * Creates journal instance from existing journal.
   * If `targetUri` provided, the data from `sourceDirectory` will be copied to `targetUri`
   * @param props.sourceDirectory Existing file directory
   * @param props.targetDirectory (optional) Target file directory with read/write permissions.
   * Required if sorcedirectory doesn't provide write permissions
   *
   * @returns Journal singletone instance
   */
  static async open(props: JournalOpenProps) {
    if (Journal.instance) return Journal.instance;
    const { directory } = props;
    const journalData = await readJournal(directory);
    const journal = new Journal({
      directory,
      journalData,
    });

    return journal;
  }

  static delete() {
    this.instance?.records.delTables();
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
      records: this.records.getTables() || undefined, // TODO add encryption
    };
    const stringifiedJournalData = JSON.stringify(validateJournal(journal));
    writeStringToFile(this.directory, stringifiedJournalData);
  }

  saveTest(string: string) {
    writeStringToFile(this.directory, string);
  }

  getEncryptionState() {
    return {
      encryption: this.encryption !== null,
      decrypted: this.records.hasTable("institutions"),
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

  useJournalSliceIds = useJournalSliceIds;
  useJournalQueries = useJournalQueries;
  useJournalResultTable = useJournalResultTable;

  addRecord(recordData: RecordsSchema) {
    try {
      const validatedRecordData = validateRecord(recordData as object);
      this.records.setTables(validatedRecordData);
    } catch (e) {
      throwError(e);
    }
  }

  /* ---------- CODE BLOCK: private methods ---------- */
  private saveDirectoryToPersitentStorage() {
    if (!this.directory) throw Error("No directory specified for journal file");
    new Preferences().updatePreferences({
      currentJournalDirectory: this.directory,
    });
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
}

// type JournalCreateProps = {
//   password?: string;
//   directory: string;
//   name?: string;
// };

type JournalOpenProps = {
  directory: string;
};

type JournalConctructorProps = {
  directory: string;
  journalData: JournalSchema;
};

/* ---------- Comments ----------
- Used singletone patter because app is managing single journal only.

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

/**
 * Creates journal instance from scratch.
 * @returns Journal singletone instance
 */
// static async create(props: JournalCreateProps) {
//   const { directory, name, password } = props;

//   const journalData: JournalSchema = {
//     ...defaultNewJournalData,
//     meta: {
//       ...defaultNewJournalData.meta,
//       name: name,
//     },
//   };

//   const journal = new Journal({
//     directory: directory,
//     journalData: journalData,
//   });

//   if (password) await journal.createEncryption(password);

//   return journal;
// }

// async function encryptJSON(password, jsonData) {
//   const encoder = new TextEncoder();
//   const salt = window.crypto.getRandomValues(new Uint8Array(16));
//   const iv = window.crypto.getRandomValues(new Uint8Array(12));

//   const key = await deriveKey(password, salt);

//   const jsonString = JSON.stringify(jsonData);
//   const encryptedData = await window.crypto.subtle.encrypt(
//     { name: "AES-GCM", iv: iv },
//     key,
//     encoder.encode(jsonString)
//   );

//   return {
//     salt: Array.from(salt),
//     iv: Array.from(iv),
//     data: Array.from(new Uint8Array(encryptedData)),
//   };
// }

// // Example usage
// (async () => {
//   const password = prompt("Enter your password:");
//   const jsonData = { message: "Hello, encrypted world!" };

//   const encryptedJson = await encryptJSON(password, jsonData);
//   console.log("Encrypted JSON:", JSON.stringify(encryptedJson));
// })();

// async function decryptJSON(password, encryptedJson) {
//   const decoder = new TextDecoder();
//   const salt = new Uint8Array(encryptedJson.salt);
//   const iv = new Uint8Array(encryptedJson.iv);
//   const encryptedData = new Uint8Array(encryptedJson.data);

//   const key = await deriveKey(password, salt);

//   const decryptedData = await window.crypto.subtle.decrypt(
//     { name: "AES-GCM", iv: iv },
//     key,
//     encryptedData
//   );

//   return JSON.parse(decoder.decode(decryptedData));
// }

// // Example usage
// (async () => {
//   const password = prompt("Enter your password:");
//   const decryptedJson = await decryptJSON(password, encryptedJson);
//   console.log("Decrypted JSON:", decryptedJson);
// })();
