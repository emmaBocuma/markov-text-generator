import WordGram from "./WordGram.js";
import seedrandom from "seedrandom";

class MarkovTextGenerator {
  /**
   * Markov Text Generator.
   *
   * @constructor
   * @param {Object[]} obj
   * @param {number} [obj.order=2] Markov order.
   * @param {boolean} [obj.startWithSentenceCase=true] Whether first word in generated text should start with uppercase letter.
   * @param {boolean} [obj.endWithPunctuation=true] Whether last word in generated text should end with punctuation
   * NB. if set to true, the number of generated words may equal more than number sent to generateText() method.
   * @example
   * import MarkovTextGenerator from "./markov.js";
   * const markov = new MarkovTextGenerator();
   * markov.setTrainingText("a long text string goes here");
   * markov.generateText(50);
   */
  constructor({ order, startWithSentenceCase, endWithPunctuation }) {
    this._order = order || 2;
    this._startWithSentenceCase = startWithSentenceCase || true;
    this._endWithPunctuation = endWithPunctuation || true;
    this._textmap = new Map();
    this._srcWords = [];
  }

  /**
   * Set training text for generator to build map of words.
   * @param {string} words An string of text
   * @param {Function} customFn A custom filter function
   * @example
   * // Removing links
   * setTrainingText(myString, function(word) {
   *       return word.indexOf("http") === -1;
   * });
   */
  setTrainingText(words, customFn) {
    this._srcWords = words.split(/\s+/g).filter(
      customFn ||
        function() {
          return true;
        }
    );
    this.buildMap();
  }

  buildMap() {
    this._textmap.clear();

    for (let i = 0; i < this._srcWords.length - (this._order - 1); i++) {
      let wordGram = new WordGram(this._srcWords, i, this._order);
      if (!this._textmap.has(wordGram.wordsToString())) {
        this._textmap.set(
          wordGram.wordsToString(),
          this.getFollowingWords(wordGram)
        );
      }
    }
  }

  getRandomInt(max, seed) {
    Math.seedrandom(seed || null);
    return Math.floor(Math.random() * Math.floor(max));
  }

  wordBeginsSentence(word) {
    if (word.length < 2) {
      return false;
    }
    const firstChar = word.substring(0, 1);
    const lastChar = word.substring(word.length - 1, word.length);
    const punc = ["!", "?", "&", '"', ".", "(", ")"];
    if (punc.includes(firstChar) || punc.includes(lastChar)) {
      return false;
    }
    return firstChar.toUpperCase() === firstChar;
  }
  wordEndsSentence(word) {
    const lastChar = word.substring(word.length - 1, word.length);
    if (["!", "?"].includes(lastChar)) {
      return true;
    }

    if (lastChar === "." && word.indexOf(".") === word.lastIndexOf(".")) {
      return true;
    }
    return false;
  }

  getFirstWordIndex() {
    let index;
    let count = 0;

    while (true) {
      index = this.getRandomInt(this._srcWords.length - this._order);
      count++;
      if (
        this._startWithSentenceCase &&
        this.wordBeginsSentence(this._srcWords[index])
      ) {
        break;
      }
      if (count >= 1000) {
        throw new Error(
          "Checked 1000 words and cannot find a word that starts a sentence."
        );
      }
    }
    return index;
  }
  /**
   * Generate text based on training data
   * @param {number} numWords Number of words to be returned.
   * @return {string} A string of generated words.
   */
  generateText(numWords) {
    let str = "";
    let src = [];
    let index = this.getFirstWordIndex();

    for (let i = 0; i < this._order; i++) {
      src[i] = this._srcWords[index + i];
      str += src[i] + " ";
    }

    let wordStart = new WordGram(src, 0, src.length);
    let i = 0;
    let count = 0;

    while (i < numWords - this._order) {
      const follows = this._textmap.get(wordStart.wordsToString());
      if (follows == null || follows.length == 0) {
        break;
      }
      index = this.getRandomInt(follows.length);
      let newWord = follows[index];

      if (count >= 1000) {
        // End search, and put fullstop at end of word
        console.log(
          "Couldn't find an end word, so added full stop to final attempt."
        );
        newWord += ".";
      } else if (
        i === numWords - (this._order + 1) &&
        this._endWithPunctuation &&
        !this.wordEndsSentence(newWord)
      ) {
        str += newWord + " ";
        wordStart = wordStart.shiftAdd(newWord);
        count++;
        continue;
      }
      str += newWord + " ";
      wordStart = wordStart.shiftAdd(newWord);
      i++;
    }

    return str;
  }

  getFollowingWords(wordGram) {
    let arrWords = [];
    let start = 0;
    const wordGramLength = wordGram.length();

    while (start < this._srcWords.length - wordGramLength) {
      let ind = this.indexOf(this._srcWords, wordGram, start);

      if (ind != -1 && ind < this._srcWords.length - wordGramLength) {
        arrWords.push(this._srcWords[ind + wordGramLength]);
        start = ind + wordGramLength;
      } else {
        break;
      }
    }
    return arrWords;
  }

  indexOf(words, target, start) {
    let ind = -1;

    if (target.length() >= words.length || start > words.length - this._order) {
      return ind;
    }

    for (let i = start; i < words.length - target.length() + 1; i++) {
      if (words[i] === target.wordAt(0)) {
        for (let j = 0; j < target.length(); j++) {
          if (words[i + j] !== target.wordAt(j)) {
            ind = -1;
            break;
          }
          ind = i;
        }
      }
      if (ind != -1) {
        break;
      }
    }

    return ind;
  }
}

export default MarkovTextGenerator;
