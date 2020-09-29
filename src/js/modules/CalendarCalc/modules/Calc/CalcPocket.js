import Calc from './Calc';

export default class CalcPocket extends Calc {
  constructor(state) {
    super(state);
    this.baseUnitPrice = state.printRun.payload[state.size.payload.key];
    this.lamination += this.baseUnitPrice * state.lamination.payload.add;
  }
}
