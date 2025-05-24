import {
	journalStore,
	journalStoreQueries,
	useJournalRecordDates,
} from "@/entities/journal";
import { Preferences } from "@/entities/user-config";

const preferences = Preferences.getInstance();

/**
 * Hook to provide financial summary of journal records
 */
function useSummaryData() {
	let { selectedCurrency } = preferences.getPreferences(["selectedCurrency"]);
	const recordDates = useJournalRecordDates();

	if (selectedCurrency === undefined) selectedCurrency = "usd";

	const summaryData = recordDates.map((date) => {
		journalStoreQueries.setQueryDefinition(
			date,
			"assets",
			({ select, where }) => {
				select("date");
				select("amount");
				select("currency");
				where("date", Number(date));
			},
		);
		let totalInCounterCurrency = 0;
		journalStoreQueries.forEachResultRow(date, (rowId) => {
			const { amount, currency: baseCurrency } = journalStore.getRow(
				"assets",
				rowId,
			);
			const { rate } = journalStore.getRow(
				"quotes",
				`${date}.${baseCurrency}.${selectedCurrency}`,
			);
			if (
				amount === undefined ||
				baseCurrency === undefined ||
				rate === undefined
			)
				throw Error("Cant find currencies information");
			const amountInCounterCurrency = amount * rate;
			totalInCounterCurrency += amountInCounterCurrency;
		});
		journalStoreQueries.delQueryDefinition(date);
		return { total: totalInCounterCurrency, date };
	});

	return summaryData;
}

export { useSummaryData };
