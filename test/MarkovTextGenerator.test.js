import MarkovTextGenerator from "../src/MarkovTextGenerator.js";
import { expect } from "chai";

describe("MarkovTextGenerator tests", () => {
	let markov;
	let testString =
		"A certain king had a beautiful garden, and in the garden stood a tree which bore golden apples. A certain queen had a beautiful garden, and in the garden stood a tree which bore red cherries.";

	describe("generate text, with order 1, and endAsSentence: false", () => {
		beforeEach("Intialising Markov", () => {
			markov = new MarkovTextGenerator(1, {
				startAsSentence: true,
				endAsSentence: false
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

	describe("generate text, with order 2, and endAsSentence: true", () => {
		beforeEach("Intialising Markov", () => {
			markov = new MarkovTextGenerator(2, {
				startAsSentence: true,
				endAsSentence: true
			});
		});

		it("should generate exact output with seed 'hello'", () => {
			markov.setTrainingText(testString);
			markov.setSeed("hello");
			expect(markov.generateText(6)).to.equal(
				"A certain king had a beautiful garden, and in the garden stood a tree which bore red cherries."
			);
		});
	});

	describe("Param validation", () => {
		it("should throw error if order param is not a number or not over 0", () => {
			const fn = function() {
				new MarkovTextGenerator("test");
			};
			expect(fn).to.throw(
				TypeError,
				"MarkovTextGenerator constructor: order parameter must be a positive number"
			);
		});
	});

	describe("Param validation", () => {
		it("should throw error if filter function is not a function", () => {
			const fn = function() {
				new MarkovTextGenerator(2, { filterFunction: "hello" });
			};
			expect(fn).to.throw(
				TypeError,
				"MarkovTextGenerator constructor: filterFunction must be a Function"
			);
		});
	});

	describe("Param validation", () => {
		it("should not throw error if filter function returns a boolean", () => {
			const fn = function() {
				new MarkovTextGenerator(2, {
					filterFunction: () => true
				});
			};
			expect(fn).to.not.throw();
		});
	});

	describe("Param validation", () => {
		it("should throw error if filter function does not return boolean", () => {
			const fn = function() {
				new MarkovTextGenerator(2, {
					filterFunction: () => {
						"does nothing";
					}
				});
			};
			expect(fn).to.throw(
				TypeError,
				"MarkovTextGenerator constructor: filterFunction must return a boolean"
			);
		});
	});
});
