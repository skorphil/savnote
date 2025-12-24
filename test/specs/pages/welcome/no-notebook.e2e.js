import { describe, it } from "mocha";
import { $, driver, expect } from "@wdio/globals";
import contextSwitcher from "~test/helpers/contextSwitcher";
import welcomePage from "~test/pageobjects/welcomePage";
import openPage from "~test/pageobjects/openPage";
import androidFilePicker from "~test/pageobjects/androidFilePicker";

describe("Welcome page if no current notebook specified", () => {
	const remoteFilePath = "/sdcard/Download/notebook.json";
	let base64Content;

	before(async () => {
		try {
			const fileContent = `{
    "meta": {
        "appName": "savnote",
        "version": 2,
        "name": "Valid notebook",
        "id": "f096b3bd-5adb-4781-b761-76b68ff80b35",
        "description": "This is minimal valid notebook for testing purposes"
    },
    "records": {
        "institutions": {
            "1753713601293.Institution example": {
                "date": 1753713601293,
                "name": "Institution example",
                "country": "us"
            }
        },
        "assets": {
            "1753713601293.Institution example.Asset example": {
                "date": 1753713601293,
                "institution": "Institution example",
                "name": "Asset example",
                "amount": 1000,
                "currency": "eur",
                "isEarning": false,
                "description": ""
            }
        },
        "quotes": {
            "1753713601293.eur.usd": {
                "date": 1753713601293,
                "baseCurrency": "eur",
                "counterCurrency": "usd",
                "rate": 1.17464646
            },
            "1753713601293.eur.rub": {
                "date": 1753713601293,
                "baseCurrency": "eur",
                "counterCurrency": "rub",
                "rate": 93.21398579
            },
            "1753713601293.eur.amd": {
                "date": 1753713601293,
                "baseCurrency": "eur",
                "counterCurrency": "amd",
                "rate": 450.99732807
            },
            "1753713601293.eur.brl": {
                "date": 1753713601293,
                "baseCurrency": "eur",
                "counterCurrency": "brl",
                "rate": 6.53149414
            }
        }
    }
}`;
			base64Content = Buffer.from(fileContent, "utf8").toString("base64");
			console.log("Successfully read and converted to base64.");
		} catch (error) {
			console.error(`Error reading or converting file: ${error.message}`);
			throw new Error(
				`Failed to prepare base64 content for test: ${error.message}`,
			);
		}
	});

	// afterEach(async () => {
	// 	try {
	// 		await driver.executeScript("mobile: deleteFile", [
	// 			{
	// 				remotePath: remoteFilePath, // <--- CHANGED FROM 'path' TO 'remotePath'
	// 			},
	// 		]);
	// 		console.log(`Successfully deleted remote file: ${remoteFilePath}`);
	// 	} catch (error) {
	// 		console.warn(
	// 			`Failed to delete remote file ${remoteFilePath}: ${error.message}`,
	// 		);
	// 	}
	// });

	it("Should be in root url", async () => {
		await contextSwitcher.toWebview(driver);
		const url = await driver.getUrl();

		expect(url).toEqual("http://tauri.localhost/");
	});

	it("Should display CTA text to create new Notebook", async () => {
		await contextSwitcher.toWebview(driver);
		const headerText = await welcomePage.header.getText();

		expect(headerText).toMatch(/^(?=.*create)(?=.*notebook).*$/i);
	});

	it("Should display button to create new Notebook", async () => {
		await contextSwitcher.toWebview(driver);
		const btn = await welcomePage.createNotebookBtn;

		expect(btn).toBeClickable();
	});

	it("Should display button to open existing Notebook", async () => {
		await contextSwitcher.toWebview(driver);
		const btn = await welcomePage.openNotebookBtn;

		expect(btn).toBeClickable();
	});

	it("Should open system file picker if pressed openBtn", async () => {
		await contextSwitcher.toWebview(driver);
		const btn = await welcomePage.openNotebookBtn;
		await btn.click();
		// sometimes context does not change. How to properly wait here??
		const activity = await driver.getCurrentActivity();

		// await contextSwitcher.toNative(driver);
		// const searchBtn = await $(
		// 	"//android.widget.Button[@content-desc='Search']",
		// );
		// const viewBtn = await $(
		// 	"//android.widget.Button[@content-desc='Grid view']",
		// );

		expect(activity).toEqual("com.android.documentsui.picker.PickActivity");
		// expect(viewBtn).toBeDisplayed();
	});

	it("Should redirect to open notebook page after choosing notebook file", async () => {
		// await contextSwitcher.toWebview(driver);
		// await driver.pushFile(remoteFilePath, base64Content);
		// console.log("Activity on welcome page", await driver.getCurrentActivity());
		// await welcomePage.openNotebookBtn.click();
		// console.log("Activity on picker", await driver.getCurrentActivity());
		await contextSwitcher.toNative(driver);
		const widget = await androidFilePicker.getFileWidget(driver);
		await widget.click();
		await (await $("//*[contains(text(), 'Valid notebook')]")).waitForExist({
			timeout: 10000,
		});
		console.log("Activity after filePicker", await driver.getCurrentActivity()); // Activity after filePicker com.android.documentsui.picker.PickActivity

		// await openPage.openNotebookBtn.click();
		// await expect(browser).toHaveUrlContaining('open-notebook-page'); // Example assertion for redirection
		// Placeholder for your actual test logic after pushing the file
		// For now, let's just assert that the element exists (if it's a page object property)
		// await expect(openPage.openNotebookBtn).toBePresent(); // Example: Check if the button is present after redirection
	});
});
