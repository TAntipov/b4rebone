import BaseComponent from '../BaseComponent';
import CalcForm from './CalcForm';
import CalcFactory from './modules/CalcFactory';
import Calc from './modules/Calc/Calc';
import CalcFormFlipCalendar from './CalcFromFlipCalendar';
import CalcFormAdventCalendar from './CalcFromAdventCalendar';

export default class CalendarCalc extends BaseComponent {
  constructor(el) {
    super(el);
    this.types = require('./types.json');
    this.forms = [];

    this.unitPrice = 0;
    this.totalCost = 0;

    this.unitPriceSelector = '.js-unit-price';
    this.totalCostSelector = '.js-total-cost';
    this.formsContainerSelector = '.js-forms';
    this.tabLinkSelector = '.js-tab-link';
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
      this.unitPriceContainer.innerHTML = this.numberFormatter.format(result.unitPrice);
      this.totalCostContainer.innerHTML = this.numberFormatter.format(result.totalCost);

      let text = this.activeForm.stateToString();
      text += '-----------------------------\n';
      text += `Цена за штуку: ${this.numberFormatter.format(result.unitPrice)} Р.\n`;
      text += `Общая стоимость: ${this.numberFormatter.format(result.totalCost)} Р.\n`;

      const messageFormTextField = document.querySelector('.js-calendar-calc input[name=text]');
      messageFormTextField.value = text;

      console.clear();
      console.log(text);

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

    // document.querySelector('.js-send-calc-form')
    //   .addEventListener('click', (e) => {
    //     e.preventDefault();
    //     const form = e.target.closest('form');
    //     const errors = [];
    //
    //     // Check name
    //     form.name.classList.remove('calc__input--error');
    //     if (!form.name.value.match(/[\S]{2,}/)) {
    //       form.name.classList.add('calc__input--error');
    //       errors.push('name');
    //     }
    //
    //     // Check phone
    //     form.phone.classList.remove('calc__input--error');
    //     if (!form.phone.value.match(/\+7\([0-9]{2,3}\) [0-9]{3} [0-9]{2,4}/g)) {
    //       form.phone.classList.add('calc__input--error');
    //       errors.push('phone');
    //     }
    //
    //     if (errors.length) {
    //       console.log(errors);
    //       return false;
    //     }
    //
    //     form.submit();
    //   });
  }

  mountForms() {
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
    this.mountForms();
    this.tabs = this.el.querySelectorAll(this.tabLinkSelector);
    this.unitPriceContainer = this.el.querySelector(this.unitPriceSelector);
    this.totalCostContainer = this.el.querySelector(this.totalCostSelector);
    this.bindEvents();
    this.tabs[0].click();
  }
}
