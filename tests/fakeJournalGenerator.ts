import { validateJournal } from "@/entities/journal";
import type {
	AssetSchema,
	InstitutionSchema,
	JournalSchema,
	QuoteSchema,
} from "@/shared/journal-schema";
import { writeFile } from "node:fs/promises";

/**
 * Institutions names
 */
const institutions = [
	{ name: "JPMorgan Chase", country: "us" },
	{ name: "Bank of America", country: "us" },
	{ name: "Wells Fargo", country: "us" },

	{ name: "Industrial and Commercial Bank of China (ICBC)", country: "cn" },
	{ name: "Agricultural Bank of China", country: "cn" },
	{ name: "China Construction Bank", country: "cn" },

	{ name: "Mitsubishi UFJ Financial Group (MUFG)", country: "jp" },
	{ name: "Sumitomo Mitsui Financial Group", country: "jp" },
	{ name: "Mizuho Financial Group", country: "jp" },

	{ name: "HSBC Holdings", country: "gb" },
	{ name: "Barclays", country: "gb" },
	{ name: "Lloyds Banking Group", country: "gb" },

	{ name: "BNP Paribas", country: "fr" },
	{ name: "Crédit Agricole Group", country: "fr" },
	{ name: "Société Générale", country: "fr" },

	{ name: "Royal Bank of Canada (RBC)", country: "ca" },
	{ name: "Toronto-Dominion Bank (TD Bank)", country: "ca" },
	{ name: "Bank of Nova Scotia (Scotiabank)", country: "ca" },

	{ name: "Deutsche Bank", country: "de" },
	{ name: "DZ Bank Group", country: "de" },
	{ name: "Commerzbank", country: "de" },

	{ name: "Commonwealth Bank of Australia (CBA)", country: "au" },
	{ name: "Westpac Banking Corporation (WBC)", country: "au" },
	{ name: "National Australia Bank (NAB)", country: "au" },

	{ name: "CoinBase", country: "" },
	{ name: "Ledger Wallet", country: "" },
	{ name: "Binance", country: "" },
] as const;

const userAssetNames = [
	"Main Checking",
	"My Visa Card",
	"Savings Account",
	"Deposit",
	"Virtual Card",
	"Joint Account (Bills)",
	"Travel Fund",
	"Emergency Stash",
	"Kids' College Savings",
	"Rent & Utilities",
	"Groceries Budget",
	"Fun Money",
	"Online Purchases Card",
	"Investment Link",
	"Side Hustle Income",
	"Vacation Savings",
	"Car Maintenance Fund",
	"Credit Card (Primary)",
	"Digital Spending Card",
	"Future Home Fund",
] as const;

const currencies = ["usd", "cny", "eur", "brl"] as const;

const meta = {
	appName: "savnote",
	version: 2,
	name: "Jack's Demo Journal",
	id: "aafsh-gftdhj-ugksab",
} as const;

const quotes = [
	{
		baseCurrency: "usd",
		counterCurrency: "usd",
		rate: [1, 1],
	},
	{
		baseCurrency: "cny",
		counterCurrency: "usd",
		rate: [0.135, 0.14],
	},
	{
		date: 1688414400000,
		baseCurrency: "brl",
		counterCurrency: "usd",
		rate: [0.16, 0.185],
	},
	{
		date: 1688414400000,
		baseCurrency: "eur",
		counterCurrency: "usd",
		rate: [1.025, 1.175],
	},
];

type GenerateJournalProps = {
	institutionsPerMonth: number;
	months: number;
	monthFromCurrent: number;
	assetsPerInstitution: number;
};

function generateJournal(props: GenerateJournalProps) {
	const {
		institutionsPerMonth,
		months,
		monthFromCurrent,
		assetsPerInstitution,
	} = props;
	const monthList = generateListOfMonthsUnix(monthFromCurrent, months);
	const selectedInstitutions = generateRandomIndex(
		institutions.length - 1,
		institutionsPerMonth,
	).map((index) => institutions[index]);

	// Generate random asset names and currencies for each institution
	const institutionsWithAssets: {
		name: string;
		country: string;
		assets: { name: string; isEarning: boolean; currency: string }[];
	}[] = [];
	for (const institution of selectedInstitutions) {
		const assetsForInstitution = generateRandomIndex(
			userAssetNames.length - 1,
			assetsPerInstitution,
		).map((index) => {
			return {
				name: userAssetNames[index],
				isEarning: Boolean(generateRandom([0, 1], 1)),
				currency: currencies[generateRandom([0, currencies.length - 1], 1)],
			};
		});

		institutionsWithAssets.push({
			...institution,
			assets: assetsForInstitution,
		});
	}
	const quoteList: Record<string, QuoteSchema> = {};
	const institutionsList: Record<string, InstitutionSchema> = {};
	const assetsList: Record<string, AssetSchema> = {};
	for (const date of monthList) {
		for (const quote of quotes) {
			const quoteName = `${date}.${quote.baseCurrency}.${quote.counterCurrency}`;
			const quoteData: QuoteSchema = {
				...quote,
				rate: generateRandom(quote.rate, 0.005),
				date,
			};
			quoteList[quoteName] = quoteData;
		}
		for (const institution of institutionsWithAssets) {
			const institutionName = `${date}.${institution.name}`;
			institutionsList[institutionName] = {
				date,
				name: institution.name,
				country: institution.country,
			};
			for (const asset of institution.assets) {
				const assetName = `${date}.${institution.name}.${asset.name}`;
				const assetData: AssetSchema = {
					...asset,
					date: date,
					institution: institution.name,
					amount: generateRandom([10000, 20000], 1000),
					description: "",
				};
				assetsList[assetName] = assetData;
			}
		}
	}

	const journal: JournalSchema = {
		meta,
		records: {
			institutions: institutionsList,
			assets: assetsList,
			quotes: quoteList,
		},
	};

	validateJournal(journal);

	saveJsonToFile("test-journal.json", journal);
}

function generateRandomIndex(maxIndex: number, count: number) {
	if (maxIndex <= 0) {
		throw Error("maxIndex must be larger than 0");
	}
	if (count <= 0) {
		throw Error("count must be larger than 0");
	}
	if (maxIndex - count < -1) {
		throw Error("maxIndex - count must be larger than -1");
	}

	const numbers = new Set<number>();
	while (numbers.size < count) {
		const randomNumber = Math.floor(Math.random() * (maxIndex + 1));
		numbers.add(randomNumber);
	}

	return Array.from(numbers);
}

function generateListOfMonthsUnix(monthFromCurrent: number, months: number) {
	const unixDT = [];
	const now = new Date();
	const currentUTCFullYear = now.getUTCFullYear();
	const currentUTCMonth = now.getUTCMonth();

	const totalMonthsToSubtract = months + monthFromCurrent;

	const startDate = new Date(Date.UTC(currentUTCFullYear, currentUTCMonth, 1));

	startDate.setUTCMonth(startDate.getUTCMonth() - totalMonthsToSubtract);

	for (let i = 0; i < months; i++) {
		unixDT.push(startDate.getTime());
		startDate.setUTCMonth(startDate.getUTCMonth() + 1);
	}

	return unixDT;
}

async function saveJsonToFile(filename: string, data: object) {
	try {
		const jsonString = JSON.stringify(data, null, 2);
		await writeFile(filename, jsonString, "utf8");
		console.log(`JSON data successfully saved to ${filename}`);
	} catch (error) {
		console.error(`Error saving JSON to ${filename}:`, error);
		throw error;
	}
}

generateJournal({
	assetsPerInstitution: 4,
	institutionsPerMonth: 5,
	monthFromCurrent: 1,
	months: 5,
});

function generateRandom(range: number[], step: number) {
	// Input validation
	if (
		!Array.isArray(range) ||
		range.length !== 2 ||
		typeof range[0] !== "number" ||
		typeof range[1] !== "number"
	) {
		throw Error(
			"Invalid 'range' argument. It must be an array of two numbers: [min, max].",
		);
	}
	if (typeof step !== "number" || step <= 0) {
		throw Error("Invalid 'step' argument. It must be a positive number.");
	}

	const min = range[0];
	const max = range[1];

	if (min > max) {
		throw Error("Invalid range: min cannot be greater than max.");
	}
	const effectiveMin = Math.ceil(min / step) * step;
	const effectiveMax = Math.floor(max / step) * step;

	if (effectiveMin > effectiveMax) {
		throw Error(
			`No number divisible by ${step} found in the range [${min}, ${max}].`,
		);
	}

	const numberOfSteps = (effectiveMax - effectiveMin) / step;
	const randomStepCount = Math.round(Math.random() * numberOfSteps);
	const randomNumber = effectiveMin + randomStepCount * step;

	return randomNumber;
}
