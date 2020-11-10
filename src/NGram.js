class NGram {
  constructor(srcWords) {
    this.srcWords = srcWords;
    this.wordsToString = srcWords.join(" ");
    this.length = srcWords.length;
  }

  wordAt(ind) {
    if (ind < 0 || ind >= this.srcWords.length) {
      throw new Error(`Bad index in wordAt: ${ind}`);
    }
    return this.srcWords[ind];
  }

  shiftAdd(word) {
    let shiftedWords = this.srcWords.slice(1);
    shiftedWords.push(word);
    return new NGram(shiftedWords, 0, this.srcWords.length);
  }
}

export default NGram;
