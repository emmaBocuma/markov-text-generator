import MarkovTextGenerator from "../src/MarkovTextGenerator.js";
import WordGram from "../src/WordGram.js";
import assert from "assert";
import { expect } from "chai";

describe("MarkovTextGenerator tests", () => {
  let markov;

  beforeEach("Intialising Markov", () => {
    markov = new MarkovTextGenerator({});
  });

  describe("start/end word methods", () => {
    it("should return false when word doesn't start with uppercase letter", () => {
      assert.equal(markov.wordBeginsSentence("hello"), false);
    });
    it("should return true when word starts with uppercase letter", () => {
      assert.equal(markov.wordBeginsSentence("Hello"), true);
    });
    it("should return true when word ends with fullstop", () => {
      assert.equal(markov.wordEndsSentence("end."), true);
    });
    it("should return false if word is acronym", () => {
      assert.equal(markov.wordEndsSentence("U.S."), false);
    });
  });

  describe("indexOf method", () => {
    it("should return -1 if words not matched", () => {
      let wordGram = new WordGram(["Test", "this"], 0, 2);
      assert.equal(markov.indexOf(["Hello", "world", "test"], wordGram, 0), -1);
    });
    it("should return 2 if words matched", () => {
      let wordGram = new WordGram(["Test", "this"], 0, 2);
      assert.equal(
        markov.indexOf(["Hello", "world", "Test", "this"], wordGram, 0),
        2
      );
    });
    it("should return -1 if matching words included, but before start index", () => {
      let wordGram = new WordGram(["Test", "this"], 0, 2);
      assert.equal(
        markov.indexOf(["Test", "this", "Hello", "world"], wordGram, 2),
        -1
      );
    });
  });

  describe("getFirstWordIndex method", () => {
    it("should return 4 if finds first word index before end of string (minus order number)", () => {
      let str = "the fox jumps over Start sentence continues";

      markov.setTrainingText(str);
      assert.equal(markov.getFirstWordIndex(), 4);
    });
    it("should throw error if cannot find word starting with uppercase letter within reasonable num of tries", () => {
      let str = "the fox jumps over start sentence continues";
      markov.setTrainingText(str);
      expect(markov.getFirstWordIndex).to.throw();
    });
  });
  describe("getRandomInt method", () => {
    it("returns 16 with seed 'hello'", () => {
      assert.equal(markov.getRandomInt(30, "hello"), 16);
    });
  });
});
