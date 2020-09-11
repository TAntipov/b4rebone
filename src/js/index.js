import './common';
import CalcForm from './modules/calendarCalc/CalcForm';
import '../templates/index.pug';

export default function Main() {
  const calcForm = new CalcForm('.calc');
  calcForm.render();
  calcForm.on('change', (e) => {
    for (const pair of e.detail.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    }
  });
}

Main();
