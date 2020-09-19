import BaseComponent from '../BaseComponent';
import CalcForm from './CalcForm';

export default class CalendarCalc extends BaseComponent {
  constructor(el) {
    super(el);
    this.types = require('./types.json');
    this.forms = [];
    this.formsContainerSelector = '.js-forms';
    this.tabLinkSelector = '.js-tab-link';
    this.formContainerClass = 'calc__forms__form';
    this.activeTabLinkClass = 'calc__tab__link--active';
  }

  bindEvents() {
    this.forms.forEach((form, index) => {
      form.on('change', (e) => {
        console.log(form.name, e.detail);
        if (typeof e.detail !== 'undefined') {
          const src = [];
          e.detail.forEach((item) => {
            if (typeof item.payload.imageNameChunk !== 'undefined') {
              src.push(item.payload.imageNameChunk);
            }
          });
          if (src.length) {
            const img = form.el.querySelector('.js-form-image');
            img.src = `/assets/svg/${form.name}/${src.join('_')}.svg`;
          }
        }
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

    this.setActiveForm(this.forms[0]);
  }

  setActiveForm(form) {
    if (typeof this.activeForm !== 'undefined') {
      this.activeForm.hide();
    }
    this.activeForm = form;
    this.activeForm.show();
    console.log(this.activeForm.name);
  }

  render() {
    this.template = require('!!pug-loader!./templates/CalendarCalc.pug');

    this.el.innerHTML = this.template({
      types: this.types,
    });
    super.render();
    this.mountForms();

    this.tabs = this.el.querySelectorAll(this.tabLinkSelector);
    this.bindEvents();
  }
}
