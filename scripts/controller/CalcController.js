class CalcController {
  constructor() {
    this._operation = [];
    this._displayCalcEl = document.querySelector("#display");
    this._currentDate;
    this.initialize();
    this.initButtonsEvents();
  }

  initialize() {}

  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach((event) => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    this._operation = [];
  }

  clearEntry() {
    this._operation.pop();
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }
  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  isOperator(value) {
    return ["+", "-", "*", "%", "/"].indexOf(value) > -1;
  }

  addOperation(value) {
    console.log("A", isNaN(this.getLastOperation()));

    if (isNaN(this.getLastOperation())) {
      if (this.isOperator(value)) {
        this.setLastOperation(value);
      } else if (isNaN(value)) {
        console.log(value);
      } else {
        this._operation.push(value);
      }
    } else {
      let newValue = this.getLastOperation().toString() + value.toString();

      this.setLastOperation(parseInt(newValue));
    }

    console.log(this._operation);
  }

  setError() {
    this.displayCalc = "Error";
  }
  execBtn(value) {
    switch (value) {
      case "c":
        this.clearAll();
        break;
      case "ce":
        this.clearEntry();
        break;
      case "+":
        this.addOperation("+");
        break;
      case "-":
        this.addOperation("-");
        break;
      case "/":
        this.addOperation("/");
        break;
      case "*":
        this.addOperation("*");
        break;
      case "%":
        this.addOperation("%");
        break;
      case "=":
        break;
      case ".":
        this.addOperation(".");
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.addOperation(parseInt(value));
        break;
      default:
        this.setError();
        break;
    }
  }

  initButtonsEvents() {
    let buttons = document.querySelectorAll("button");
    buttons.forEach((btn, index) => {
      this.addEventListenerAll(btn, "click drag", (e) => {
        let textBtn = btn.textContent;
        this.execBtn(textBtn);
      });
      this.addEventListenerAll(btn, "mouseover mouseup mousedown", (e) => {
        btn.style.cursor = "pointer";
      });
    });
  }

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
