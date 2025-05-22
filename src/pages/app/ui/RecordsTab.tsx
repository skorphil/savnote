import { useJournalRecordDates } from "@/entities/journal";
import { handleJournalExit } from "@/shared/handle-journal-exit";
import { unixToHumanReadable } from "@/shared/lib/date-time-format";
import { Link, List, ListItem, Navbar } from "konsta/react";
import { MdExitToApp } from "react-icons/md";
import { useNavigate } from "react-router";

/**
 * New component
 *
 */
function RecordsTab() {
  const navigate = useNavigate();
  const recordDates = useJournalRecordDates();

  return (
    <>
      <Navbar
        title="Records"
        right={
          <Link
            onClick={() => {
              handleJournalExit();
              void navigate("/");
            }}
            navbar
          >
            <MdExitToApp size={24} />
          </Link>
        }
        colors={{ bgMaterial: "bg-transparent" }}
        className="top-0"
        transparent={false}
      />
      <List inset className="space-y-4 mb-28 mt-0">
        {recordDates?.map((date, id) => (
          <ListItem key={id}>
            <span>{unixToHumanReadable(Number(date))}</span>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export { RecordsTab };
