import { Navbar, Link, Block } from "konsta/react";
import { SummaryCard } from "./summary-card/SummaryCard";
import { MdExitToApp, MdInfoOutline } from "react-icons/md";
import { Preferences } from "@/entities/user-config";
import { Journal } from "@/entities/journal";

const preferences = new Preferences();

/**
 * Overview tab contain collection of widgets for
 * getting summary overview of journal data
 */
function OverviewTab() {
  const counterCurrency = preferences.usePreferenceValue("selectedCurrency");
  const journal = Journal.instance;
  const recordDates = journal?.useJournalSliceIds("InstitutionsByDate");

  let content = <SummaryCard />;
  if (!recordDates || recordDates.length === 0) {
    content = (
      // <div className="flex flex-col justify-start items-center h-full">
      <Block className="opacity-60 gap-2 flex items-center mt-20">
        <span>
          <MdInfoOutline size={24} />
        </span>
        <span>
          There is no savings enries yet. Add entries to get overview of your
          savings.
        </span>
      </Block>
      // </div>
    );
  }
  return (
    <>
      <Navbar
        title="Overview"
        right={
          <>
            <span>{counterCurrency || "usd"}</span>
            <Link
              // onClick={() => {
              //   handleJournalExit();
              //   void redirect("/");
              // }}
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
