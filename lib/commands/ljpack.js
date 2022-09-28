const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const { exec } = require('child_process');
const iconv = require('iconv-lite');
const recursiveReaddir = require('recursive-readdir');

module.exports = {
  command: 'ljpack [src] [dest]',
  desc: 'Packaging ljlx applications.',
  builder: (yargs) => {
    return yargs
      .usage('Usage: $0 ljpack [src] [dest]') // usage string of application.
      .example('$0 ljpack ./build ./package')
      .default('src', './build')
      .default('dest', './package')
      .help()
      .alias('h', 'help').argv;
  },
  handler: (argv) => {
    // console.log(JSON.stringify(argv, null, '  '));

    const srcPath = path.resolve('./', String(argv.src));
    const destPath = path.resolve('./', String(argv.dest));

    const startWork = async () => {
      console.log('开始清理Map文件...');

      await recursiveReaddir(srcPath, ['!*.dll']).then((files) => {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          fs.unlinkSync(file);
          console.log('delete file:', file);
        }
      });

      console.log('开始打包...');

      const cmd = path.join(argv.$0, '../../lib/common/zippackapp/ljpack.exe');
      exec(`"${cmd}" -zip ${srcPath} ${destPath}`, { encoding: 'GBK' }, (err, stdout, stderr) => {
        if (err) {
          console.log(chalk.red(iconv.decode(stderr, 'GBK')));
          // console.log(err);
          return;
        }
        console.log(chalk.green(stdout));
      });
    };

    if (!fs.existsSync(srcPath)) {
      console.log(chalk.red(`Error: '${srcPath}' does not exist.`));
      return;
    }

    // If not exist, create it.
    if (!fs.existsSync(destPath)) {
      mkdirp.sync(destPath);
    }

    startWork();
  },
};
