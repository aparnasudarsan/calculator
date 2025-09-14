class Calculator {
  constructor() {
    this.currentInput = '0';
    this.previousInput = '';
    this.operator = null;
    this.waitingForOperand = false;
    this.shouldResetDisplay = false;
    this.memory = 0;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupElements());
    } else {
      this.setupElements();
    }
  }

  setupElements() {
    this.display = document.getElementById('calculatorDisplay');
    if (!this.display) return;

    this.setupNumberButtons();
    this.setupOperatorButtons();
    this.setupSpecialButtons();
    this.setupKeyboardInput();
    this.updateDisplay();
  }

  setupNumberButtons() {
    for (let i = 0; i <= 9; i++) {
      const button = document.getElementById(`btn${i}`);
      if (button) button.addEventListener('click', () => this.inputNumber(i.toString()));
    }
    const decimalBtn = document.getElementById('decimalBtn');
    if (decimalBtn) decimalBtn.addEventListener('click', () => this.inputDecimal());
  }

  setupOperatorButtons() {
    const operators = [
      { id: 'addBtn', operator: '+' },
      { id: 'subtractBtn', operator: '-' },
      { id: 'multiplyBtn', operator: '*' },
      { id: 'divideBtn', operator: '/' },
      { id: 'percentBtn', operator: '%' }
    ];
    operators.forEach(({ id, operator }) => {
      const button = document.getElementById(id);
      if (button) button.addEventListener('click', () => this.inputOperator(operator));
    });
    document.getElementById('equalsBtn')?.addEventListener('click', () => this.calculate());
  }

  setupSpecialButtons() {
    document.getElementById('clearBtn')?.addEventListener('click', () => this.clear());
    document.getElementById('backspaceBtn')?.addEventListener('click', () => this.backspace());
  }

  setupKeyboardInput() {
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      if (key >= '0' && key <= '9') this.inputNumber(key);
      else if (['+', '-', '*', '/', '%'].includes(key)) this.inputOperator(key);
      else if (key === '.' || key === ',') this.inputDecimal();
      else if (key === 'Enter' || key === '=') this.calculate();
      else if (key === 'Escape' || key.toLowerCase() === 'c') this.clear();
      else if (key === 'Backspace') this.backspace();
    });
  }

  inputNumber(num) {
    if (this.shouldResetDisplay) {
      this.currentInput = '0';
      this.shouldResetDisplay = false;
    }
    if (this.waitingForOperand) {
      this.currentInput = num;
      this.waitingForOperand = false;
    } else {
      this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
    }
    this.updateDisplay();
  }

  inputDecimal() {
    if (this.shouldResetDisplay || this.waitingForOperand) {
      this.currentInput = '0.';
      this.shouldResetDisplay = false;
      this.waitingForOperand = false;
    } else if (!this.currentInput.includes('.')) {
      this.currentInput += '.';
    }
    this.updateDisplay();
  }

  inputOperator(nextOperator) {
    const inputValue = parseFloat(this.currentInput);
    if (this.previousInput === '') this.previousInput = inputValue;
    else if (this.operator && !this.waitingForOperand) {
      const newValue = this.performCalculation();
      this.currentInput = String(newValue);
      this.previousInput = newValue;
    }
    this.operator = nextOperator;
    this.waitingForOperand = true;
    this.updateDisplay();
  }

  calculate() {
    if (this.operator && !this.waitingForOperand) {
      const newValue = this.performCalculation();
      this.currentInput = String(newValue);
      this.previousInput = '';
      this.operator = null;
      this.waitingForOperand = true;
      this.shouldResetDisplay = true;
      this.updateDisplay();
    }
  }

  performCalculation() {
    const prev = parseFloat(this.previousInput);
    const current = parseFloat(this.currentInput);
    let result = current;
    switch (this.operator) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/': result = current === 0 ? 0 : prev / current; break;
      case '%': result = prev % current; break;
    }
    return Math.round((result + Number.EPSILON) * 100000000) / 100000000;
  }

  clear() {
    this.currentInput = '0';
    this.previousInput = '';
    this.operator = null;
    this.waitingForOperand = false;
    this.shouldResetDisplay = false;
    this.updateDisplay();
  }

  backspace() {
    this.currentInput = this.currentInput.length > 1 ? this.currentInput.slice(0, -1) : '0';
    this.updateDisplay();
  }

  updateDisplay() {
    this.display.value = this.currentInput.length > 12
      ? parseFloat(this.currentInput).toExponential(5)
      : this.currentInput;
  }
}

let calculator;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { calculator = new Calculator(); });
} else {
  calculator = new Calculator();
}
