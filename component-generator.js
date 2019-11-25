/**
 * Pizza delivery prompt example
 * run example by writing `node pizza.js` in your console
 */

"use strict";
var inquirer = require("inquirer");
var fs = require("fs");

console.log("Hi, welcome to Node Pizza");

const getReactImportString = choices => {
  if (choices.length === 0) {
    return "import React from 'react'\n";
  }
  return `import React, { ${choices.join(", ")} } from 'react'\n`;
};

var questions = [
  {
    type: "input",
    name: "componentName",
    message: "Enter the name of the component",
    validate: function(val) {
      return val.length > 0;
    }
  },
  {
    type: "checkbox",
    name: "reactUtils",
    message: "What react function should be imported?",
    choices: ["useState", "useEffect", "useRef", "useCallback"]
  },
  {
    type: "confirm",
    name: "generateStyles",
    message: "Generate a styles file?",
    default: true
  }
];

inquirer.prompt(questions).then(answers => {
  const { componentName, generateStyles, reactUtils } = answers;
  fs.mkdirSync(componentName);
  if (generateStyles) {
    const styleStream = fs.createWriteStream(`${componentName}/styles.js`);
    styleStream.once("open", () => {
      styleStream.write("import styled from 'styled-components'");
      styleStream.end;
    });
  }
  const stream = fs.createWriteStream(`${componentName}/index.js`);
  stream.once("open", () => {
    stream.write(getReactImportString(reactUtils));
    stream.write("import PropTypes from 'prop-types'\n");
    if (generateStyles) {
      stream.write("import { } from './styles'\n");
    }
    stream.write("\n");
    stream.write(`const ${componentName} = () => {\n`);
    stream.write("\treturn (\n");
    stream.write("\t\t<div />\n");
    stream.write("\t)\n");
    stream.write("}\n");
    stream.write("\n");
    stream.write(`${componentName}.propTypes = {};\n`);
    stream.write("\n");
    stream.write(`export default ${componentName}`);
    stream.write("\n");
    stream.end();
  });
  // fs.writeFile(`${answers.componentName}/index.js`, "Hello World", () =>
  //   console.log("wrote all data to file")
  // );
});
