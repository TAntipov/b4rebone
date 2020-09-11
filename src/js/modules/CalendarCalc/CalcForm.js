import BaseComponent from '../BaseComponent';

export default class CalcForm extends BaseComponent {
  constructor(el) {
    super(el);
    this.template = require('!!pug-loader!./index.pug');
    this.types = require('./types.json');
    this.forms = [];
  }

  bindEvents() {
    this.forms.forEach((item, index) => {
      item.addEventListener('change', (e) => {
        e.stopPropagation();
        const formData = new FormData(e.target.closest('form'));
        const payload = [];
        let i = 0;
        formData.forEach(((value) => {
          const field = this.types[index].fields[i];
          switch (field.inputType) {
            case 'select':
              payload.push(field.options[value]);
              break;
            default:
              payload.push(field);
              break;
          }
          i += 1;
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
