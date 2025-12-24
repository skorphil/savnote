import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";

/* ---------- CODE BLOCK: Mocking ---------- */
vi.mock("../ui/handleJournalOpen", () => {
  return {
    handleJournalOpen: vi.fn(),
  };
});

import { handleJournalOpen } from "../ui/handleJournalOpen";
import Welcome from "../ui/Welcome";

/* ---------- CODE BLOCK: Test suits ---------- */
describe("Welcome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ---------- CODE BLOCK: Tests ---------- */
  it("Renders links to create, open journal", async () => {
    render(
      <MemoryRouter>
        <Welcome />
      </MemoryRouter>
    );

    const openJournalButton = await screen.findByText(/open/i);
    expect(openJournalButton).toBeInTheDocument();
    const createJournalButton = await screen.findByText(/create new/i);
    expect(createJournalButton).toBeInTheDocument();
  });

  it("Renders error text if failed to open journal", async () => {
    const errorText = "Mock error: can't open journal";
    vi.mocked(handleJournalOpen).mockImplementation(() => {
      throw new Error(errorText);
    });

    render(
      <MemoryRouter>
        <Welcome />
      </MemoryRouter>
    );

    const openJournalButton = await screen.findByText(/open/i);
    fireEvent.click(openJournalButton);
    const error = await screen.findByText(errorText);

    expect(error).toBeInTheDocument();
  });
});
