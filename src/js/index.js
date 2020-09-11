import './common';
import CalcForm from './modules/CalendarCalc/CalcForm';
import '../templates/index.pug';

export default function Main() {
  const calcForm = new CalcForm('.calc');
  calcForm.render();
  calcForm.on('change', (e) => {
    console.log(e.detail);
  });
}

Main();
