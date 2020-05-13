import NGramStates, {
	indexOfNgram,
	getFollowingWords
} from "../src/NGramStates.js";
import NGram from "../src/NGram.js";
import { expect } from "chai";

describe("NGramStates unit tests", () => {
	it("should return correct integer for indexOfNgram()", () => {
		const source = ["Once", "upon", "a", "time", "there", "lived"];
		let index = indexOfNgram(source, new NGram(["upon", "a"]));
		expect(index).to.equal(1);
		index = indexOfNgram(source, new NGram(["lived", "a"]));
		expect(index).to.equal(-1);
		index = indexOfNgram(source, new NGram(["upon", "a"]), 2);
		expect(index).to.equal(-1);
	});

	it("should return correct words for getFollowingWords()", () => {
		const source = ["Once", "upon", "a", "time", "there", "lived"];
		let words = getFollowingWords(source, new NGram(["upon", "a"]));
		expect(words).to.deep.equal(["time"]);
		words = getFollowingWords(source, new NGram(["lived"]));
		expect(words).to.deep.equal([]);
		const dupeSource = [
			"Once",
			"upon",
			"a",
			"time",
			"there",
			"lived",
			"Once",
			"upon",
			"a",
			"time",
			"there",
			"was"
		];
		words = getFollowingWords(dupeSource, new NGram(["time", "there"]));
		expect(words).to.deep.equal(["lived", "was"]);

		let testString =
			"A certain king had a beautiful garden, and in the garden stood a tree which bore golden apples. A certain queen had a beautiful garden, and in the garden stood a tree which bore red cherries.";

		words = getFollowingWords(
			testString.split(" "),
			new NGram(["a", "beautiful"])
		);
		expect(words).to.deep.equal(["garden,", "garden,"]);

		words = getFollowingWords(testString.split(" "), new NGram(["which"]));
		expect(words).to.deep.equal(["bore", "bore"]);

		words = getFollowingWords(testString.split(" "), new NGram(["cherries."]));
		expect(words).to.deep.equal([]);
	});
});

describe("NGramStates building ngram dictionary tests", () => {
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
