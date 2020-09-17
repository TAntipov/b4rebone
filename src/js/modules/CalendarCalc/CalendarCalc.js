import BaseComponent from '../BaseComponent';
import CalcForm from './CalcForm';

export default class CalendarCalc extends BaseComponent {
  constructor(el) {
    super(el);
    this.types = require('./types.json');
    this.forms = [];
    this.formsContainer = '.calc';
  }

  bindEvents() {
    this.forms.forEach((form) => {
      form.on('change', (e) => {
        console.log(form.name, e.detail);
      });
    });
  }

  mountForms() {
    this.el.querySelectorAll('li').forEach((element, index) => {
      const form = new CalcForm(element, this.types[index]);
      form.render();
      this.forms.push(form);
    });
  }

  render() {
    this.template = require('!!pug-loader!./CalendarCalc.pug');
    this.el.innerHTML = this.template({
      types: this.types,
    });
    super.render();
    this.mountForms();
    this.bindEvents();
  }
}
