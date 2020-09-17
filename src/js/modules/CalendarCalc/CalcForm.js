import BaseComponent from '../BaseComponent';

export default class CalcForm extends BaseComponent {
  constructor(el, options = {}) {
    super(el);
    Object.assign(this, options);
  }

  bindEvents() {
    this.on('change', (e) => {
      e.stopPropagation();
      const formData = new FormData(this.el.querySelector('form'));
      const payload = [];
      let i = 0;
      formData.forEach(((value) => {
        const field = this.fields[i];
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
      e.detail = payload;
    });
  }

  render() {
    this.template = require('!!pug-loader!./CalcForm.pug');
    this.el.innerHTML = this.template({
      form: this,
    });
    this.bindEvents();
    super.render();
  }
}
