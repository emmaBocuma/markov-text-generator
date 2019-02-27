import MarkovTextGenerator from "../src/MarkovTextGenerator.js";
import { expect } from "chai";

describe("MarkovTextGenerator tests", () => {
	let markov;
	let testString =
		"A certain king had a beautiful garden, and in the garden stood a tree which bore golden apples. A certain queen had a beautiful garden, and in the garden stood a tree which bore red cherries.";

	describe("generate text,  with order 1, and endWithPunctuation: false", () => {
		beforeEach("Intialising Markov", () => {
			markov = new MarkovTextGenerator(1, {
				startWithSentenceCase: true,
				endWithPunctuation: false
			});
		});

		it("should generate exact output with seed 'hello'", () => {
			markov.setTrainingText(testString);
			markov.setSeed("hello");
			expect(markov.generateText(6)).to.equal(
				"A certain queen had a beautiful"
			);
		});
	});

	describe("generate text,  with order 2, and endWithPunctuation: true", () => {
		beforeEach("Intialising Markov", () => {
			markov = new MarkovTextGenerator(2, {
				startWithSentenceCase: true,
				endWithPunctuation: true
			});
		});

		it("should generate exact output with seed 'hello'", () => {
			markov.setTrainingText(testString);
			markov.setSeed("hello");
			expect(markov.generateText(6)).to.equal(
				"A certain king had a beautiful."
			);
		});
	});
});
