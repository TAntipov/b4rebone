import Component from '../../../Component';

export default class CheckoutForm extends Component {

  static STATE_INPUT = 'input';
  static STATE_SUCCESS = 'success';

  render() {
    this.template = require('!!pug-loader!./CheckoutForm.pug');
    this.el.innerHTML = this.template({});
    super.render();
    this.bindEvents();
  }

  setState(state) {
    switch (state) {
      case CheckoutForm.STATE_INPUT :
        this.fieldsContainer.style.display = 'block';
        this.successMessageContainer.style.display = 'none';
        break;
      case CheckoutForm.STATE_SUCCESS:
        this.fieldsContainer.style.display = 'none';
        this.successMessageContainer.style.display = 'block';
        break;
      default:
        return false;
        break;
    }
    return false;
  }

  validate() {
    const errors = [];
    // Check name
    // this.form.name.classList.remove('calc__input--error');
    // if (!this.form.name.value.match(/[\S]{2,}/)) {
    //   this.form.name.classList.add('calc__input--error');
    //   errors.push('name');
    // }
    //
    // // Check email
    // this.form.email.classList.remove('calc__input--error');
    // if (!this.form.email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    //   this.form.email.classList.add('calc__input--error');
    //   errors.push('email');
    // }
    //
    // // Check phone +7(985) 764 9919
    // this.form.phone.classList.remove('calc__input--error');
    // if (!this.form.phone.value.match(/\+7\([0-9]{2,3}\) [0-9]{3} [0-9]{2,4}/g)) {
    //   this.form.phone.classList.add('calc__input--error');
    //   errors.push('phone');
    // }
    if (errors.length) {
      return errors;
    }
    return true;
  }

  bindEvents() {
    this.form = this.el.querySelector('form');
    this.fieldsContainer = this.el.querySelector('.js-checkout-fields');
    this.successMessageContainer = this.el.querySelector('.js-checkout-success');
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate() === true) {
        $.post(`/client_account/feedback.json`, {
          feedback: {
            name: this.form.name.value,
            phone: this.form.phone.value,
            from: this.form.email.value,
            subject: 'Калькулятор календарей',
            content: this.form.text.value
          }
        }).done((data) => {
          console.log(data);
          console.log(this.form.text.value);
          if (data.status === 'ok') {
            this.setState(CheckoutForm.STATE_SUCCESS);
          }
        });

        // fetch(this.form.action, {
        //   method: 'post',
        //   body: new URLSearchParams(
        //     {
        //       'feedback[name]': this.form.name.value,
        //       'feedback[phone]': this.form.phone.value,
        //       'feedback[from]': this.form.email.value,
        //       'feedback[subject]': 'Калькулятор календарей',
        //       'feedback[content]': this.form.text.value,
        //     },
        //   ).toString(),
        // })
        //   .then((response) => response.json())
        //   .then((data) => {
        //     console.log(data);
        //     if (data.status === 'ok') {
        //       this.setState(CheckoutForm.STATE_SUCCESS);
        //     }
        //   });
      }
    });

    this.el.querySelector('.js-checkout-ok-button')
      .addEventListener('click', (e) => {
        e.preventDefault();
        this.setState(CheckoutForm.STATE_INPUT);
      });
  }
}
