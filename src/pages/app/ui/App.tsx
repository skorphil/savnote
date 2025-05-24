import { Fab, Icon, Page, Tabbar, TabbarLink } from "konsta/react";
import { useState } from "react";
import {
	// MdAdd,
	MdAssessment,
	// MdEditNote,
	MdNoteAdd,
	// MdNoteAdd,
	MdSettings,
	MdViewList,
} from "react-icons/md";
import { useNavigate } from "react-router";
import OverviewTab from "./OverviewTab";
import { RecordsTab } from "./RecordsTab";

/**
 * New component
 */
function App() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<string>("tab-1");

	return (
		<Page className="no-scrollbar pb-24-safe">
			<Fab
				className="fixed right-4-safe bottom-24-safe z-20"
				// icon={<MdEditNote />}
				// text="Resume savings entry"
				icon={<MdNoteAdd />}
				text="Add savings entry"
				textPosition="after"
				onClick={() => {
					void navigate("/newrecord", { viewTransition: true });
				}}
			/>
			{activeTab === "tab-1" && <OverviewTab />}
			{activeTab === "tab-2" && <RecordsTab />}
			<Tabbar labels={true} icons={true} className="left-0 bottom-0 fixed">
				<TabbarLink
					active={activeTab === "tab-1"}
					onClick={() => {
						setActiveTab("tab-1");
					}}
					icon={<Icon material={<MdAssessment className="w-6 h-6" />} />}
					label={"Overview"}
				/>
				<TabbarLink
					active={activeTab === "tab-2"}
					onClick={() => {
						setActiveTab("tab-2");
					}}
					icon={<Icon material={<MdViewList className="w-6 h-6" />} />}
					label={"Records"}
				/>
				<TabbarLink
					active={activeTab === "tab-3"}
					onClick={() => {
						setActiveTab("tab-3");
					}}
					icon={<Icon material={<MdSettings className="w-6 h-6" />} />}
					label={"Preferences"}
				/>
			</Tabbar>
		</Page>
	);
}

export default App;
