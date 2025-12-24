import { $ } from "@wdio/globals";

class OpenPage {
	get exitNotebookBtn():ChainablePromiseElement {
		return $("[data-testid='exit-notebook-btn']");
	}
	get openNotebookBtn():ChainablePromiseElement {
		return $("[data-testid='open-notebook-btn']");
	}
  
}

export default new OpenPage();
