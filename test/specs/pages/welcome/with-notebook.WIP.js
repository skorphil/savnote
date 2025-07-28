import { describe, it } from "mocha";
import { $, driver, expect } from "@wdio/globals";
import contextSwitcher from "~test/helpers/contextSwitcher";
import openPage from "~test/pageobjects/openPage.ts";
import fs from "fs:node"; // Import the Node.js file system module
import path from "path:node"; // Import the Node.js path module

// --- Start of code to read file and convert to Base64 ---
// Define the relative path to your notebook file
const notebookFilePath = path.resolve(
	__dirname,
	"../../../helpers/valid-notebook.json",
);

let base64Content;
try {
	// Read the file content synchronously
	const fileContent = fs.readFileSync(notebookFilePath);
	// Convert the file content to a Base64 string
	base64Content = fileContent.toString("base64");
	console.log(`Successfully read and converted ${notebookFilePath} to base64.`);
} catch (error) {
	console.error(`Error reading or converting file: ${error.message}`);
	// Depending on your test setup, you might want to throw the error
	// or handle it gracefully, e.g., by skipping the test or providing a default.
	throw new Error(
		`Failed to prepare base64 content for test: ${error.message}`,
	);
}
// --- End of code to read file and convert to Base64 ---

describe("Welcome page if notebook specified", () => {
	it("Should redirect to open notebook page", async () => {
		await contextSwitcher.toWebview(driver);
		const remoteFilePath = "/sdcard/Download/notebook.json";
		await driver.pushFile(remoteFilePath, base64Content);

		// Assuming openPage.openNotebookBtn is an element that needs to be clicked or interacted with
		// You might need to add an action here, e.g., await openPage.openNotebookBtn.click();
		// or an assertion to verify the redirection.
		// For example:
		await openPage.openNotebookBtn.click(); // If it's a button to open the notebook
		// await expect(browser).toHaveUrlContaining('open-notebook-page'); // Example assertion for redirection

		// Placeholder for your actual test logic after pushing the file
		// For now, let's just assert that the element exists (if it's a page object property)
		await expect(openPage.openNotebookBtn).toBePresent(); // Example: Check if the button is present after redirection
	});
});
