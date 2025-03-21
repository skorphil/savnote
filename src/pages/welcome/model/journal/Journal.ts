import {
  type JournalSchema1,
  type MetaSchema1,
  type RecordSchema1,
} from "../journalSchema1";
import { readJournal } from "./readJournal";
import { throwError } from "../../lib/throwError";
import { createEncryptionKey } from "../../lib/encryptionUtils";
import PouchDB from "pouchdb-browser";
import { AppConfig } from "../app-config/AppConfig";

const defaultNewJournalData: JournalSchema1 = {
  meta: {
    appName: "savnote",
    dataFormat: "base64",
    encryption: null,
    version: 1,
    name: "My SavNote Journal",
  },
  data: {
    decrypted: true,
    records: null,
  },
};

const records: PouchDB.Database<RecordSchema1> = new PouchDB("records");

window.addEventListener("beforeunload", () => {
  records.destroy().catch((e) => throwError(e));
});

/**
 * Represents a journal instance. Provides various methods to work with a journal.
 * Initialised with .open() or .create() static methods
 * @returns Singletone Journal instance
 * @example
 * const userJournal = Journal.open(...)
 * const userJournal = Journal.create(...)
 */
export class Journal {
  static instance: Journal;
  private cipher: string | null = null;
  private directory!: string;
  private meta!: MetaSchema1;
  private encryptionKey: CryptoKey | null = null;
  private records = records;

  constructor(props: JournalConctructorProps) {
    const { directory, journalData } = props;
    if (Journal.instance) return Journal.instance;

    Journal.instance = this;

    this.directory = directory;
    this.meta = journalData.meta;
    this.saveDirectoryToPersitentStorage();

    if (
      typeof journalData.data !== "string" &&
      journalData.data.decrypted === true
    ) {
      journalData.data.records?.forEach((record) => {
        const doc = { ...record };
        this.records.put(doc).catch((e) => throwError(e));
      });
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
    const { directory, targetDirectory } = props;
    const journalData = await readJournal(directory);
    return new Journal({
      directory: targetDirectory,
      journalData,
    });
  }

  /**
   * Creates journal instance from scratch.
   * @returns Journal singletone instance
   */
  static async create(props: JournalCreateProps) {
    const { directory, name, password } = props;

    const journalData: JournalSchema1 = {
      ...defaultNewJournalData,
      meta: {
        ...defaultNewJournalData.meta,
        name: name,
      },
    };

    const journal = new Journal({
      directory: directory,
      journalData: journalData,
    });

    if (password) await journal.createEncryption(password);

    return journal;
  }

  /* ---------- CODE BLOCK: Public methods need to be moved to separate file ---------- */

  // async decrypt(password: string) {
  //   // Derive encryption password
  //   // Decrypt cipher
  //   // Write plainText to PouchDb
  // }

  // saveToDevice() {
  //   const data = {
  //     decrypted: true,
  //     records: this.records, // get from pouchDb
  //   };
  //   let cipher: string | null = null;
  //   if (this.encryptionPassword && this.meta.encryption) {
  //     cipher = this.encrypt({ plainText = JSON.stringify(data) });
  //   }

  //   const journal: object = {
  //     meta: { ...this.meta, encryption: undefined },
  //     data: cipher || data,
  //   };
  //   const stringifiedJournalData = JSON.stringify(validateJournal(journal));

  //   saveTextFileToExtStorage({
  //     data: stringifiedJournalData,
  //     targetDirectory: this.directory,
  //   }).catch((e) => throwError(e));
  // }

  getEncryptionState() {
    return {
      encryption: null,
      decrypted: true,
    };
  }

  /* ---------- CODE BLOCK: private methods ---------- */
  private saveDirectoryToPersitentStorage() {
    new AppConfig()
      .updateConfig({ currentJournalDirectory: this.directory })
      .catch((e) => throwError(e));
  }

  async createEncryption(baseKey: string) {
    if (this.encryptionKey)
      throw Error(
        "Encryption password already exist. To change encription, run .changeEncryption()"
      );
    const encryptionParameters = await createEncryptionKey(baseKey);

    this.encryptionKey = encryptionParameters.encryptionKey;
    this.meta.encryption = encryptionParameters.encryptionMeta; // The left-hand side of an assignment expression may not be an optional property access.
  }
}

type JournalCreateProps = {
  password?: string;
  directory: string;
  name?: string;
};

type JournalOpenProps = {
  directory: string;
  targetDirectory: string;
};

type JournalConctructorProps = {
  directory: string;
  journalData: JournalSchema1;
};

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

/* ---------- References ----------
- Used singletone patter because app is managing single journal only.

- Choosed singletone over `object` or `static class`
to make it more extendable in the future

Object.assign(MyClass.prototype, utils);
Object.assign(MyClass, utils);
*/
