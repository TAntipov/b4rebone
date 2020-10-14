import BaseComponent from '../BaseComponent';

export default class CalcForm extends BaseComponent {
  constructor(el, options = {}) {
    super(el);
    Object.assign(this, options);
  }

  stateToString() {
    let text = `${this.label}\n---------------------\n`;
    Object.keys(this.state)
      .forEach((key, index) => {
        let { value } = this.state[key];
        const field = this.fields[index];
        if (field.inputType === 'select') {
          value = field.options[value].label;
        }
        text += `${this.state[key].label}: ${value}\n`;
      });
    return text;
  }

  setState() {
    this.state = [];
    this.image = null;
    this.descr = [];
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

      // State descr
      if (typeof value.payload.descr !== 'undefined') {
        this.descr = this.descr.concat(value.payload.descr);
      }

      if (field.name === 'advFields') {
        const advKey = `descr_${this.state.size.payload.key}`;
        // console.log(`descr_${this.state.size.payload.key}`);
        if (typeof value.payload[advKey] !== 'undefined') {
          this.descr = this.descr.concat(value.payload[advKey]);
        }
      }

      this.state[field.name] = value;
      i += 1;
    }));

    if (imgSrc.length > 0) {
      this.image = `${imgSrc.join('_')}.svg`;
    }
  }

  setDescription() {
    this.descriptionTemplate = require('!!pug-loader!./templates/CalcFormDescription.pug');
    this.descriptionEl = this.el.querySelector('.js-card-description');
    this.descriptionEl.innerHTML = this.descriptionTemplate({
      description: this.descr,
    });
  }

  bindEvents() {
    this.on('change', (e) => {
      e.stopPropagation();
      this.setState();
      this.setDescription();
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
    this.setDescription();
  }
}
