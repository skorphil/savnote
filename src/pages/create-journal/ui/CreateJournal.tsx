import { Journal, showSaveFileDialog } from "@/entities/journal";
import { Preferences } from "@/entities/user-config";
import { throwError } from "@/shared/error-handling";
import { Button, Link, List, ListInput, Navbar, Page } from "konsta/react";
import { type ChangeEvent, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { type NavigateFunction, useNavigate } from "react-router";

/**
 * New component
 *
 */
export function CreateJournal() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	return (
		<Page>
			<Navbar
				title="New journal"
				left={
					<Link navbar onClick={() => void navigate("/")}>
						<MdArrowBack size={24} />
					</Link>
				}
				colors={{ bgMaterial: "bg-transparent" }}
				className="top-0"
				transparent={false}
			/>
			<List>
				<ListInput
					value={name}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setName(e.target.value);
					}}
					outline
					label="Name"
				/>
				<ListInput
					value={description}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setDescription(e.target.value);
					}}
					inputClassName="!h-20 resize-none"
					type="textarea"
					outline
					label="Description (optional)"
				/>
				{/* TODO add password input */}
				<Button
					className="w-full"
					large
					rounded
					onClick={() => {
						handleJournalCreate({
							name,
							description,
							navigate,
						}).catch((e) => throwError(e));
					}}
				>
					Create
				</Button>
			</List>
		</Page>
	);
}

type HandleJournalCreateProps = {
	name: string;
	description?: string;
	navigate: NavigateFunction;
};

async function handleJournalCreate(props: HandleJournalCreateProps) {
	const { name, description, navigate } = props;

	const directory = await showSaveFileDialog(name, "application/json");
	if (!directory) return;

	const JournalData = {
		meta: {
			id: crypto.randomUUID(),
			appName: "savnote",
			version: 2,
			name,
			description,
		} as const,
	};

	await Journal.create(directory, JournalData);

	Preferences.getInstance().updatePreferences({
		currentJournalDirectory: directory,
	});

	void navigate("/app");
}
