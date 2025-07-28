import { describe, it } from "mocha";
import { $, driver, expect } from "@wdio/globals";
import contextSwitcher from "~test/helpers/contextSwitcher";
import welcomePage from "~test/pageobjects/welcomePage";

describe("Open page if current notebook specified", () => {
	it("Should display notebook name", async () => {
		// upload notebook
		await driver.pushFile(remoteFilePath, base64Content);

		await welcomePage.openNotebookBtn.click();

		// Select notebook

		const notebookNameSelector = await $("//*[contains(@text, 'create')]");

		expect(notebookNameSelector).toBeDisplayed();

		// remove notebook
	});
});
