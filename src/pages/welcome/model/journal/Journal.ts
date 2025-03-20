import {
  type EncryptionSchema1,
  type JournalSchema1,
  type MetaSchema1,
  type RecordSchema1,
} from "../journalSchema1";
import { readJournal } from "./readJournal";
import { journalFromString } from "./journalFromString";
import { saveTextFileToExtStorage } from "../../lib/saveTextFileToExtStorage";
import { validateJournal } from "../validateJournal";
import { throwError } from "../../lib/throwError";
import PouchDb from "pouchdb-browser";

const db = new PouchDb("appState");

/**
 * Represents a journal instance. Provides various methods to work with a journal.
 * Initialised with .open() static method
 * @example
 * const userJournal = Journal.open(journalUri)
 */
export class Journal {
  private directory: string;
  private records: RecordSchema1[] | null = null;
  private meta: MetaSchema1;
  private encryptionPassword: string | null;

  constructor(props: JournalConctructorProps) {
    const { records, encryptionPassword, meta, directory } = props;
    this.encryptionPassword = encryptionPassword;
    this.directory = directory;
    this.meta = meta;

    db.get("appDataDir")
      .then(function (doc) {
        doc.journalDir = directory;
        return db.put(doc);
      })
      .catch((e) => throwError(e));
  }

  /**
   * Create journal instance from provided uri. If `targetUri` provided, the data
   * from `sourceDirectory` will be copied to `targetUri`
   *
   * @param props.sourceDirectory Existing file directory
   * @param props.targetDirectory (optional) Target file directory with read/write permissions.
   * Required if sorcedirectory doesn't provide write permissions
   *
   * @returns Journal instance
   */
  static async open(props: OpenProps) {
    const { sourceDirectory, targetDirectory } = props;
    const data = await readJournal(sourceDirectory);
    return new Journal(
      targetDirectory || sourceDirectory,
      journalFromString(data)
    );
  }

  // static create(uri: string, password: string, name: string) {
  //   // generate iv salt iterations
  //   // derive encryptionPassword
  //   return new Journal(uri, meta, encryptionPassword);
  // }

  saveToDevice() {
    const data: object = {
      meta: { ...this.meta, encryption: undefined },
      data: {
        decrypted: true,
        records: this.records, // TODO encrypt data
      },
    };
    const stringifiedJournalData = JSON.stringify(validateJournal(data));

    saveTextFileToExtStorage({
      data: stringifiedJournalData,
      targetDirectory: this.directory,
    }).catch((e) => throwError(e));
  }

  getRecords() {
    return this.meta;
  }

  // private encrypt (props: EncryptProps) {
  //   //
  //   const {} = props
  // }

  // private decrypt () {
  // }
}

type OpenProps = {
  sourceDirectory: string;
  targetDirectory?: string;
};

type EncryptProps = EncryptionSchema1 & {
  /**
   * Password to derive encryption password from
   */
  password: string;
};

type JournalConctructorProps = {
  directory: string;
  encryptionPassword: string | null;
  meta: MetaSchema1;
  /**
   * Decrypted records
   */
  records: RecordSchema1[] | null;
};
