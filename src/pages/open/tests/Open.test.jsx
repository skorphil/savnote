// import * as React from 'react';
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

/* ---------- CODE BLOCK: Mocking ---------- */
const journalMock = {
	journalDirectory: "mocked/journal/directory",
	journalName: "Mocked journal name",
	encryptionParameters: "AES-GCM",
	getJournalDirectory: function () {
		return this.journalDirectory;
	},
	getJournalName: function () {
		return this.journalName;
	},
	getEncryptionParameters: function () {
		return this.encryptionParameters;
	},
};

vi.mock("@/entities/user-config", () => {
	return {
		usePreferenceValue: vi.fn(),
	};
});

vi.mock("@/entities/journal", () => {
	return {
		Journal: {
			open: vi.fn(),
		},
	};
});

import { Journal } from "@/entities/journal";
import { usePreferenceValue } from "@/entities/user-config";
import { Open } from "../ui/Open";

/* ---------- CODE BLOCK: Test suits ---------- */
describe("Open", () => {
	const journalUri = "test/journal/uri";
	const journal = journalMock;
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(usePreferenceValue).mockImplementation((key) => {
			if (key === "currentJournalDirectory") {
				return journalUri;
			}
			return null;
		});
		vi.mocked(Journal.open).mockResolvedValue(journal);
	});
	/* ---------- CODE BLOCK: Test ---------- */
	it("Renders journal meta when journal instance is loaded", async () => {
		render(
			<MemoryRouter>
				<Open />
			</MemoryRouter>,
		);
		expect(usePreferenceValue).toHaveBeenCalledWith("currentJournalDirectory");

		const journalDirectory = await screen.findByText(journal.journalDirectory);
		expect(journalDirectory).toBeInTheDocument();

		const journalNameElements = await screen.findAllByText(journal.journalName);
		expect(journalNameElements.length).toBeGreaterThan(0);
		expect(journalNameElements[0]).toBeInTheDocument();
	});
	it("Renders Open button", async () => {
		render(
			<MemoryRouter>
				<Open />
			</MemoryRouter>,
		);
		expect(usePreferenceValue).toHaveBeenCalledWith("currentJournalDirectory");

		const openButton = await screen.findByRole("button", {
			name: /open-button/i,
		});
		expect(openButton).toBeInTheDocument();
	});
});
