import { describe, it } from "mocha";
import { $, driver, expect } from "@wdio/globals";
import contextSwitcher from "~test/helpers/contextSwitcher";
import welcomePage from "~test/pageobjects/welcomePage";

describe("Welcome page if no current notebook specified", () => {
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

		await contextSwitcher.toNative(driver);
		const searchBtn = await $(
			"//android.widget.Button[@content-desc='Search']",
		);
		const viewBtn = await $(
			"//android.widget.Button[@content-desc='Grid view']",
		);

		expect(searchBtn).toBeDisplayed();
		expect(viewBtn).toBeDisplayed();
	});
});
