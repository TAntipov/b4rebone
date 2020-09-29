import CalcSpring from './Calc/CalcSpring';
import CalcHouse from './Calc/CalcHouse';
import CalcPocket from './Calc/CalcPocket';
import CalcFlip from './Calc/CalcFlip';
import CalcAdvent from './Calc/CalcAdvent';

export default class CalcFactory {
  static createCalc(form) {
    switch (form.name) {
      case 'threeSpringsCalendar':
        return new CalcSpring(form.state);
      case 'oneSpringsCalendar':
        return new CalcSpring(form.state);
      case 'flipHouseCalendar':
        return new CalcHouse(form.state);
      case 'selfMadeHouseCalendar':
        return new CalcHouse(form.state);
      case 'pocketCalendar':
        return new CalcPocket(form.state);
      case 'flipCalendar':
        return new CalcFlip(form.state);
      case 'adventCalendar':
        return new CalcAdvent(form.state);
      default:
        return false;
    }
  }
};
