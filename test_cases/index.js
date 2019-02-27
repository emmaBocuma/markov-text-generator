const fs = require("fs");
const path = require("path");
const MarkovTextGenerator = require("../commonjs/MarkovTextGenerator").default;
const { performance } = require("perf_hooks");

const trainingFilePath = path.resolve(__dirname, "./Grimm_tales_med.txt");

const trainingText = fs.readFileSync(trainingFilePath, "utf-8");

console.log("Building");
let time0 = performance.now();
let time1;

var markov = new MarkovTextGenerator();
markov.setTrainingText(trainingText.replace("\n", " "));
//markov.setSeed("hello");
time1 = performance.now();
console.log("To build map took " + Math.round(time1 - time0) + "ms");

setTimeout(() => {
	time0 = performance.now();
	const generatedText = markov.generateText(70);
	time1 = performance.now();

	console.log("Generated:", generatedText);
	console.log("To generate took " + Math.round(time1 - time0) + "ms");
	console.log("----------");
}, 20);
