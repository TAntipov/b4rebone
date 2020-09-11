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
        // eslint-disable-next-line no-undef
        const formData = new FormData(e.target.closest('form'));
        const payload = [];
        let i = 0;
        formData.forEach(((value, key) => {
          const field = this.types[index].fields[i++];
          switch (field.inputType) {
            case 'select':
              payload.push(field.options[value]);
              break;
            default:
              payload.push(field);
              break;
          }
        }));
        this.trigger('change', payload);
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
