import './common';
import CalcForm from './modules/calc/CalcForm';
import '../templates/index.pug';

export default function Main() {
  const calcForm = new CalcForm();
  console.log(calcForm);
  // eslint-disable-next-line no-undef
  document.querySelector('.calc').innerHTML = calcForm.render();
}

Main();
