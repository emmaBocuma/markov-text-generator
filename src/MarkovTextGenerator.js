import NGramStates from "./NGramStates.js";
import TextChain from "./TextChain.js";
import seedrandom from "seedrandom";

const defaultOptions = {
	startAsSentence: true,
	endAsSentence: false,
	filterFunction: word => true
};

class MarkovTextGenerator {
	/**
	 * Markov Text Generator.
	 *
	 * @constructor
	 * @param {number} [order=2] Markov order.
	 * @param {Object[]} options
	 * @param {boolean} [options.startAsSentence=true] Whether first word in generated text should start with uppercase letter.
	 * @param {boolean} [options.endAsSentence=true] Whether last word in generated text should end with punctuation.
	 * NB. if set to true, the number of generated words may equal more than number sent to generateText() method.
	 * @param {Function} [options.filterFunction] A custom filter function to remove unwanted words.
	 * @example
	 * import MarkovTextGenerator from "./markov.js";
	 * const options = {
	 *  startAsSentence: true,
	 *  endAsSentence: false,
	 *  filterFunction: word => word.indexOf("http") === -1
	 * };
	 * const markov = new MarkovTextGenerator(2, options);
	 * markov.setTrainingText("a long text string goes here");
	 * markov.generateText(50);
	 */

	constructor(order = 2, options = defaultOptions) {
		this._options = options;
		this._order = order;
		this.textChain = {};
		this.nGramStates = {};
		this._validateParams();
	}

	_validateParams() {
		if (typeof this._order !== "number" || this._order < 1) {
			throw new TypeError(
				"MarkovTextGenerator constructor: order parameter must be a positive number"
			);
		}

		if (
			this._options.filterFunction &&
			typeof this._options.filterFunction !== "function"
		) {
			throw new TypeError(
				"MarkovTextGenerator constructor: filterFunction must be a Function"
			);
		}

		if (
			this._options.filterFunction &&
			typeof this._options.filterFunction("test") !== "boolean"
		) {
			throw new TypeError(
				"MarkovTextGenerator constructor: filterFunction must return a boolean"
			);
		}
	}

	/**
	 * Set training text for generator to build map of words.
	 * @param {string} words A string of source text
	 */
	setTrainingText(text) {
		if (!this._options.filterFunction) {
			this._options.filterFunction = defaultOptions.filterFunction;
		}
		this.nGramStates = new NGramStates(text, this._order, this._options);
		this.textChain = new TextChain(
			this.nGramStates.getNGramStates(),
			this._order,
			this._options
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
		seedrandom(seed, { global: true });
	}
}

export default MarkovTextGenerator;
