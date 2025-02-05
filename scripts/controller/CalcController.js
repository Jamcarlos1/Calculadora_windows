class CalcController {
  constructor() {
    this._lastOperator = "";
    this._lastNumber = "";

    this._operation = [];
    this._displayCalcEl = document.querySelector("#display");
    this.initialize();
  }

  initialize() {
    this.setLastNumberToDisplay();
    this.pasteToClipboard();
    this.initButtonsEvents();
    this.initKeyboard();
  }

  pasteToClipboard() {
    document.addEventListener("paste", (e) => {
      let text = e.clipboardData.getData("Text");
      this.displayCalc = parseFloat(text);
    });
  }

  copyFromClipboard() {
    let input = document.createElement("input");

    input.value = this.displayCalc;

    document.body.appendChild(input);

    input.select();

    document.execCommand("Copy");
    input.remove();
  }

  initKeyboard() {
    document.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "Escape":
          this.clearAll();
          break;

        case "Backspace":
          this.clearEntry();
          break;

        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
          this.addOperation(e.key);
          break;

        case "Enter":
        case "=":
          this.calc();
          break;

        case ".":
        case ",":
          this.addDot();
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
          this.addOperation(parseInt(e.key));
          break;

        case "c":
          if (e.ctrlKey) this.copyFromClipboard();
          break;
      }
    });
  }
  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach((event) => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    this._operation = [];
    this._lastNumber = "";
    this._lastOperator = "";

    this.setLastNumberToDisplay();
  }

  clearEntry() {
    this._operation.pop();
    this.setLastNumberToDisplay();
  }

  clearLast() {
    if (isNaN(this._operation[this._operation.length - 1])) {
      this._operation.pop();
    } else {
      this._operation[this._operation.length - 1] = this._operation[
        this._operation.length - 1
      ]
        .toString()
        .slice(0, -1);
    }
    this.setLastNumberToDisplay();
  }
  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }
  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  isOperator(value) {
    return ["+", "-", "*", "%", "/", "√", "x²", "¹/x", "±"].indexOf(value) > -1;
  }

  pushOperation(value) {
    this._operation.push(value);
    if (this._operation.length > 3) {
      this.calc();
      console.log(this._operation);
    }
  }

  getResult() {
    return eval(this._operation.join(""));
  }

  calc() {
    let last = "";

    this._lastOperator = this.getLastItem();

    if (this._operation.length < 3) {
      let firstItem = this._operation[0];

      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if (this._operation.length > 3) {
      last = this._operation.pop();

      this._lastNumber = this.getResult();
    } else if (this._operation.length == 3) {
      this._lastNumber = this.getLastItem(false);
    }

    let result = this.getResult();

    if (last == "%") {
      result /= 100;

      this._operation = [result];
    } else {
      this._operation = [result];

      if (last) this._operation.push(last);
    }

    this.setLastNumberToDisplay();
  }

  getLastItem(isOperator = true) {
    let lastItem;

    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (this.isOperator(this._operation[i]) == isOperator) {
        lastItem = this._operation[i];

        break;
      }
    }

    if (!lastItem) {
      lastItem = isOperator ? this._lastOperator : this._lastNumber;
    }

    return lastItem;
  }
  setLastNumberToDisplay() {
    let lastNumber;

    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (!this.isOperator(this._operation[i])) {
        lastNumber = this._operation[i];

        break;
      }
    }

    if (!lastNumber) lastNumber = 0;

    this.displayCalc = lastNumber;
  }
  addOperation(value) {
    if (isNaN(this.getLastOperation())) {
      if (this.isOperator(value)) {
        this.setLastOperation(value);
      } else if (isNaN(value)) {
        console.log("outra coisa", value);
      } else {
        this.pushOperation(value);
        this.setLastNumberToDisplay();
      }
    } else {
      if (this.isOperator(value)) {
        this.pushOperation(value);
      } else {
        let newValue = this.getLastOperation().toString() + value.toString();

        this.setLastOperation(newValue);

        this.setLastNumberToDisplay();
      }
    }
  }

  setError() {
    this.displayCalc = "Error";
  }

  addDot() {
    let lastOperation = this.getLastOperation();

    if (
      typeof lastOperation === "string" &&
      lastOperation.split("").indexOf(".") > -1
    )
      return;

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation("0.");
    } else {
      this.setLastOperation(lastOperation.toString() + ".");
    }

    this.setLastNumberToDisplay();
  }

  toggleMinusOperator() {
    const lastOperator = this._operation[this._operation.length - 1].toString();

    if (this.isOperator(lastOperator)) {
      this._operation.push("-");
    } else {
      if (lastOperator.startsWith("-")) {
        this._operation[this._operation.length - 1] = lastOperator.slice(1);
      } else {
        this._operation[this._operation.length - 1] = `-${lastOperator}`;
      }
    }

    this.setLastNumberToDisplay();
  }

  performOperation(value = null) {
    const lastIndex = this._operation.length - 1;

    {
      if (this._operation.length < 2) {
        switch (value) {
          case "√":
            this._operation = [Math.sqrt(this._operation[0]).toString()];
            break;
          case "x²":
            this._operation = [Math.pow(this._operation[0], 2).toString()];
            break;
          case "¹/x":
            this._operation = [(1 / this._operation[0]).toString()];
            break;
          default:
            this._operation = [
              eval(
                `${this._operation}${this._lastOperator}${this._lastNumber}`
              ).toString(),
            ];
        }
      } else if (this._operation.length < 3) {
        switch (value) {
          case "%":
          case "x²":
            this._operation.push(Math.pow(this._operation[0], 2).toString());
            break;
          case "√":
            this._operation.push(Math.sqrt(this._operation[0]).toString());
            break;
          case "¹/x":
            this._operation.push((1 / this._operation[0]).toString());
            break;
          default:
            this._operation.push(this._operation[0]);
        }
      } else {
        switch (value) {
          case "%":
            this._operation[lastIndex] = (
              this._operation[lastIndex] *
              (this._operation[0] / 100)
            ).toString();
            break;
          case "√":
            this._operation[lastIndex] = Math.sqrt(
              this._operation[lastIndex]
            ).toString();
            break;
          case "x²":
            this._operation[lastIndex] = Math.pow(
              this._operation[lastIndex],
              2
            ).toString();
            break;
          case "¹/x":
            this._operation[lastIndex] = (
              1 / this._operation[lastIndex]
            ).toString();
            break;
          default:
            this._operation.push(this._operation[0]);
        }
      }

      this.calculateResult();
    }
    this.setLastNumberToDisplay();
  }

  calculateResult() {
    this._lastOperator = this._operation[this._operation.length - 2];
    this._lastNumber = this._operation[this._operation.length - 1];
    this._operation = [eval(this._operation.join("")).toString()];
  }
  execBtn(value) {
    switch (value) {
      case "C":
        this.clearAll();
        break;
      case "CE":
        this.clearEntry();
        break;
      case "←":
      case "Backspace":
        this.clearLast();
        break;
      case "+":
        this.addOperation("+");
        break;
      case "-":
        this.addOperation("-");
        break;
      case "÷":
        this.addOperation("/");
        break;
      case "X":
        this.addOperation("*");
        break;
      case "=":
        this.calc();
        break;
      case ".":
      case ",":
        this.addDot(".");
        break;
      case "±":
        this.toggleMinusOperator("±");
        break;
      case "%":
        this.performOperation("%");
        break;
      case "¹/x":
        this.performOperation("¹/x");
        break;
      case "x²":
        this.performOperation("x²");
        break;
      case "√":
        this.performOperation("√");
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

  set displayCalc(value) {
    if (value.toString().length > 10) {
      this.setError();
      return;
    }

    this._displayCalcEl.innerHTML = value;
  }
}
