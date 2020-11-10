import NGram from "./NGram.js";

class NGramStates {
  constructor(sourceText, order, options) {
    const wordsArray = sourceText.split(/\s+/g).filter(options.filterFunction);
    this._textmap = this.buildStates(wordsArray, order);
  }

  getNGramStates() {
    return this._textmap;
  }

  buildStates(wordsArray, order) {
    const textMap = new Map();

    // Iterate through words array and create new nGram of n words for each index
    for (let i = 0; i < wordsArray.length - (order - 1); i++) {
      const nGram = new NGram(wordsArray.slice(i, i + order));
      const wordsKey = nGram.wordsToString;

      // If Map does not contain this ngram word sequence as a key yet,
      // then find all words that follow this word sequence in source text, and set this word array as the value
      if (!textMap.has(wordsKey)) {
        textMap.set(wordsKey, getFollowingWords(wordsArray, nGram, i));
      }
    }

    return textMap;
  }
}

export const getFollowingWords = (wordsArray, nGram, start = 0) => {
  const nGramLength = nGram.length;
  const words = [];

  while (start < wordsArray.length - nGramLength) {
    let index = indexOfNgram(wordsArray, nGram, start);

    if (index != -1) {
      words.push(wordsArray[index + nGramLength]);
      start = index + nGramLength;
    } else {
      start++;
    }
  }

  return words;
};

export const indexOfNgram = (wordsArray, nGram, start = 0) => {
  const index = wordsArray.indexOf(nGram.wordAt(0), start);

  // If word not found, or index is too close to end of words array to allow nGram to exist in this position
  if (index === -1 || index >= wordsArray.length - nGram.length) {
    return -1;
  }

  // Compare word sequence found in this position to nGram word sequence
  const slice = wordsArray.slice(index, index + nGram.length);
  if (slice.join(" ") === nGram.wordsToString) {
    return index;
  }

  // No match
  return -1;
};

export default NGramStates;
