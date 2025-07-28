import { describe, it } from "mocha";
import { $, driver, expect } from "@wdio/globals";
import contextSwitcher from "~test/helpers/contextSwitcher";
import openPage from "~test/pageobjects/openPage.ts";

describe("Welcome page if notebook specified", () => {
	it("Should redirect to open notebook page", async () => {
		await contextSwitcher.toWebview(driver);
		const remoteFilePath = "/sdcard/Download/notebook.json";
		await driver.pushFile(remoteFilePath, base64Content);
		openPage.openNotebookBtn;
	});
});
