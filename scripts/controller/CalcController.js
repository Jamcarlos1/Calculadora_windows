class CalcController {
  constructor() {
    this._displayCalcEl = document.querySelector("#display");
    this._currentDate;
    this.initialize();
  }

  initialize() {}

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(valor) {
    this._displayCalcEl.innerHTML = valor;
  }

  get currentDate() {
    return this._currentDate;
  }

  set currentDate(valor) {
    this._currentDate = valor;
  }
}
