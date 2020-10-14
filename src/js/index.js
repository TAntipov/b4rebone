import '../templates/index.pug';
import './common';
import CalendarCalc from './modules/CalendarCalc/CalendarCalc';

export default function Main() {

  const container = document.querySelector('.calc-container');
  if (container !== null) {
    const Calc = new CalendarCalc('.calc-container');
    Calc.render();
  }
}

Main();
