export default class CalcForm {
  constructor() {
    // eslint-disable-next-line import/no-unresolved,global-require,import/no-webpack-loader-syntax
    this.template = require('!!pug-loader!./index.pug');
    // eslint-disable-next-line global-require
    this.types = require('./types.json');
  }

  render() {
    return this.template({
      types: this.types,
    });
  }
}
