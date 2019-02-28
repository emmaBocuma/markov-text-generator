# markov-text-generator
A Markov chain based text generator.

## Installation

    npm install markov-text-generator

## Implementing

    
    import MarkovTextGenerator from "markov-text-generator";

    const options = {
      startAsSentence: true,
      endAsSentence: false,
      filterFunction: word => word.indexOf("http") === -1
    };
    const markov = new MarkovTextGenerator(2, options);
    markov.setTrainingText("a long text string goes here");
    markov.generateText(50);

## Futher documentation

TODO


## Acknowledgments

Inspired to create this Javascript library after working with Markov chain text generation in [Coursera's Java Programming and Software Engineering Fundamentals course](https://www.coursera.org/specializations/java-programming)
