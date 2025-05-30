import { JournalManager } from "@/entities/journal";
import { redirect } from "react-router";
import type {
	RecordDraftAssetSchema,
	RecordDraftInstitutionSchema,
	RecordDraftMetaSchema,
} from "../model/recordDraftSchema";

export function getRecordDraftData() {
	const journal = JournalManager.resume(() => redirect("/") as never);
	const {
		recordData: { assets, institutions },
		date,
	} = journal.getLatestRecord();

	/* ---------- CODE BLOCK: Convert Journal entries to recordDraft entries ---------- */
	const recordDraftInstitutions: Record<string, RecordDraftInstitutionSchema> =
		{};
	for (const { date, name, ...data } of Object.values(institutions)) {
		void date;
		recordDraftInstitutions[name] = {
			...data,
			name,
			isDirty: false,
			isDeleted: false,
			isNew: false,
		};
	}

	const recordDraftAssets: Record<string, RecordDraftAssetSchema> = {};
	for (const { date, name, institution, ...data } of Object.values(assets)) {
		void date;
		recordDraftAssets[`${institution}.${name}`] = {
			...data,
			institution,
			name,
			isDirty: false,
			isDeleted: false,
			isNew: false,
		};
	}

	const recordDraftMeta: Record<"0", RecordDraftMetaSchema> = {
		0: { journalId: journal.meta.id },
	};

	return {
		recordDraftData: {
			assets: recordDraftAssets,
			institutions: recordDraftInstitutions,
			meta: recordDraftMeta,
		},
		recordDate: Number(date),
	};
}
