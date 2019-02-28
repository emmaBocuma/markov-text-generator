import NGramStates from "../src/NGramStates.js";
import NGram from "../src/NGram.js";
import { expect } from "chai";

describe("NGramStates tests", () => {
	let nGramStates = {};
	let testString =
		"A certain king had a beautiful garden, and in the garden stood a tree which bore golden apples. A certain queen had a beautiful garden, and in the garden stood a tree which bore red cherries.";
	beforeEach("init NGramStates", () => {
		nGramStates = new NGramStates(testString, 2, {
			filterFunction: () => true
		});
	});
	it("should return correct map values for key", () => {
		const ngramStates = nGramStates.getNGramStates();
		expect(ngramStates.get("A certain")).to.deep.equal(["king", "queen"]);
		expect(ngramStates.get("a beautiful")).to.deep.equal([
			"garden,",
			"garden,"
		]);
		expect(ngramStates.get("bore red")).to.deep.equal(["cherries."]);
	});

	it("should return no map values", () => {
		const ngramStates = nGramStates.getNGramStates();
		expect(ngramStates.get("red cherries.")).to.deep.equal([]);
	});

	it("should return correct follow words array", () => {
		const nGram = new NGram(testString.split(" "), 1, 2);
		const words = nGramStates._getFollowingWords(nGram);
		expect(words).to.deep.equal(["had"]);
	});

	it("should return correct integer for _indexOf", () => {
		const nGram = new NGram(testString.split(" "), 21, 2);
		const index = nGramStates._indexOf(testString.split(" "), nGram, 5);
		expect(index).to.equal(21);
	});

	it("should filter out words correctly, order 1", () => {
		const removeWords = ["garden", "stood", "beautiful"];
		nGramStates = new NGramStates(testString, 1, {
			filterFunction: word => {
				if (removeWords.includes(word)) {
					return false;
				}
				return true;
			}
		});

		expect(nGramStates.getNGramStates().get("garden")).to.equal(undefined);
		expect(nGramStates.getNGramStates().get("stood")).to.equal(undefined);
		expect(nGramStates.getNGramStates().get("tree")).to.deep.equal([
			"which",
			"which"
		]);
	});

	it("should filter out words correctly, order 2", () => {
		const removeWords = ["garden", "stood", "beautiful"];
		nGramStates = new NGramStates(testString, 2, {
			filterFunction: word => {
				if (removeWords.includes(word)) {
					return false;
				}
				return true;
			}
		});

		expect(nGramStates.getNGramStates().get("garden")).to.equal(undefined);
		expect(nGramStates.getNGramStates().get("stood")).to.equal(undefined);
		expect(nGramStates.getNGramStates().get("a tree")).to.deep.equal([
			"which",
			"which"
		]);
	});

	it("should filter out words correctly, that include e", () => {
		nGramStates = new NGramStates(testString, 1, {
			filterFunction: word => {
				if (word.indexOf("e") > -1) {
					return false;
				}
				return true;
			}
		});

		expect(nGramStates.getNGramStates().get("garden")).to.equal(undefined);
		expect(nGramStates.getNGramStates().get("stood")).to.deep.equal(["a", "a"]);
	});
});
