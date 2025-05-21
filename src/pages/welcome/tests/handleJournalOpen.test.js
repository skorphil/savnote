import { vi, describe, it, expect } from "vitest";

/* ---------- CODE BLOCK: Mocking ---------- */
vi.mock("@/entities/journal", () => {
  return {
    readJournal: vi.fn(),
    showOpenFileDialog: vi.fn(),
  };
});

import { readJournal, showOpenFileDialog } from "@/entities/journal";
import { handleJournalOpen } from "../ui/handleJournalOpen";
import { beforeEach } from "node:test";
import { Preferences } from "@/entities/user-config";

/* ---------- CODE BLOCK: Test suits ---------- */
describe("handleJournalOpen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Throws error if readJournal throws error", async () => {
    const errorText = "Mock error text";

    vi.mocked(showOpenFileDialog).mockResolvedValue("mock/location");
    vi.mocked(readJournal).mockImplementation(() => {
      throw new Error(errorText);
    });

    try {
      await handleJournalOpen();
    } catch (e) {
      expect(e.message).toBe(errorText);
    }
  });

  it("Returns null if not path were provided by dialog", async () => {
    vi.mocked(showOpenFileDialog).mockResolvedValue(null);

    const result = await handleJournalOpen();

    expect(result).toBe(null);
  });

  it("Adds journal url to preferences if provided valid data", async () => {
    const uri = "mock/location";
    vi.mocked(showOpenFileDialog).mockResolvedValue(uri);
    vi.mocked(readJournal).mockResolvedValue(true);
    const updatePreferencesMock = vi.fn();
    vi.spyOn(Preferences.prototype, "updatePreferences").mockImplementation(
      updatePreferencesMock
    );

    await handleJournalOpen();

    expect(updatePreferencesMock).toHaveBeenCalledWith({
      currentJournalDirectory: uri,
    });
  });
});
