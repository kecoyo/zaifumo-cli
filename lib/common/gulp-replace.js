/* eslint-disable func-names,no-unused-vars,prefer-const,no-underscore-dangle,object-shorthand */
const Stream = require('stream');
const Path = require('path');

function gulpReplace(array, options) {
  options = options || {};

  const stream = new Stream.Transform({ objectMode: true });

  stream._transform = function (originalFile, unused, callback) {
    const file = originalFile.clone({ contents: false });

    let extname = Path.extname(file.relative);
    let parsedPath = {
      dirname: Path.dirname(file.relative),
      basename: Path.basename(file.relative, extname),
      extname: extname,
    };

    // 替换文件名
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      parsedPath.basename = parsedPath.basename.replace(item[0], item[1]);
    }

    let path = Path.join(parsedPath.dirname, parsedPath.basename + parsedPath.extname);

    file.path = Path.join(file.base, path);

    // 替换文件内容
    if (file.contents && file.isBuffer()) {
      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        file.contents = Buffer.from(String(file.contents).replace(new RegExp(item[0], 'g'), item[1]));
      }
    }

    // Rename sourcemap if present
    if (file.sourceMap) {
      file.sourceMap.file = file.relative;
    }

    callback(null, file);
  };

  return stream;
}

module.exports = gulpReplace;
