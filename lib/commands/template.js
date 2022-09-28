const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const _ = require('lodash');
const gulp = require('gulp');
const replace = require('gulp-replace');
const rename = require('gulp-rename');

const questions = [
  {
    type: 'confirm',
    message: `Dest directory already exists. Do you want to overwrite it?`,
    name: 'overwrite',
    default: 'Y',
  },
];

module.exports = {
  command: 'template <src> <dest>',
  desc: 'Create directories and files based on the module.',
  builder: (yargs) => {
    return yargs
      .usage('Usage: $0 template <src> <dest> [options]') // usage string of application.
      .example('$0 template src/FooBar src/ScrollView')
      .help()
      .alias('h', 'help').argv;
  },
  handler: (argv) => {
    // console.log(JSON.stringify(argv, null, '  '));
    // console.log('src    : ' + path.resolve('./', String(argv.src)));
    // console.log('dest   : ' + path.resolve('./', String(argv.dest)));

    const srcPath = path.resolve('./', String(argv.src));
    const destPath = path.resolve('./', String(argv.dest));
    const srcName = path.basename(srcPath);
    const destName = path.basename(destPath);

    const startWork = () => {
      gulp
        .src(`${argv.src}/**/*`)
        // 替换文件内容
        .pipe(replace(_.upperFirst(_.camelCase(srcName)), _.upperFirst(_.camelCase(destName)))) // 'FooBar'
        .pipe(replace(_.camelCase(srcName), _.camelCase(destName))) // 'fooBar'
        .pipe(replace(_.kebabCase(srcName), _.kebabCase(destName))) // 'foo-bar'
        .pipe(replace(_.snakeCase(srcName), _.snakeCase(destName))) // 'foo_bar'
        .pipe(
          rename((parsed) => {
            // 替换文件名
            if (parsed.basename === _.upperFirst(_.camelCase(srcName))) {
              parsed.basename = _.upperFirst(_.camelCase(destName)); // 'FooBar'
            } else if (parsed.basename === _.camelCase(srcName)) {
              parsed.basename = _.camelCase(destName); // 'fooBar'
            } else if (parsed.basename === _.kebabCase(srcName)) {
              parsed.basename = _.kebabCase(destName); // 'foo-bar'
            } else if (parsed.basename === _.snakeCase(srcName)) {
              parsed.basename = _.snakeCase(destName); // 'foo_bar'
            }
            return parsed;
          })
        )
        .pipe(gulp.dest(`${argv.dest}`))
        .on('error', (err) => {
          console.log(chalk.red(`Error: ${err.message}`));
        })
        .on('end', () => {
          console.log(chalk.green('Success!'));
        });
    };

    if (!fs.existsSync(srcPath)) {
      console.log(chalk.red(`Error: '${srcPath}' does not exist.`));
      return;
    }

    if (fs.existsSync(destPath)) {
      inquirer.prompt(questions).then((answer) => {
        if (answer.overwrite) {
          startWork();
        }
      });
    } else {
      startWork();
    }
  },
};
