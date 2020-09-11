import './common';
import CalcForm from './modules/calendarCalc/CalcForm';
import '../templates/index.pug';

export default function Main() {
  const calcForm = new CalcForm('.calc');
  calcForm.render();
  calcForm.on('change', (e) => {
    console.log(e.detail);
  });
}

Main();
