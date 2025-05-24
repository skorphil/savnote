import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { validJournal } from "./validJournal";

describe("Journal.create()", () => {
	afterEach(() => {
		vi.resetModules();
	});

	it("Must return journal instance if valid JournalData provideded", async () => {
		vi.doMock("@tauri-apps/api/core", () => ({
			invoke: vi.fn(() => Promise.resolve("mocked value")),
		}));

		const { Journal } = await import("../lib/Journal");

		const journal = await Journal.create("test/uri", validJournal);
		expect(journal).toBeInstanceOf(Journal);
		expect(journal.meta).toEqual(validJournal.meta);

		vi.doUnmock("@tauri-apps/api/core");
	});

	it("Must throw Error if invalid JournalData provideded", async () => {
		vi.doMock("@tauri-apps/api/core", () => ({
			invoke: vi.fn(() => Promise.resolve("mocked value")),
		}));

		const { Journal } = await import("../lib/Journal");
		const journalData = {
			invalid: "journal schema",
		};
		try {
			const journal = await Journal.create("test/uri", journalData);
		} catch (e) {
			expect(e.message).toContain("Can't read a journal");
		}

		vi.doUnmock("@tauri-apps/api/core");
	});

	it("Must cause Journal.create to throw Error if invoke rejected", async () => {
		const { Journal } = await import("../lib/Journal");
		try {
			const journal = await Journal.create("test/uri", validJournal);
		} catch (e) {
			expect(e.message).toContain(
				"Can't write data on device. Please submit an issue to GitHub.",
			);
		}
	});
});

describe("Journal.open()", () => {
	afterEach(() => {
		vi.resetModules();
	});

	it("Must throw error if readJournal fails", async () => {
		const { Journal } = await import("../lib/Journal");

		try {
			const result = await Journal.open("test/uri");
			console.debug("result", result);
		} catch (e) {
			expect(e.message).toContain("Can't open");
		}
	});

	it("Must throw Error if readJournal provides wrong journal schema", async () => {
		vi.doMock("../lib/readFileFromAndroid", () => ({
			readFileFromAndroid: vi.fn(() =>
				Promise.resolve(JSON.stringify({ invalid: "journal schema" })),
			),
		}));

		const { Journal } = await import("../lib/Journal");

		try {
			const result = await Journal.open("test/uri");
			console.debug("result", result);
		} catch (e) {
			expect(e.message).toContain("SavNote format");
		}
		vi.doUnmock("../lib/readFileFromAndroid");
	});

	it("Must return journal instance if readJournal provides valid data", async () => {
		vi.doMock("../lib/readFileFromAndroid", () => ({
			readFileFromAndroid: vi.fn(() =>
				Promise.resolve(JSON.stringify(validJournal)),
			),
		}));

		const { Journal } = await import("../lib/Journal");

		const result = await Journal.open("test/uri");
		expect(result).toBeInstanceOf(Journal);
		vi.doUnmock("../lib/readFileFromAndroid");
	});
});
