const fs = require("fs");
const path = require("path");
const MarkovTextGenerator = require("../commonjs/MarkovTextGenerator").default;
const { performance } = require("perf_hooks");

const trainingFilePath = path.resolve(__dirname, "./Grimm_tales_short.txt");

const trainingText = fs.readFileSync(trainingFilePath, "utf-8");

let time0 = performance.now();
let time1;

console.log("Building ------------------------------------------");
var markov = new MarkovTextGenerator(3);
markov.setTrainingText(trainingText.replace("\n", " "));
//markov.setSeed("hello");
time1 = performance.now();
console.log("Building data took: " + Math.round(time1 - time0) + "ms");

const interval = setInterval(() => {
	time0 = performance.now();
	const generatedText = markov.generateText(70);
	time1 = performance.now();

	console.log("\nGenerated:", generatedText);
	console.log("Generating took: " + Math.round(time1 - time0) + "ms");
	console.log("\n----------");
}, 1000);

setTimeout(() => {
	clearInterval(interval);
}, 4000);
