import Calc from './Calc';

export default class CalcHouse extends Calc {
  constructor(state) {
    super(state);
    this.baseUnitPrice = state.printRun.payload[state.size.payload.key];
    this.lamination = state.size.payload[state.lamination.payload.key] || 0;

    if (typeof state.design !== 'undefined') {
      const designPriceKey = `${state.size.payload.key}_${state.design.payload.key}`;
      this.design = state.printRun.payload[designPriceKey] * this.baseUnitPrice || 0;
    }

    if (typeof state.advFields !== 'undefined') {
      this.advFields = this.baseUnitPrice * state.advFields.payload.add;
    }
  }
}
