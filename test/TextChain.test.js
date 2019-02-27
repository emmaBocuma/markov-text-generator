import TextChain from "../src/TextChain.js";
import { expect } from "chai";
import seedrandom from "seedrandom";

describe("TextChain tests", () => {
	let textChain;
	let map;

	beforeEach("", () => {
		map = new Map();
		map.set("A certain", ["king", "queen"]);
		map.set("certain king", ["had"]);
		map.set("certain queen", ["had"]);
		map.set("king had", ["a"]);
		map.set("queen had", ["a"]);
		map.set("had a", ["beautiful", "lovely"]);
		map.set("a beautiful", ["ball", "flower"]);
		map.set("a lovely", ["time", "party"]);
		map.set("lovely time", ["again."]);
		map.set("beautiful time", ["again."]);
		map.set("lovely ball", ["again."]);
		map.set("beautiful ball", ["again."]);
		map.set("lovely party", ["again."]);
		map.set("beautiful party", ["again."]);
		map.set("lovely flower", ["again."]);
		map.set("beautiful flower", ["again."]);

		textChain = new TextChain(map, true, false, 2);
	});

	describe("_getInitialNGram() tests", () => {
		it("should return word(s) with capital letter", () => {
			expect(textChain._getInitialNGram()).to.equal("A certain");
		});
	});
	describe("_nGramBeginsSentence() tests", () => {
		it("should return true if starts with Uppercase", () => {
			expect(textChain._nGramBeginsSentence("A certain")).to.equal(true);
		});
		it("should return false if does not start with Uppercase", () => {
			expect(textChain._nGramBeginsSentence("a certain")).to.equal(false);
		});

		it("should return false if starts with Uppercase but ends sentence in same phrase", () => {
			expect(textChain._nGramBeginsSentence("That's all.")).to.equal(false);
		});
	});

	describe("_wordEndsSentence() tests", () => {
		it("should return true if ends sentence", () => {
			expect(textChain._wordEndsSentence("yes.")).to.equal(true);
		});
		it("should return false if does not end sentence", () => {
			expect(textChain._wordEndsSentence("no")).to.equal(false);
		});
		it("should return false if is acronym", () => {
			expect(textChain._wordEndsSentence("U.S.A.")).to.equal(false);
		});
	});
	describe("generate() tests", () => {
		beforeEach("", () => {
			Math.seedrandom("hello");
		});
		it("should generate matching text", () => {
			expect(textChain.generate(7)).to.equal(
				"A certain king had a beautiful flower"
			);
		});
		it("should generate matching text with full stop", () => {
			textChain = new TextChain(map, true, true, 2);
			expect(textChain.generate(5)).to.equal(
				"A certain king had a beautiful flower again."
			);
		});
	});
});
