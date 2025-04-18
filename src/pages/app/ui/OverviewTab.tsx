import { Navbar, Link } from "konsta/react";
import { SummaryCard } from "@/features/summary-card";
import { MdExitToApp } from "react-icons/md";

/**
 * New component
 *
 */
function OverviewTab() {
  return (
    <>
      <Navbar
        title="Overview"
        right={
          <Link
            // onClick={() => {
            //   handleJournalExit();
            //   void redirect("/");
            // }}
            navbar
          >
            <MdExitToApp size={24} />
          </Link>
        }
        colors={{ bgMaterial: "bg-transparent" }}
        className="top-0"
        transparent={false}
      />
      <SummaryCard />
    </>
  );
}

export default OverviewTab;
