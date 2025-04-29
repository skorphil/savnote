import {
  recordDraftAssetSchema,
  type RecordDraftAssetSchema,
  type RecordDraftInstitutionSchema,
} from "../model/recordDraftSchema";
import {
  recordDraftStore,
  useRecordDraftLocalRowIds,
  useRecordDraftRow,
  type ValueIds,
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
   * Hook to get assets table, for given institution
   */
  useInstitutionAssets(institutionId: string) {
    return useRecordDraftLocalRowIds("assetsInstitution", institutionId);
  }

  useInstitutionAsset(assetId: ValueIds<"assets">) {
    return useRecordDraftRow("assets", assetId);
  }

  getInstitutionData(institutionId: string) {
    return this.store.getRow("institutions", institutionId);
  }

  setAssetAmount(value: number, assetId: string) {
    const schema = recordDraftAssetSchema.shape.amount;
    try {
      const validatedValue = schema?.parse(value);
      return this.store.setCell("assets", assetId, "amount", validatedValue);
    } catch (e) {
      throw Error(e);
    }
  }

  setAssetCurrency(value: string, assetId: string) {
    const cellValue = value; // TODO add validation
    return this.store.setCell("assets", assetId, "currency", cellValue);
  }
}

type RecordDraftData = {
  institutions: Record<string, RecordDraftInstitutionSchema>;
  assets: Record<string, RecordDraftAssetSchema>;
};
