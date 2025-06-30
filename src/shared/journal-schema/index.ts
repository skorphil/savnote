import {
	assetSchema2,
	institutionSchema2,
	journalSchema2,
	quoteSchema2,
	quotesSchema2,
	recordsSchema2,
} from "./journalSchema2";

import type {
	AssetSchema2,
	EncryptionSchema2,
	InstitutionSchema2,
	JournalSchema2,
	MetaSchema2,
	QuotesSchema2,
	RecordsSchema2,
	QuoteSchema2,
} from "./journalSchema2";

export {
	journalSchema2 as journalSchema,
	assetSchema2 as assetSchema,
	institutionSchema2 as institutionSchema,
	quoteSchema2 as quoteSchema,
	quotesSchema2 as quotesSchema,
	recordsSchema2 as recordsSchema,
};

export type {
	JournalSchema2 as JournalSchema,
	EncryptionSchema2 as EncryptionSchema,
	MetaSchema2 as MetaSchema,
	RecordsSchema2 as RecordsSchema,
	QuotesSchema2 as QuotesSchema,
	QuoteSchema2 as QuoteSchema,
	AssetSchema2 as AssetSchema,
	InstitutionSchema2 as InstitutionSchema,
};
