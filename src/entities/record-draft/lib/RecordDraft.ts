import type {
  RecordDraftAssetSchema,
  RecordDraftInstitutionSchema,
} from "../model/recordDraftSchema";
import { recordDraftStore } from "../model/RecordDraftStore";

/**
 * Represents a record draft instance. Provides various methods to work with a record draft.
 * @returns Singletone record draft instance
 * @example
 */
export class RecordDraft {
  static instance: RecordDraft | undefined;
  store = recordDraftStore;
  previousRecordDate: number | undefined;
  constructor() {
    if (RecordDraft.instance) return RecordDraft.instance;
    RecordDraft.instance = this;
  }

  static create(recordDraftData: RecordDraftData) {}
}

type RecordDraftData = {
  institutions: Record<string, RecordDraftInstitutionSchema>;
  assets: Record<string, RecordDraftAssetSchema>;
};
