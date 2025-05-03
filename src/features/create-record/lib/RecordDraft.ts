import type { RecordsSchema } from "@/shared/journal-schema";
import type {
  RecordDraftAssetSchema,
  RecordDraftInstitutionSchema,
  RecordDraftQuotesSchema,
} from "../model/recordDraftSchema";
import {
  recordDraftStore,
  useRecordDraftLocalRowIds,
  useRecordDraftRow,
  type ValueIds,
} from "../model/RecordDraftStore";
import { validateRecordDraftAsset } from "../model/validateRecordDraft";
import { validateRecord } from "@/entities/journal/model/validateJournal";

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

  getAssetData(assetId: string) {
    return this.store.getRow("assets", assetId);
  }

  // setAssetAmount(value: number, assetId: string) {
  //   const schema = recordDraftAssetSchema.shape.amount;
  //   try {
  //     const validatedValue = schema?.parse(value);
  //     return this.store.setCell("assets", assetId, "amount", validatedValue);
  //   } catch (e) {
  //     throw Error(e);
  //   }
  // }

  saveAsset(assetId: string, assetValues: RecordDraftAssetSchema) {
    const validatedAssetValues = validateRecordDraftAsset(assetValues);
    this.store.setRow("assets", assetId, validatedAssetValues);
  }

  async getRecordData(): Promise<RecordsSchema> {
    const date = Date.now();
    const quotes = await this.getQuotes(date);
    const { assets, institutions } = this.store.getTables();
    if (!assets || !institutions || !quotes)
      throw Error("RecordDraft is empty");
    const cleanedAssets: Record<string, object> = {};
    Object.values(assets).forEach((asset) => {
      const { isDirty, ...assetData } = asset;
      const { institution, name } = assetData;
      void isDirty;
      cleanedAssets[`${date}.${institution}.${name}`] = { ...assetData, date };
    });

    const cleanedInstitutions: Record<string, object> = {};
    Object.values(institutions).forEach((institution) => {
      const { isDirty, ...institutionData } = institution;
      const { name } = institutionData;
      void isDirty;
      cleanedInstitutions[`${date}.${name}`] = { ...institutionData, date };
    });

    const record = validateRecord({
      quotes,
      institutions: cleanedInstitutions,
      assets: cleanedAssets,
    });
    return record;
  }

  static delete() {
    this.instance?.store.delTables();
    this.instance = undefined;
  }

  private getBaseCurrencies() {
    const assets = this.store.getTable("assets");
    const baseCurrencies = new Set<string>();
    Object.values(assets).forEach(
      (asset) => asset.currency && baseCurrencies.add(asset.currency)
    );
    return Array.from(baseCurrencies);
  }

  async getQuotes(
    date: number,
    counterCurrencies = ["usd", "rub", "amd", "brl"]
  ) {
    const baseCurrencies = this.getBaseCurrencies();
    const quotes: RecordDraftQuotesSchema = {};

    const quotesDataPromises = baseCurrencies.map(async (baseCurrency) => {
      const { date: _, ...quoteRates } = await this.fetchQuote(baseCurrency);
      void _;
      counterCurrencies.forEach((counterCurrency) => {
        const rate = quoteRates[baseCurrency][counterCurrency];
        if (typeof rate !== "number")
          throw Error("Fetched rate is not a number");
        quotes[`${date}.${baseCurrency}.${counterCurrency}`] = {
          date,
          baseCurrency,
          counterCurrency,
          rate,
        };
      });
    });

    await Promise.all(quotesDataPromises);
    return quotes;
  }

  private async fetchQuote(baseCurrency: string, date?: string) {
    // TODO add fallback url https://github.com/fawazahmed0/exchange-api?tab=readme-ov-file#additional-fallback-url-on-cloudflare
    // TODO zod check date format

    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${
      date || "latest"
    }/v1/currencies/${baseCurrency}.json`;
    const response = await fetch(url);
    const quoteData = (await response.json()) as QuoteData;
    return quoteData;
  }

  // setAssetCurrency(value: string, assetId: string) {
  //   const cellValue = value; // TODO add validation
  //   return this.store.setCell("assets", assetId, "currency", cellValue);
  // }
}

type RecordDraftData = {
  institutions: Record<string, RecordDraftInstitutionSchema>;
  assets: Record<string, RecordDraftAssetSchema>;
};

type QuoteData = {
  date: string;
} & Record<string, Record<string, number>>;

/* ---------- CODE BLOCK: Comments ---------- 
1 may 2025
Implemented mvp of quote fetching.
Need to add counter currencies selection mechanism
*/
