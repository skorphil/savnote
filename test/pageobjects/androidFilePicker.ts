import { $ } from "@wdio/globals";

/**
 * Requires Native context
 */
class androidFilePicker {
  get menuBtn():ChainablePromiseElement {
    return $("//android.widget.ImageButton[@content-desc='Show roots']");
  }
  get downloadsSection():ChainablePromiseElement {
    return $("//android.widget.TextView[@resource-id='android:id/title' and @text='Downloads']");
  }

  async getFileWidget(driver) {
    await this.menuBtn.click()
    driver.pause(10000)
    await this.downloadsSection.click()
    driver.pause(15000)
    return $(`//androidx.cardview.widget.CardView[@resource-id="com.google.android.documentsui:id/item_root"]
`)
    // return $(`//android.widget.TextView[@resource-id='android:id/title' and @text='${fileName}']`)
  }
  


}

export default new androidFilePicker();

