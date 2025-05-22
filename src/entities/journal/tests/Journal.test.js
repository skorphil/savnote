import { vi, describe, it, expect } from "vitest";
import { Journal } from "../lib/Journal";
import { validJournal } from "./validJournal";

vi.mock("../lib/writeFileToAndroid", () => ({
  writeFileToAndroid: vi.fn(() => Promise.resolve()),
}));

import { writeFileToAndroid } from "../lib/writeFileToAndroid";

describe("Journal.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Must return journal instance if valid JournalData provideded", async () => {
    const journal = await Journal.create("test/uri", validJournal);
    expect(journal).toBeInstanceOf(Journal);
    expect(journal.meta).toEqual(validJournal.meta);
  });

  it("Must throw Error if invalid JournalData provideded", async () => {
    const journalData = {
      invalid: "journal schema",
    };
    try {
      const journal = await Journal.create("test/uri", journalData);
    } catch (e) {
      expect(e.message).toContain("Can't read a journal");
    }
  });

  it("Must cause Journal.create promise to reject if deviceSaver throws error", async () => {
    const errorFromDeviceSaver = "Simulated write error: No permissions";

    // Make writeFileToAndroid reject for this test
    vi.mocked(writeFileToAndroid).mockRejectedValue(
      new Error(errorFromDeviceSaver)
    );

    try {
      const journal = await Journal.create("test/uri", validJournal);
    } catch (e) {
      expect(e.message).toBe(errorFromDeviceSaver); // i get Error object in e.text. Anyway i can correctly throw Error
    }
  });
});
