import BaseComponent from '../BaseComponent';

export default class CalcForm extends BaseComponent {
  constructor(el, options = {}) {
    super(el);
    Object.assign(this, options);
  }

  setState() {
    this.state = [];
    this.image = null;
    const formData = new FormData(this.el.querySelector('form'));
    const imgSrc = [];
    let i = 0;

    formData.forEach(((data) => {
      const field = this.fields[i];
      const value = {
        label: field.label,
        name: field.name,
        value: data,
        payload: field.payload,
      };

      // Selected options
      if (field.inputType === 'select') {
        value.payload = field.options[data].payload;
      }

      // Sate image
      if (typeof value.payload.imageNameChunk !== 'undefined') {
        imgSrc.push(value.payload.imageNameChunk);
      }
      //this.state.push(value);
      this.state[field.name] = value;
      i += 1;
    }));

    if (imgSrc.length > 0) {
      this.image = `${imgSrc.join('_')}.svg`;
    }
  }

  bindEvents() {
    this.on('change', (e) => {
      e.stopPropagation();
      this.setState();

      if (this.name === 'flipCalendar') {
        this.el.querySelectorAll('input,select')
          .forEach((item) => {
            item.classList.remove('disabled');
          });

        const laminationEl = this.el.querySelector('select[name=lamination]');
        const designEl = this.el.querySelector('select[name=design]');
        if (this.state.size.payload.key === 'a2') {
          laminationEl.getElementsByTagName('option')[0].selected = 'selected';
          laminationEl.classList.add('disabled');
        }

        if (this.state.size.payload.key === 'a1') {
          laminationEl.getElementsByTagName('option')[0].selected = 'selected';
          laminationEl.classList.add('disabled');
          designEl.getElementsByTagName('option')[0].selected = 'selected';
          designEl.classList.add('disabled');
        }
      }
    });
  }

  render() {
    this.template = require('!!pug-loader!./templates/CalcForm.pug');
    this.el.innerHTML = this.template({
      form: this,
    });
    this.bindEvents();
    super.render();
    this.setState();
  }
}
