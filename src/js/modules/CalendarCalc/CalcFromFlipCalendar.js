import CalcForm from './CalcForm';

export default class CalcFormFlipCalendar extends CalcForm {
  bindEvents() {
    this.on('change', (e) => {
      e.stopPropagation();
      this.setState();

      this.el.querySelectorAll('input,select')
        .forEach((item) => {
          item.classList.remove('disabled');
        });

      const laminationEl = this.el.querySelector('select[name=lamination]');
      laminationEl.options[3].disabled = true;
      laminationEl.options[4].disabled = true;

      const designEl = this.el.querySelector('select[name=design]');

      if (this.state.design.payload.key !== 'thirteen') {
        if (laminationEl.options[3].selected || laminationEl.options[4].selected) {
          laminationEl.options[0].selected = 'selected';
        }
      }

      if (this.state.size.payload.key === 'a3'
        || this.state.size.payload.key === 'a4') {
        if (this.state.design.payload.key === 'thirteen') {
          laminationEl.options[3].disabled = false;
          laminationEl.options[4].disabled = false;
        }
      }

      if (this.state.size.payload.key === 'a2') {
        laminationEl.options[0].selected = true;
        laminationEl.classList.add('disabled');
      }

      if (this.state.size.payload.key === 'a1') {
        laminationEl.options[0].selected = 'selected';
        laminationEl.classList.add('disabled');
        designEl.options[1].selected = true;
        designEl.classList.add('disabled');
      }
      this.setState();
    });
  }
}
