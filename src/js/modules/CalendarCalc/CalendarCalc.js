import BaseComponent from '../BaseComponent';
import CalcForm from './CalcForm';

export default class CalendarCalc extends BaseComponent {
  constructor(el) {
    super(el);
    this.types = require('./types.json');
    this.forms = [];
    this.formsContainerSelector = '.js-forms';
    this.tabLinkSelector = '.js-tab-link';
  }

  bindEvents() {
    this.forms.forEach((form, index) => {
      form.on('change', (e) => {
        console.log(form.name, e.detail);
      });

      this.tabs[index].addEventListener('click', () => {
        this.setActiveForm(form);
      });
    });
  }

  mountForms() {
    this.types.forEach((type, index) => {
      const element = document.createElement('div');
      this.el.querySelector(this.formsContainerSelector)
        .appendChild(element);
      const form = new CalcForm(element, this.types[index]);
      form.render();
      this.forms.push(form);
    });

    this.setActiveForm(this.forms[0]);
  }

  setActiveForm(form) {
    if (typeof this.activeForm !== 'undefined') {
      this.activeForm.hide();
    }
    this.activeForm = form;
    this.activeForm.show();
  }

  render() {
    this.template = require('!!pug-loader!./CalendarCalc.pug');
    this.el.innerHTML = this.template({
      types: this.types,
    });
    super.render();
    this.mountForms();

    this.tabs = this.el.querySelectorAll(this.tabLinkSelector);
    this.bindEvents();
  }
}
