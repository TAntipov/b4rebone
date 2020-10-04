import CalcForm from './CalcForm';

export default class CalcFormAdventCalendar extends CalcForm {
  bindEvents() {
    this.on('change', (e) => {
      e.stopPropagation();
      this.setState();

      const printRunEl = this.el.querySelector('select[name=printRun]');
      const printRunOptions = printRunEl.querySelectorAll('option');

      printRunOptions.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.disabled = false;
      });

      if (this.state.size.payload.key === 'cube'
        || this.state.size.payload.key === 'star') {
        printRunOptions[0].disabled = true;
        printRunOptions[1].disabled = true;
        printRunOptions[2].disabled = true;

        if (this.state.printRun.payload.multiply < 150) {
          printRunOptions[3].selected = 'selected';
        }
      }

      this.setState();
    });
  }
}
