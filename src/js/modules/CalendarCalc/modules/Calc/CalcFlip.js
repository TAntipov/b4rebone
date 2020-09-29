import Calc from './Calc';

export default class CalcFlip extends Calc {
  constructor(state) {
    super(state);
    const designPriceKey = `${state.size.payload.key}_${state.design.payload.key}`;
    this.lamination = state.printRun.payload[`${designPriceKey}_${state.lamination.payload.key}`] * state.design.payload.add || 0;
    this.baseUnitPrice = state.printRun.payload[designPriceKey];
  }
}
