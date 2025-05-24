import { Journal } from "@/entities/journal";
import { usePreferenceValue } from "@/entities/user-config";
import { throwError } from "@/shared/error-handling";
import { handleJournalExit } from "@/shared/handle-journal-exit";
import { Button, Link, List, ListItem, Navbar, Page } from "konsta/react";
import { useEffect, useState } from "react";
import { MdExitToApp } from "react-icons/md";
import { useNavigate } from "react-router";
import styles from "./Open.module.css";

/**
 * Page for opening provided Journal
 */
export function Open() {
	const journalUri = usePreferenceValue("currentJournalDirectory");
	const [journal, setJournal] = useState<undefined | Journal>(undefined);
	const navigate = useNavigate();

	useEffect(() => {
		async function openJournal() {
			if (!journalUri) {
				void navigate("/");
				return;
			}
			const journal = await Journal.open(journalUri, () => {
				void navigate("/");
			});
			setJournal(journal);
		}
		openJournal().catch((e: unknown) => throwError(e));
	}, [journalUri, navigate]);

	return (
		<Page className={styles.page}>
			<Navbar
				title={journal ? journal.getJournalName() : "Loading..."}
				right={
					<Link
						onClick={() => {
							handleJournalExit();
							void navigate("/", { replace: true });
						}}
						navbar
					>
						<MdExitToApp size={24} />
					</Link>
				}
				medium
				colors={{ bgMaterial: "bg-transparent" }}
				className="top-0 hairline-b"
				transparent={false}
			/>
			{journal && (
				<div>
					<List className="my-1">
						<ListItem
							className="break-words"
							title="Directory"
							text={journal.getJournalDirectory()}
						/>

						<ListItem
							title="Encryption"
							text={journal.getEncryptionParameters() ?? "Password not set"}
						/>
						<div className="mt-4" />
					</List>
					<div className="px-4 pb-6">
						<Button
							onClick={() => void navigate("/app")}
							className="w-full"
							aria-label="open-button"
							large
							rounded
						>
							Open
						</Button>
					</div>
				</div>
			)}
		</Page>
	);
}

// TODO Password input
/* {
            <ListInput
            className="hairline-b relative"
              required
              outline
              label="Password"
              type="password"
              autoFocus={true} // works only on manual navigation to page. not working if page is opened after rerendering
            />
          }

 {journalEncryption || (
            <NavLink to="/app">
              <Button className="w-[calc(100%-32px)] m-4" large outline rounded>
                Protect with a password
              </Button>
            </NavLink>
          )} */
