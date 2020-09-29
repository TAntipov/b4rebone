export default class Calc {
  constructor(state) {
    if (new.target === Calc) {
      throw new TypeError('Cannot construct Calc instances directly');
    }

    this.printRun = state.printRun.payload.multiply;
    this.baseUnitPrice = 0;
    this.lamination = 0;
    this.design = 0;
    this.advFields = 0;
    this.unitPrice = 0;
  }

  calculate() {
    this.unitPrice = this.baseUnitPrice
      + this.lamination
      + this.design
      + this.advFields;

    // Calculate
    console.log(
      `Base price: ${this.baseUnitPrice}`,
      `Lamination: ${this.lamination}`,
      `Design: ${this.design}`,
      `Adv fields: ${this.advFields}`,
    );

    return {
      unitPrice: this.unitPrice,
      totalCost: this.unitPrice * this.printRun,
    };
  }
}
