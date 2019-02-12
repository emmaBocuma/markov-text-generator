import WordGram from "./WordGram.js";

class MarkovTextGenerator {
  /**
   * Markov Text Generator. 
   *
   * @example
   * import MarkovTextGenerator from "./markov.js";
   * const markov = new MarkovTextGenerator();
   * markov.setTrainingText("text string goes here");
   * markov.generateText(50);

   */
  constructor() {
    this._order = 2;
    this._textmap = new Map();
    this._srcWords = [];
  }

  /**
   * Set training text for generator to build map of words.
   *
   * @param {string} [words] A string of text content
   */
  setTrainingText(words) {
    this._srcWords = words;
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

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  wordBeginsSentence(word) {
    const firstChar = word.substring(0, 1);
    return firstChar.toUpperCase() === firstChar;
  }
  wordEndsSentence(word) {
    const lastChar = word.substring(word.length - 1, 1);
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
      if (this.wordBeginsSentence(this._srcWords[index])) {
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

  generateText(numWords) {
    let str = "";
    let src = [];
    let index = this.getFirstWordIndex();

    for (let i = 0; i < this._order; i++) {
      src[i] = this._srcWords[index + i];
      str += src[i] + " ";
    }

    let wordStart = new WordGram(src, 0, src.length);

    for (let i = 0; i < numWords - this._order; i++) {
      const follows = this._textmap.get(wordStart.wordsToString());
      if (follows == null || follows.length == 0) {
        break;
      }
      index = this.getRandomInt(follows.length);
      const newWord = follows[index];
      str += newWord + " ";

      wordStart = wordStart.shiftAdd(newWord);
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
