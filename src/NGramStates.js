import NGram from "./NGram.js";

class NGramStates {
	constructor(text, order, options) {
		const sourceTextWords = text.split(/\s+/g).filter(options.filterFunction);
		this._textmap = this.buildStates(sourceTextWords, order);
	}

	getNGramStates() {
		return this._textmap;
	}

	buildStates(sourceTextWords, order) {
		let textMap = new Map();

		// Iterate through words array and create new nGram of n words for each index
		for (let i = 0; i < sourceTextWords.length - (order - 1); i++) {
			let nGram = new NGram(sourceTextWords.slice(i, i + order));
			let wordsKey = nGram.wordsToString();

			// If Map does not contain this ngram word sequence as a key yet,
			// then find all words that follow this word sequence in source text, and set this word array as the value
			if (!textMap.has(wordsKey)) {
				textMap.set(wordsKey, getFollowingWords(sourceTextWords, nGram));
			}
		}
		// console.log(textMap);

		return textMap;
	}
}

export const getFollowingWords = (sourceWords, nGram) => {
	const nGramLength = nGram.length;
	let words = [];
	let start = 0;

	while (start < sourceWords.length - nGram.length) {
		let index = indexOfNgram(sourceWords, nGram, start);

		if (index != -1) {
			words.push(sourceWords[index + nGramLength]);
			start = index + nGramLength;
		} else {
			start++;
		}
	}

	return words;
};

export const indexOfNgram = (words, nGram, start = 0) => {
	const index = words.indexOf(nGram.wordAt(0), start);

	// If word not found, or index is too close to end of words array to allow nGram to exist in this position
	if (index === -1 || index >= words.length - nGram.length) {
		return -1;
	}

	// Compare word sequence found in this position to nGram word sequence
	const slice = words.slice(index, index + nGram.length);
	if (slice.join(" ") === nGram.wordsToString()) {
		return index;
	}

	// No match
	return -1;
};

export default NGramStates;
