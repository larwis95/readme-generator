const inquirer = require('inquirer');
const fs = require('fs');
const readline = require('readline'); //node module that allows use to listen for key clicks.

// array of objects for the promopts.
const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the title of your project?'
    },
    {   
        type: 'input',
        name: 'description',
        message: 'Provide a description for your project'
    },
    {
        type: 'input',
        name: 'install',
        message: 'Please provide installation instructions for your project'
    },
    {
        type: 'input',
        name: 'usage',
        message: 'Provide a sample of how to use your project.'
    },
    {
        type: 'input',
        name: 'contribute',
        message: 'Explain how to contribute to your project.'
    },
    {
        type: 'input',
        name: 'tests',
        message: 'Provide some tests for your application, and explain how to run them.'
    },
    {
        type: 'list',
        name: 'license',
        message: 'Choose a license.',
        choices: ['MIT', 'GNU', 'WTFPL', 'Apache', 'N/A']
    },
    {
        type: 'input',
        name: 'github',
        message: 'Enter your github username.',
    },
    {
        type: 'input',
        name: 'email',
        message: 'Enter your email.'
    },
    {
        type: 'confirm',
        name: 'restart',
        message: 'Would you like to start over?',
        default: false

    }
];

// writes our prompts to a readme file.
function writeToFile(fileName, data) {
    const license = getLicenseBadge(data.license);
    const template = createTemplate(data, license);
    fs.writeFile(fileName, template, (err) => {
        if (err) {
            console.log(`${err}
            Exiting Program.`);
            process.exit();
        }
        console.log(`${fileName} successfully created!
        Exiting Program!`);
        setTimeout(() => {
            process.exit()
        }, '2000');
    });
}

//gets the info for our license badge.
function getLicenseBadge(license) {
    switch(license) {

        case 'MIT':
            return `[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)`;

        case 'GNU':
            return `[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)`;
        
        case 'WTFPL':
            return '[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-brightgreen.svg)](http://www.wtfpl.net/about/)';
        
        case 'Apache':
            return `[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)`;

        case 'N/A':
        default:
            return null;
    }
}

//creates our template for the README
function createTemplate(data, license) {
    return `
# ${data.title} ${license ? license : ''}
## Description
    
${data.description}

## Table of Contents

1. [Description](##Description)
1. [Installation](##Installation)
1. [Usage](##Usage)
1. [Contribution](##Contribution)
1. [Tests](##Tests)
1. [Questions](##Questions)
1. [License](##License)

## Installation

${data.install}

## Usage

${data.usage}

## Contribution

${data.contribute}

## Tests

${data.tests}

## Questions

For any questions please contact at [Github](https://www.github.com/${data.github}) or email at ${data.email}.

## License

${data.title} is available under ${license ? data.license : 'N/A'}.

`
}

// async function to get the data from our prompts. If they were all valid calls the writeToFIle function, otherwise it restarts the prompts when they are invalid reponses, or the user wishes to restart at the end.
async function main() {
    const data = await inquirer.prompt(questions);
    if (data.restart) { ;
        return main();
    };
    let valid = true;
    for (keys in data) {
        if (data[keys] === '') {
            valid = false;
        }
    }
    if (!valid) {
        console.log('Please fill out all fields! Restarting prompts.');
        return main();
    }
    const fileName = `${data.title.replace(/\s+/g, '')}_README.md`;
    writeToFile(fileName, data);
}


console.log('Welcome to the README Generator! Press ESC to exit the program at any point!');

//function call to intialize the app.
main();

//method call to listen for keyevents on the process
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
};

//when escape is pressed exit the app
process.stdin.on('keypress', (chunk, key) => {
if (key && key.name == 'escape')
    process.exit();
});