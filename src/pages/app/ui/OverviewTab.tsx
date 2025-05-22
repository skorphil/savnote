import { Navbar, Link } from "konsta/react";
import { SummaryCard } from "./summary-card/SummaryCard";
import { MdArrowDropDown, MdExitToApp } from "react-icons/md";
import { Preferences } from "@/entities/user-config";
import { Journal } from "@/entities/journal";
import { handleJournalExit } from "@/shared/handle-journal-exit";
import { useNavigate } from "react-router";

const preferences = new Preferences();

/**
 * Overview tab contain collection of widgets for
 * getting summary overview of journal data
 */
function OverviewTab() {
  const navigate = useNavigate();
  const counterCurrency = preferences.usePreferenceValue("selectedCurrency");
  const journal = Journal.resume(() => void navigate("/") as never);
  const recordDates = journal.useJournalSliceIds("InstitutionsByDate");

  let content = <SummaryCard />;
  if (!recordDates || recordDates.length === 0) {
    content = (
      <div className="flex flex-col justify-start items-center h-full">
        <img
          className="w-[50%] mt-28 mb-4 mx-auto opacity-100"
          src="emptySafe.png"
          alt="Illustration with a person standing next to an empty safe"
        />
        <span className="text-lg mx-4 mb-1 text-center">
          No savings recorded yet
        </span>
        <span className="text-sm opacity-70">
          Add entries to get an overview of your wealth.
        </span>
      </div>
    );
  }
  return (
    <>
      <Navbar
        title="Overview"
        right={
          <>
            <div className="flex flex-row items-center">
              <span>{counterCurrency || "USD"}</span>
              <MdArrowDropDown />
            </div>
            <Link
              onClick={() => {
                handleJournalExit();
                void navigate("/");
              }}
              navbar
            >
              <MdExitToApp size={24} />
            </Link>
          </>
        }
        colors={{ bgMaterial: "bg-transparent" }}
        className="top-0"
        transparent={false}
      />

      {content}
    </>
  );
}

export default OverviewTab;
