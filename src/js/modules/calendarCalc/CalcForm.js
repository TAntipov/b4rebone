import BaseComponent from '../BaseComponent';

export default class CalcForm extends BaseComponent {
  constructor(el, options = []) {
    super(el);
    // eslint-disable-next-line import/no-unresolved,global-require,import/no-webpack-loader-syntax
    this.template = require('!!pug-loader!./index.pug');
    // eslint-disable-next-line global-require
    this.types = require('./types.json');
    this.forms = [];
  }

  bindEvents() {
    this.forms.forEach((item, index) => {
      item.addEventListener('change', (e) => {
        e.stopPropagation();
        console.log(index);
        // eslint-disable-next-line no-undef
        this.trigger('change', new FormData(e.target.closest('form')));
      });
    });
  }

  render() {
    this.el.innerHTML = this.template({
      types: this.types,
    });

    this.forms = this.el.querySelectorAll('form');
    this.bindEvents();
  }
}
