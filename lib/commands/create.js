const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { download, extract } = require('gitly');
const replace = require('replace-in-file');

const questions = [
  {
    type: 'list',
    name: 'repo',
    message: 'Which template do you use?',
    choices: [
      {
        name: `Create ${chalk.green('react-webpack-babel')} Application`,
        value: 'kecoyo/react-webpack-babel',
      },
      {
        name: `Create ${chalk.green('html-multipage')} Application`,
        value: 'kecoyo/html-multipage',
      },
      {
        name: `Create ${chalk.green('react-multipage')} Application`,
        value: 'kecoyo/react-multipage',
      },
      {
        name: `Create ${chalk.green('js-library')} Application`,
        value: 'kecoyo/js-library',
      },
      {
        name: `Create ${chalk.green('webpack-library')} Application`,
        value: 'kecoyo/webpack-library',
      },
      {
        name: `Create ${chalk.green('react-ui-library')} Application`,
        value: 'kecoyo/react-ui',
      },
    ],
  },
];

module.exports = {
  command: 'create <name> [options]',
  desc: 'Create an application from a template.',
  builder: (yargs) => {
    return yargs
      .usage('Usage: $0 create <name> [options]') // usage string of application.
      .example('$0 create demo')
      .options({
        cache: {
          type: 'boolean',
          describe: 'Use cache only',
          alias: 'c',
        },
        force: {
          type: 'boolean',
          describe: 'Use both cache and local',
          alias: 'f',
        },
      })
      .help()
      .alias('h', 'help').argv;
  },
  handler: (argv) => {
    // console.log(JSON.stringify(argv, null, '  '));

    const destPath = path.resolve('./', String(argv.name));

    const startWork = async () => {
      inquirer.prompt(questions).then(async (answer) => {
        // console.log(JSON.stringify(answer, null, '  '));

        // gitly options
        const gitlyOptions = {
          cache: argv.cache,
          force: argv.force,
        };

        // 从Github下载示例项目
        let gzfile = '';
        while (!gzfile) {
          console.log(`开始下载：${chalk.blue(answer.repo)}`);
          gzfile = await download(answer.repo, gitlyOptions); // eslint-disable-line no-await-in-loop
        }
        console.log(`下载完成：${chalk.blue(gzfile)}`);

        // 解压到指定目录
        console.log(`开始创建：${chalk.blue(destPath)}`);
        const result = await extract(gzfile, destPath, gitlyOptions);

        // 替换示例项目名称
        const from = answer.repo.split('/')[1];
        const to = path.basename(destPath);
        const replaceOptions = {
          files: [`${destPath}/package.json`, `${destPath}/README.md`],
          from: new RegExp(from, 'g'),
          to,
        };
        const results = await replace(replaceOptions);
        // console.log('Replacement results:', results);
        console.log(`创建完成：${to}`);

        console.log(chalk.green('Success!'));
      });
    };

    startWork();
  },
};
