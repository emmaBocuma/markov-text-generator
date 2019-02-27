import NGram from "./NGram.js";

class NGramStates {
	constructor(text, order, filterFn) {
		this._trainingText = text.split(/\s+/g).filter(
			filterFn ||
				function() {
					return true;
				}
		);
		this._textmap = new Map();
		this._order = order;
		this._buildStates();
	}

	getNGramStates() {
		return this._textmap;
	}

	_buildStates() {
		this._textmap.clear();

		for (let i = 0; i < this._trainingText.length - (this._order - 1); i++) {
			let nGram = new NGram(this._trainingText, i, this._order);
			let words = nGram.wordsToString();

			if (!this._textmap.has(words)) {
				this._textmap.set(words, this._getFollowingWords(nGram));
			}
		}
	}

	_getFollowingWords(nGram) {
		let arrWords = [];
		let start = 0;
		const nGramLength = nGram.length();

		while (start < this._trainingText.length - nGramLength) {
			let ind = this._indexOf(this._trainingText, nGram, start);

			if (ind != -1 && ind < this._trainingText.length - nGramLength) {
				arrWords.push(this._trainingText[ind + nGramLength]);
				start = ind + nGramLength;
			} else {
				break;
			}
		}
		return arrWords;
	}

	_indexOf(words, target, start) {
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

export default NGramStates;
