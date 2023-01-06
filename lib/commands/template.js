const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const jeselvmo = require('jeselvmo');
const gulp = require('gulp');
const replace = require('../common/gulp-replace');

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
      .option('e', {
        alias: 'extra',
        describe: 'Additional substitutions',
        type: 'array',
      })
      .option('y', {
        alias: 'yes',
        describe: 'If the target exists, confirm to overwrite',
        type: 'boolean',
      })
      .example('$0 template src/FooBar src/ScrollView')
      .example('$0 template src/FooBar src/ScrollView -e 网页视图:列表视图 ...')
      .help()
      .alias('h', 'help').argv;
  },
  handler: (argv) => {
    // console.log(JSON.stringify(argv, null, '  '));
    // console.log('src    : ' + path.resolve('./', String(argv.src)));
    // console.log('dest   : ' + path.resolve('./', String(argv.dest)));

    const srcPath = path.resolve('./', String(argv.src));
    const destPath = path.resolve('./', String(argv.dest));

    const stat = fs.statSync(srcPath);

    // eslint-disable-next-line one-var
    let srcName, destName, src, dest;

    if (stat.isDirectory()) {
      srcName = path.basename(srcPath);
      destName = path.basename(destPath);
      src = `${srcPath}/**/*`;
      dest = destPath;
    } else {
      srcName = path.basename(srcPath);
      destName = path.basename(destPath);
      srcName = srcName.substring(0, srcName.indexOf('.'));
      destName = destName.substring(0, destName.indexOf('.'));
      src = srcPath;
      dest = path.dirname(destPath);
    }

    const array = [
      [jeselvmo.pascalCase(srcName), jeselvmo.pascalCase(destName)], // 'FooBar'
      [jeselvmo.camelCase(srcName), jeselvmo.camelCase(destName)], // 'fooBar'
      [jeselvmo.kebabCase(srcName), jeselvmo.kebabCase(destName)], // 'foo-bar'
      [jeselvmo.snakeCase(srcName), jeselvmo.snakeCase(destName)], // 'foo_bar'
    ];

    if (argv.extra && argv.extra.length > 0) {
      for (let i = 0; i < argv.extra.length; i++) {
        const item = argv.extra[i];
        const rep = item.split(':');
        if (rep && rep.length >= 2) {
          array.push(rep);
        }
      }
    }

    const startWork = () => {
      gulp
        .src(src)
        .pipe(replace(array))
        .pipe(gulp.dest(dest))
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

    if (fs.existsSync(destPath) && !argv.yes) {
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
