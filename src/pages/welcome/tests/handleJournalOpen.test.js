import { vi, describe, it, expect } from "vitest";

/* ---------- CODE BLOCK: Mocking ---------- */
vi.mock("@/entities/journal", () => {
  const mockJournal = vi.fn();
  mockJournal.deviceReader = vi.fn();

  return {
    Journal: mockJournal,
    showOpenFileDialog: vi.fn(),
  };
});

import { showOpenFileDialog, Journal } from "@/entities/journal";
import { handleJournalOpen } from "../ui/handleJournalOpen";
import { Preferences } from "@/entities/user-config";

/* ---------- CODE BLOCK: Test suits ---------- */
describe("handleJournalOpen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Throws error if readJournal throws error", async () => {
    const errorText = "Mock error text";

    vi.mocked(showOpenFileDialog).mockResolvedValue("mock/location");
    vi.mocked(Journal.deviceReader).mockRejectedValue(new Error(errorText));

    try {
      await handleJournalOpen();
    } catch (e) {
      expect(e.message).toBe(errorText);
    }
  });

  it("Returns null if not path were provided by dialog", async () => {
    vi.mocked(showOpenFileDialog).mockResolvedValue(null);
    vi.mocked(Journal.deviceReader).mockResolvedValue("mocked success");

    const result = await handleJournalOpen();

    expect(result).toBe(null);
  });

  it("Adds journal url to preferences if provided valid data", async () => {
    const uri = "mock/location";
    vi.mocked(showOpenFileDialog).mockResolvedValue(uri);
    vi.mocked(Journal.deviceReader).mockResolvedValue("mocked success");
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
