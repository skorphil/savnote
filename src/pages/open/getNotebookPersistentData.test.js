import { getNotebookPersistentData } from "./getNotebookPersistentData";

describe("getNotebookPersistentData", () => {
	it("should return object if correct JSON provided", async () => {
		const mockObject = { notebook: "correct" };
		const mockJson = JSON.stringify(mockObject);

		const readNotebook = () => Promise.resolve(mockJson);
		const isNotebook = () => true;

		const result = await getNotebookPersistentData(readNotebook, isNotebook);

		expect(result).toEqual(mockObject);
	});

	it("Should throw error if JSON is not in SavNote format", async () => {
		const mockObject = { notebook: "correct" };
		const mockJson = JSON.stringify(mockObject);

		const readNotebook = () => Promise.resolve(mockJson);
		const isNotebook = () => false;

		try {
			const result = await getNotebookPersistentData(readNotebook, isNotebook);
		} catch (e) {
			expect(e.message).toContain("Can't validate");
		}
	});

	it("Should throw error if string is invalid JSON", async () => {
		const mockJson = "wrong json";

		const readNotebook = () => Promise.resolve(mockJson);
		const isNotebook = () => true;

		try {
			const result = await getNotebookPersistentData(readNotebook, isNotebook);
		} catch (e) {
			expect(e.message).toContain("Can't validate");
		}
	});
});
