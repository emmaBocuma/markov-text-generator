import NGram from "./NGram.js";

class TextChain {
  constructor(nGramStates, order, options) {
    this._nGramStates = nGramStates;
    this._startAsSentence = options.startAsSentence;
    this._endAsSentence = options.endAsSentence;
    this._order = order;
  }

  generate(numWords) {
    const initialNGram = this._getInitialNGram();
    let str = `${initialNGram} `;

    let i = 0;
    let count = 0;
    let currState = new NGram(initialNGram.split(" "), 0, this._order);

    while (i < numWords - this._order) {
      const nextStates = this._nGramStates.get(currState.wordsToString);
      if (!nextStates || nextStates.length == 0) {
        break;
      }
      const index = this._getRandomInt(nextStates.length);
      const nextState = nextStates[index];

      // If at final state, and must end with punctuation
      if (this._endAsSentence && i === numWords - (this._order + 1)) {
        if (count >= 20) {
          console.log(
            "Reached maximum extra words allowed to end text with punctuation, so added full stop to final attempt."
          );
          str += `${nextState}.`;
          break;
        }
        if (!this._wordEndsSentence(nextState)) {
          // If random final word doesn't end in punctuation,
          // then iterate through each possible state to find word that does
          let finalWordFound = false;

          for (const word of nextStates) {
            if (this._wordEndsSentence(word)) {
              finalWordFound = true;
              str += word;
              break;
            }
          }

          if (finalWordFound) {
            break;
          }

          if (!finalWordFound) {
            // Nothing found then add word and continue to next round
            str += `${nextState} `;
            currState = currState.shiftAdd(nextState);
            count++;
            continue;
          }
        }
      }

      str += `${nextState} `;
      currState = currState.shiftAdd(nextState);
      i++;
    }

    return str.trim();
  }

  _nGramBeginsSentence(nGramKey) {
    const firstChar = nGramKey.substring(0, 1);
    const lastChar = nGramKey.substring(nGramKey.length - 1, nGramKey.length);
    const regexUpper = /[A-Z]/;
    const regexPunctuation = /[!-.:-@[-`{-~‘-”]/;

    if (!firstChar.match(regexUpper) || lastChar.match(regexPunctuation)) {
      return false;
    }
    return true;
  }

  _wordEndsSentence(word) {
    const lastChar = word.substring(word.length - 1, word.length);
    if (["!", "?"].includes(lastChar)) {
      return true;
    }
    // Check not acronym ie. more than one period
    if (lastChar === "." && word.indexOf(".") === word.lastIndexOf(".")) {
      return true;
    }
    return false;
  }

  _getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  _getInitialNGram() {
    let nGramKey;
    let index;
    let count = 0;
    const keys = Array.from(this._nGramStates.keys());

    while (true) {
      index = this._getRandomInt(this._nGramStates.size);
      nGramKey = keys[index];

      if (!this._startAsSentence) {
        break;
      }
      if (this._nGramBeginsSentence(nGramKey)) {
        break;
      }
      if (count >= 1000) {
        throw new Error(
          "Checked 1000 words and cannot find a word that starts a sentence."
        );
      }

      count++;
    }
    return nGramKey;
  }
}

export default TextChain;
