import { Journal } from "@/entities/journal";
import { Preferences } from "@/entities/preferences";
import {
  Navbar,
  Page,
  Link,
  Tabbar,
  Icon,
  TabbarLink,
  List,
  ListItem,
  Fab,
} from "konsta/react";
import { useState } from "react";
import {
  MdAdd,
  MdAssessment,
  MdExitToApp,
  MdSettings,
  MdViewList,
} from "react-icons/md";
import { useNavigate } from "react-router";
import OverviewTab from "./OverviewTab";

/**
 * New component
 *
 */
function App() {
  const recordDates =
    Journal.instance?.useJournalSliceIds("InstitutionsByDate");
  const [activeTab, setActiveTab] = useState<string>("tab-1");
  const redirect = useNavigate();
  // const values = journalStore.getJson();
  return (
    <Page className="no-scrollbar pb-24-safe">
      <Fab
        className="fixed right-4-safe bottom-24-safe z-20"
        icon={<MdAdd />}
        text="Add record"
        textPosition="after"
        onClick={() => console.debug("fab pressed")}
      />
      {activeTab === "tab-1" && <OverviewTab />}
      {activeTab === "tab-2" && (
        <>
          <Navbar
            title="Records"
            right={
              <Link
                onClick={() => {
                  handleJournalExit();
                  void redirect("/");
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
                <span>{unixTimeToHumanReadable(Number(date))}</span>
              </ListItem>
            ))}
          </List>
        </>
      )}
      <Tabbar labels={true} icons={true} className="left-0 bottom-0 fixed">
        <TabbarLink
          active={activeTab === "tab-1"}
          onClick={() => setActiveTab("tab-1")}
          icon={<Icon material={<MdAssessment className="w-6 h-6" />} />}
          label={"Overview"}
        />
        <TabbarLink
          active={activeTab === "tab-2"}
          onClick={() => setActiveTab("tab-2")}
          icon={<Icon material={<MdViewList className="w-6 h-6" />} />}
          label={"Records"}
        />
        <TabbarLink
          active={activeTab === "tab-3"}
          onClick={() => setActiveTab("tab-3")}
          icon={<Icon material={<MdSettings className="w-6 h-6" />} />}
          label={"Preferences"}
        />
      </Tabbar>
    </Page>
  );
}

export default App;

function handleJournalExit() {
  Journal.delete();
  new Preferences().deleteValue("currentJournalDirectory");
}

function unixTimeToHumanReadable(unixTime: number) {
  const date = new Date(unixTime);
  const format = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  return format;
}
