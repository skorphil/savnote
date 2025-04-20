import type {
  RecordDraftAssetSchema,
  RecordDraftInstitutionSchema,
} from "../model/recordDraftSchema";
import { recordDraftStore } from "../model/RecordDraftStore";
import { useRecordDraftInstitutions } from "../model/RecordDraftStore";

/**
 * Represents a record draft instance. Provides various methods to work with a record draft.
 * @returns Singletone record draft instance
 * @example
 */
export class RecordDraft {
  static instance: RecordDraft | undefined;
  store = recordDraftStore;
  previousRecordDate: number | undefined;
  constructor(recordDraftData?: RecordDraftData, previousRecordDate?: number) {
    if (RecordDraft.instance) return RecordDraft.instance;
    RecordDraft.instance = this;

    if (recordDraftData) this.store.setTables(recordDraftData);
    this.previousRecordDate = previousRecordDate;
  }

  /**
   * Hook to get institutionsTable
   */
  useRecordDraftInstitutions = useRecordDraftInstitutions;
}

type RecordDraftData = {
  institutions: Record<string, RecordDraftInstitutionSchema>;
  assets: Record<string, RecordDraftAssetSchema>;
};
