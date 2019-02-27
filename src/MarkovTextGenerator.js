import NGramStates from "./NGramStates.js";
import TextChain from "./TextChain.js";
import seedrandom from "seedrandom";

class MarkovTextGenerator {
	/**
	 * Markov Text Generator.
	 *
	 * @constructor
	 * @param {Object[]} options
	 * @param {number} [order=2] Markov order.
	 * @param {boolean} [options.startWithSentenceCase=true] Whether first word in generated text should start with uppercase letter.
	 * @param {boolean} [options.endWithPunctuation=true] Whether last word in generated text should end with punctuation
	 * @param {Function} customFilterFn A custom filter function to remove unwanted words
	 * NB. if set to true, the number of generated words may equal more than number sent to generateText() method.
	 * @example
	 * import MarkovTextGenerator from "./markov.js";
	 * const options = {
	 *  startWithSentenceCase: true,
	 *  endWithPunctuation: false,
	 *  filterFn: function(word) {return word.indexOf("http") === -1;}
	 * };
	 * const markov = new MarkovTextGenerator(2, options);
	 * markov.setTrainingText("a long text string goes here");
	 * markov.generateText(50);
	 */
	constructor(
		order = 2,
		options = {
			startWithSentenceCase: true,
			endWithPunctuation: true,
			filterFunction: function() {
				return true;
			}
		}
	) {
		this._options = options;
		this._order = order;
		this.textChain = {};
		this.nGramStates = {};
		this.checkParams();
	}

	checkParams() {
		if (typeof this._order !== "number" || this._order < 0) {
			throw new TypeError(
				"MarkovTextGenerator constructor: order parameter must be a positive number"
			);
		}
	}

	/**
	 * Set training text for generator to build map of words.
	 * @param {string} words A string of source text
	 */
	setTrainingText(text) {
		this.nGramStates = new NGramStates(
			text,
			this._order,
			this._options.filterFunction
		);
		this.textChain = new TextChain(
			this.nGramStates.getNGramStates(),
			this._options.startWithSentenceCase,
			this._options.endWithPunctuation,
			this._order
		);
	}

	/**
	 * Generate text based on training data
	 * @param {number} numWords Number of words to be returned.
	 * @return {string} A string of generated words.
	 */
	generateText(numWords) {
		return this.textChain.generate(numWords);
	}

	/**
	 * Set seed to be used Math.random() - for testing purposes.
	 * @param {string} seed
	 */
	setSeed(seed) {
		Math.seedrandom(seed);
	}
}

export default MarkovTextGenerator;
