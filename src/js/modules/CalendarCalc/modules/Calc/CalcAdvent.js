import Calc from './Calc';

export default class CalcAdvent extends Calc {
  constructor(state) {
    super(state);
    this.baseUnitPrice = state.printRun.payload[state.size.payload.key];
    this.baseUnitPrice += state.printRun.payload[state.design.payload.key] || 0;
  }
}
