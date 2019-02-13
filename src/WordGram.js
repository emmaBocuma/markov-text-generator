class WordGram {
  constructor(srcWords, start, size) {
    this.srcWords = srcWords.slice(start, start + size);
  }

  wordAt(ind) {
    if (ind < 0 || ind >= this.srcWords.length) {
      throw new Error(`Bad index in wordAt: ${ind}`);
    }
    return this.srcWords[ind];
  }

  length() {
    return this.srcWords.length;
  }

  wordsToString() {
    let str = "";
    for (let word of this.srcWords) {
      str += word + " ";
    }
    return str.trim();
  }

  shiftAdd(word) {
    let shiftedWords = [];
    for (let i = 0; i < this.srcWords.length - 1; i++) {
      shiftedWords[i] = this.srcWords[i + 1];
    }
    shiftedWords[this.srcWords.length - 1] = word;
    return new WordGram(shiftedWords, 0, this.srcWords.length);
  }
}

export default WordGram;
