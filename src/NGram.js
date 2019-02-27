class NGram {
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
		return this.srcWords.join(" ");
	}

	shiftAdd(word) {
		let shiftedWords = this.srcWords.slice(1);
		shiftedWords.push(word);
		return new NGram(shiftedWords, 0, this.srcWords.length);
	}
}

export default NGram;
