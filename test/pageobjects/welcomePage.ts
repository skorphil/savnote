import { $ } from "@wdio/globals";

class WelcomePage {
	get openNotebookBtn():ChainablePromiseElement {
		return $("aria/open-notebook");
	}
	get createNotebookBtn():ChainablePromiseElement {
		return $("aria/create-notebook");
	}
	get header():ChainablePromiseElement {
		return $("h2");
	}
}

export default new WelcomePage();
