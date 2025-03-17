import {
  type JournalSchema1,
  type MetaSchema1,
  type RecordSchema1,
} from "../journalSchema1";
import { readJournal } from "./readJournal";
import { journalFromString } from "./journalFromString";

/**
 * Represents a journal instance. Provides various methods to work with a journal.
 * Initialised with .open() static method
 * @example
 * const userJournal = Journal.open(journalUri)
 */
export class Journal {
  private path: string;
  private records: RecordSchema1[] | string | undefined = undefined;
  private meta: MetaSchema1;

  constructor(path: string, journalContent: JournalSchema1) {
    this.path = path;
    this.meta = journalContent.meta;
  }

  static async open(path: string) {
    const data = await readJournal(path);
    return new Journal(path, journalFromString(data));
  }

  get() {
    return this.meta;
  }
}
