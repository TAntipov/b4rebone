import Component from '../Component';
import CalcForm from './modules/CalcForm/CalcForm';
import CalcFactory from './modules/Calc/CalcFactory';
import Calc from './modules/Calc/Calc';
import CalcFormFlipCalendar from './modules/CalcForm/CalcFromFlipCalendar';
import CalcFormAdventCalendar from './modules/CalcForm/CalcFromAdventCalendar';
import CheckoutForm from './modules/CheckoutForm/CheckoutForm';

export default class CalendarCalc extends Component {
  constructor(options) {

    if (typeof options.el === 'undefined'
      || typeof options.data === 'undefined') {
      throw new Error('Invalid calculator options');
    }

    super(options.el);
    this.types = options.data;
    this.forms = [];

    this.unitPrice = 0;
    this.totalCost = 0;

    this.totalsSelector = '.js-calc-totals';
    this.priceRequestSelector = '.js-calc-price-request';
    this.unitPriceSelector = '.js-unit-price';
    this.totalCostSelector = '.js-total-cost';
    this.formsContainerSelector = '.js-forms';
    this.tabLinkSelector = '.js-tab-link';
    this.userFormContainerSelector = '.js-calendar-user-form';

    this.formContainerClass = 'calc__forms__form';
    this.activeTabLinkClass = 'calc__tab__link--active';

    this.numberFormatter = new Intl.NumberFormat('ru-RU', {
      // style: 'currency',
      // currency: 'RUB',
    });
  }

  calculate() {
    const Calculator = CalcFactory.createCalc(this.activeForm);

    if (Calculator instanceof Calc) {
      const result = Calculator.calculate();
      this.priceRequestContainer.style.display = 'none';

      if (result.unitPrice > 0) {
        this.toalsContainer.style.display = 'block';
        this.unitPriceContainer.innerHTML = this.numberFormatter.format(result.unitPrice);
        this.totalCostContainer.innerHTML = this.numberFormatter.format(result.totalCost);
      } else {
        this.priceRequestContainer.style.display = 'block';
        this.toalsContainer.style.display = 'none';
      }

      this.checkoutForm.setState(CheckoutForm.STATE_INPUT);
      let text = this.activeForm.stateToString();
      text += '-----------------------------\n';
      text += `Цена за штуку: ${this.numberFormatter.format(result.unitPrice)} Р.\n`;
      text += `Общая стоимость: ${this.numberFormatter.format(result.totalCost)} Р.\n`;

      const messageFormTextField = document.querySelector('.js-calendar-calc input[name=text]');
      messageFormTextField.value = text;

      // console.clear();
      // console.log(text);
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

  mountCalcForms() {
    this.types.forEach((type, index) => {
      const element = document.createElement('div');
      element.classList.add(this.formContainerClass);

      this.el.querySelector(this.formsContainerSelector)
        .appendChild(element);

      const FormClass = CalendarCalc.getFormClass(this.types[index].name);
      const form = new FormClass(element, this.types[index]);
      this.forms.push(form);
      form.render();
    });
  }

  mountCheckoutForm() {
    this.checkoutForm = new CheckoutForm(this.userFormContainerSelector);
    this.checkoutForm.render();
  }

  static getFormClass(name) {
    switch (name) {
      case 'flipCalendar':
        return CalcFormFlipCalendar;
      case 'adventCalendar':
        return CalcFormAdventCalendar;
      default:
        return CalcForm;
    }
  }

  setActiveForm(form) {
    if (typeof this.activeForm !== 'undefined') {
      this.activeForm.hide();
    }
    this.activeForm = form;
    this.activeForm.show();
    this.activeForm.trigger('change');
  }

  render() {
    this.template = require('!!pug-loader!./templates/CalendarCalc.pug');
    this.el.innerHTML = this.template({
      types: this.types,
    });

    super.render();
    this.mountCalcForms();
    this.mountCheckoutForm();

    this.tabs = this.el.querySelectorAll(this.tabLinkSelector);
    this.toalsContainer = this.el.querySelector(this.totalsSelector);
    this.unitPriceContainer = this.el.querySelector(this.unitPriceSelector);
    this.totalCostContainer = this.el.querySelector(this.totalCostSelector);
    this.priceRequestContainer = this.el.querySelector(this.priceRequestSelector);

    this.bindEvents();
    // this.tabs[0].click();
  }
}
