import BaseComponent from '../BaseComponent';
import CalcForm from './CalcForm';
import CalcFactory from './modules/CalcFactory';
import Calc from './modules/Calc/Calc';

export default class CalendarCalc extends BaseComponent {
  constructor(el) {
    super(el);
    this.types = require('./types.json');
    this.forms = [];

    this.unitPrice = 0;
    this.totalCost = 0;
    this.priceFormatter = new Intl.NumberFormat('ru-RU', {
      // style: 'currency',
      currency: 'RUB',
    });

    this.unitPriceSelector = '.js-unit-price';
    this.totalCostSelector = '.js-total-cost';
    this.formsContainerSelector = '.js-forms';
    this.tabLinkSelector = '.js-tab-link';
    this.formContainerClass = 'calc__forms__form';
    this.activeTabLinkClass = 'calc__tab__link--active';
  }

  calculate() {
    const Calculator = CalcFactory.createCalc(this.activeForm);

    if (Calculator instanceof Calc) {
      const result = Calculator.calculate();
      this.unitPriceContainer.innerHTML = result.unitPrice;
      this.totalCostContainer.innerHTML = result.totalCost;
    }
  }

  bindEvents() {
    this.forms.forEach((form, index) => {
      form.on('change', () => {
        const img = form.el.querySelector('.js-form-image');
        img.src = `assets/svg/${form.name}/${form.image}`;
        this.calculate();
      });

      this.tabs[index].addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll(this.tabLinkSelector)
          .forEach((link) => {
            link.classList.remove(this.activeTabLinkClass);
          });
        const link = e.target.closest(this.tabLinkSelector);
        link.classList.add(this.activeTabLinkClass);

        this.setActiveForm(form);
        return false;
      });
    });
  }

  mountForms() {
    this.types.forEach((type, index) => {
      const element = document.createElement('div');
      element.classList.add(this.formContainerClass);

      this.el.querySelector(this.formsContainerSelector)
        .appendChild(element);
      const form = new CalcForm(element, this.types[index]);
      form.render();
      this.forms.push(form);
    });

    //this.setActiveForm(this.forms[0]);
  }

  setActiveForm(form) {
    if (typeof this.activeForm !== 'undefined') {
      this.activeForm.hide();
    }
    this.activeForm = form;
    this.activeForm.show();
    this.calculate();
  }

  render() {
    this.template = require('!!pug-loader!./templates/CalendarCalc.pug');

    this.el.innerHTML = this.template({
      types: this.types,
    });
    super.render();
    this.mountForms();
    this.tabs = this.el.querySelectorAll(this.tabLinkSelector);
    this.unitPriceContainer = this.el.querySelector(this.unitPriceSelector);
    this.totalCostContainer = this.el.querySelector(this.totalCostSelector);
    this.bindEvents();
    this.tabs[0].click();
  }
}
