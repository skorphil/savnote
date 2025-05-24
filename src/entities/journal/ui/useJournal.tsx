import {
	// useJournalQueries,
	// useJournalResultTable,
	useJournalSliceIds,
} from "../model/JournalStore";

/**
 * Reactive hook to get all recordDates in a journal
 */
export function useJournalRecordDates() {
	return useJournalSliceIds("InstitutionsByDate");
}
