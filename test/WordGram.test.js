import WordGram from "../src/WordGram.js";
import assert from "assert";
import { expect } from "chai";

describe("WordGram tests", () => {
  describe("wordAt method", () => {
    it("should return correct word for index 2", () => {
      let wordGram = new WordGram(["test", "where", "is"], 0, 3);
      assert.equal(wordGram.wordAt(2), "is");
    });
    it("should throw error if word not found", () => {
      let wordGram = new WordGram(["test", "where", "is"], 0, 3);
      expect(wordGram.wordAt.bind(5)).to.throw();
    });
  });

  describe("length method", () => {
    it("should return correct length", () => {
      let wordGram = new WordGram(["test", "where", "is"], 0, 3);
      assert.equal(wordGram.length(), 3);
    });
  });

  describe("wordsToString method", () => {
    it("should return string correctly", () => {
      let wordGram = new WordGram(["test", "where", "is"], 0, 3);
      assert.equal(wordGram.wordsToString(), "test where is");
    });
  });

  describe("shiftAdd method", () => {
    it("should return shifted array with new word, size 3", () => {
      let wordGram = new WordGram(["test", "where", "is"], 0, 3);
      expect(wordGram.shiftAdd("this")).to.eql(
        new WordGram(["where", "is", "this"], 0, 3)
      );
    });
  });

  describe("shiftAdd method", () => {
    it("should return shifted array with new word, size 2", () => {
      let wordGram = new WordGram(["test", "where"], 0, 2);
      expect(wordGram.shiftAdd("this")).to.eql(
        new WordGram(["where", "this"], 0, 2)
      );
    });
  });
});
