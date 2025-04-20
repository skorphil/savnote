import type {
  RecordDraftAssetSchema,
  RecordDraftInstitutionSchema,
} from "../model/recordDraftSchema";
import {
  recordDraftStore,
  useRecordDraftLocalRowIds,
} from "../model/RecordDraftStore";

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
  useInstitutionAssets(institutionId: string) {
    return useRecordDraftLocalRowIds("assetsInstitution", institutionId);
  }

  getInstitutionData(institutionId: string) {
    return this.store.getRow("institutions", institutionId);
  }
}

type RecordDraftData = {
  institutions: Record<string, RecordDraftInstitutionSchema>;
  assets: Record<string, RecordDraftAssetSchema>;
};
