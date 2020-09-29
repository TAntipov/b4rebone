import Calc from './Calc';

export default class CalcSpring extends Calc {
  constructor(state) {
    super(state);
    this.baseUnitPrice = state.printRun.payload[state.size.payload.key];
    this.lamination = (typeof state.lamination.payload.key !== 'undefined') ? state.size.payload[state.lamination.payload.key] : 0;
    this.design = (typeof state.design.payload.key !== 'undefined') ? state.printRun.payload[`${state.size.payload.key}_${state.design.payload.key}`] * state.size.payload.price : 0;
    this.advFields = this.baseUnitPrice * state.advFields.payload.add;
  }
}
