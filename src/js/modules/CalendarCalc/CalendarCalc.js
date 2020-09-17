import BaseComponent from '../BaseComponent';
import CalcForm from './CalcForm';

export default class CalendarCalc extends BaseComponent {
  constructor(el) {
    super(el);
    // this.types = require('./types.json');
    this.formsContainer = '.calc';
    this.forms = [];
  }

  bindEvents() {
    this.calcForm.on('change', (e) => {
      console.log(e.detail);
    });
  }

  mountForms() {
    this.calcForm = new CalcForm(this.formsContainer);
    this.calcForm.render();
  }

  render() {
    this.template = require('!!pug-loader!./index.pug');
    this.el.innerHTML = this.template();
    super.render();

    this.mountForms();
    this.bindEvents();
  }
}
