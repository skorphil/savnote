import { handleJournalExit } from "@/shared/handle-journal-exit";
import { Button, Link, List, ListItem, Navbar, Page } from "konsta/react";
import { MdExitToApp } from "react-icons/md";
import { useNavigate } from "react-router";
import styles from "./Open.module.css";
import { useNotebookPersistendData } from "../useNotebookPersistentData";
import { useEffect } from "react";

/**
 * Page for displaying Journal meta and decryption form
 */
export function Open() {
	const [journal, journalUri] = useNotebookPersistendData(); // why journalUri === journaL???
	const navigate = useNavigate();

	useEffect(() => {
		if (journal === null && journalUri === null) {
			navigate("/");
		}
	}, [navigate, journal, journalUri]);

	return (
		<Page className={styles.page}>
			<Navbar
				title={journal ? journal.meta.name : "Loading..."}
				right={
					<Link
						onClick={() => {
							console.debug("exit clicked");
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
							text={journalUri}
						/>

						<ListItem
							title="Encryption"
							text={
								journal.encryption?.derivationAlgorithmName ??
								"Password not set"
							}
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

// Password input
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
