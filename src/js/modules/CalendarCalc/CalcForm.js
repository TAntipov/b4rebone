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
      this.state.push(value);
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
