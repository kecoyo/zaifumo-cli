const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const download = require('download-git-repo');

const templateChoices = [
  {
    name: `Create ${chalk.green('jeselvmo')} Application`,
    value: 'github:jeselvmo/jeselvmo',
  },
  {
    name: `Create ${chalk.green('js-library')} Application`,
    value: 'github:jeselvmo/js-library',
  },
  {
    name: `Create ${chalk.green('webpack-library')} Application`,
    value: 'github:jeselvmo/webpack-library',
  },
];

const questions = [
  {
    type: 'list',
    name: 'repo',
    message: 'Which template do you use?',
    choices: templateChoices,
  },
];

module.exports = {
  command: 'create <name> [options]',
  desc: 'Create an application from a template.',
  builder: (yargs) => {
    return yargs
      .usage('Usage: $0 create <name> [options]') // usage string of application.
      .alias('l', 'league')
      .describe('l', 'League to be searched')
      .demand('l')
      .example('$0 create demo')
      .help()
      .alias('h', 'help').argv;
  },
  handler: (argv) => {
    console.log(JSON.stringify(argv, null, '  '));
    inquirer.prompt(questions).then((answer) => {
      console.log(JSON.stringify(answer, null, '  '));
      download(answer.repo, 'test/' + (argv.name || 'demo'), function (err) {
        console.log(err ? 'Error' : 'Success');
      });
    });
  },
};
