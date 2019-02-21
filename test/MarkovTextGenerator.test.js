import MarkovTextGenerator from "../src/MarkovTextGenerator.js";
import NGram from "../src/NGram.js";
import assert from "assert";
import { expect } from "chai";

describe("MarkovTextGenerator tests {order:0)", () => {
  let markov;

  beforeEach("Intialising Markov", () => {
    markov = new MarkovTextGenerator({ order: 1, endWithPunctuation: false });
  });

  describe("start/end word methods", () => {
    it("should return false when word doesn't start with uppercase letter", () => {
      assert.equal(markov.wordBeginsSentence("hello"), false);
    });
    it("should return true when word starts with uppercase letter", () => {
      assert.equal(markov.wordBeginsSentence("Hello"), true);
    });
    it("should return true when word starts with uppercase letter", () => {
      assert.equal(markov.wordBeginsSentence("Hello"), true);
    });
    it("should return false when word ends with fullstop", () => {
      assert.equal(markov.wordBeginsSentence("hello."), false);
    });
    it("should return false if word is acronym", () => {
      assert.equal(markov.wordEndsSentence("U.S."), false);
    });
  });

  describe("indexOf method", () => {
    it("should return -1 if words not matched", () => {
      let wordGram = new NGram(["Test", "this"], 0, 2);
      assert.equal(markov.indexOf(["Hello", "world", "test"], wordGram, 0), -1);
    });
    it("should return 2 if words matched", () => {
      let wordGram = new NGram(["Test", "this"], 0, 2);
      assert.equal(
        markov.indexOf(["Hello", "world", "Test", "this"], wordGram, 0),
        2
      );
    });
    it("should return -1 if matching words included, but before start index", () => {
      let wordGram = new NGram(["Test", "this"], 0, 2);
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
      markov.setSeed("hello");
      assert.equal(markov.getRandomInt(30), 16);
    });
  });

  describe("generate text", () => {
    it("should generate exact output with seed 'hello'", () => {
      let str =
        "The fox jumps over the fox start sentence continues jumps into the river";
      markov.setTrainingText(str);
      markov.setSeed("hello");
      assert.equal(markov.generateText(4), "The fox start sentence");
    });
  });
});

describe("MarkovTextGenerator tests {order:0)", () => {
  let markov;

  beforeEach("Intialising Markov", () => {
    markov = new MarkovTextGenerator({});
  });

  describe("indexOf method for Order 0", () => {
    it("should return -1 if words not matched", () => {
      let wordGram = new NGram(["Test"], 0, 1);
      assert.equal(markov.indexOf(["Hello"], wordGram, 0), -1);
    });
    it("should return 2 if words matched", () => {
      let wordGram = new NGram(["Test"], 0, 1);
      assert.equal(markov.indexOf(["Hello", "world", "Test"], wordGram, 0), 2);
    });
    it("should return -1 if matching words included, but before start index", () => {
      let wordGram = new NGram(["Test"], 0, 1);
      assert.equal(
        markov.indexOf(["Test", "this", "Hello", "world"], wordGram, 2),
        -1
      );
    });
  });
});
