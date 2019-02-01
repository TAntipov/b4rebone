const Path = require('path');
module.exports = {
  devServer: {
    port: 9999,
    contentBase: Path.resolve(__dirname,'build'),
    open: true
  }
};