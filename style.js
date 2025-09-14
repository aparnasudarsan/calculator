class Calculator {
  constructor() {
    this.currentInput = '0';
    this.previousInput = '';
    this.operator = null;
    this.waitingForOperand = false;
    this.shouldResetDisplay = false;
    this.justCalculated = false;
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
    if (!this.display) {
      console.error('Calculator display not found!');
      return;
    }

    this.setupNumberButtons();
    this.setupOperatorButtons();
    this.setupSpecialButtons();
    this.setupKeyboardInput();
    this.updateDisplay();
  }

  setupNumberButtons() {
    // Number buttons 0-9
    for (let i = 0; i <= 9; i++) {
      const button = document.getElementById(`btn${i}`);
      if (button) {
        button.addEventListener('click', () => this.inputNumber(i.toString()));
      }
    }
    
    // Decimal button
    const decimalBtn = document.getElementById('decimalBtn');
    if (decimalBtn) {
      decimalBtn.addEventListener('click', () => this.inputDecimal());
    }
  }

  setupOperatorButtons() {
    const operators = [
      { id: 'addBtn', operator: '+' },
      { id: 'subtractBtn', operator: '-' },
      { id: 'multiplyBtn', operator: '*' },
      { id: 'divideBtn', operator: '/' }
    ];

    operators.forEach(({ id, operator }) => {
      const button = document.getElementById(id);
      if (button) {
        button.addEventListener('click', () => this.inputOperator(operator));
      }
    });

    // Equals button
    const equalsBtn = document.getElementById('equalsBtn');
    if (equalsBtn) {
      equalsBtn.addEventListener('click', () => this.calculate());
    }

    // Percentage button
    const percentBtn = document.getElementById('percentBtn');
    if (percentBtn) {
      percentBtn.addEventListener('click', () => this.inputPercentage());
    }
  }

  setupSpecialButtons() {
    // Clear button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clear());
    }

    // Backspace button
    const backspaceBtn = document.getElementById('backspaceBtn');
    if (backspaceBtn) {
      backspaceBtn.addEventListener('click', () => this.backspace());
    }
  }

  setupKeyboardInput() {
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      
      // Prevent default behavior for calculator keys
      if (['Enter', '=', 'Escape'].includes(key) || 
          (key >= '0' && key <= '9') || 
          ['+', '-', '*', '/', '%', '.', 'Backspace'].includes(key)) {
        event.preventDefault();
      }

      // Handle key inputs
      if (key >= '0' && key <= '9') {
        this.inputNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        this.inputOperator(key);
      } else if (key === '%') {
        this.inputPercentage();
      } else if (key === '.' || key === ',') {
        this.inputDecimal();
      } else if (key === 'Enter' || key === '=') {
        this.calculate();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        this.clear();
      } else if (key === 'Backspace') {
        this.backspace();
      }
    });
  }

  inputNumber(num) {
    // If we just calculated, start fresh
    if (this.justCalculated) {
      this.currentInput = '0';
      this.previousInput = '';
      this.operator = null;
      this.justCalculated = false;
    }

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
    // If we just calculated, start fresh
    if (this.justCalculated) {
      this.currentInput = '0';
      this.previousInput = '';
      this.operator = null;
      this.justCalculated = false;
    }

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

    // If we have a previous input and operator, and we're not waiting for an operand
    if (this.previousInput !== '' && this.operator && !this.waitingForOperand) {
      const newValue = this.performCalculation();
      this.currentInput = this.formatResult(newValue);
      this.previousInput = newValue;
    } else {
      this.previousInput = inputValue;
    }

    this.operator = nextOperator;
    this.waitingForOperand = true;
    this.justCalculated = false;
    this.updateDisplay();
  }

  inputPercentage() {
    const current = parseFloat(this.currentInput);

    if (this.operator && this.previousInput !== '' && !this.waitingForOperand) {
      // Context-aware percentage calculation
      const prev = parseFloat(this.previousInput);
      let percentValue;

      switch (this.operator) {
        case '+':
        case '-':
          // For addition/subtraction: X + Y% = X + (X * Y / 100)
          percentValue = (prev * current) / 100;
          break;
        case '*':
        case '/':
          // For multiplication/division: convert current to decimal percentage
          percentValue = current / 100;
          break;
        default:
          percentValue = current / 100;
      }

      this.currentInput = this.formatResult(percentValue);
    } else {
      // Simple percentage conversion: Y% = Y / 100
      const percentValue = current / 100;
      this.currentInput = this.formatResult(percentValue);
      this.shouldResetDisplay = true;
    }

    this.updateDisplay();
  }

  calculate() {
    if (this.operator && this.previousInput !== '' && !this.waitingForOperand) {
      const newValue = this.performCalculation();
      this.currentInput = this.formatResult(newValue);
      this.previousInput = '';
      this.operator = null;
      this.waitingForOperand = false;
      this.shouldResetDisplay = true;
      this.justCalculated = true;
      this.updateDisplay();
    }
  }

  performCalculation() {
    const prev = parseFloat(this.previousInput);
    const current = parseFloat(this.currentInput);
    let result = current;

    if (isNaN(prev) || isNaN(current)) {
      return current;
    }

    switch (this.operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          alert('Cannot divide by zero');
          return prev;
        }
        result = prev / current;
        break;
      default:
        return current;
    }

    return result;
  }

  formatResult(result) {
    // Handle infinity and NaN
    if (!isFinite(result)) {
      return '0';
    }

    // Round to avoid floating point precision issues
    const rounded = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
    
    // Convert to string and handle very large/small numbers
    let resultStr = rounded.toString();
    
    // If the result is too long, use scientific notation
    if (resultStr.length > 12 && Math.abs(rounded) >= 1000000000000) {
      resultStr = rounded.toExponential(5);
    }
    
    return resultStr;
  }

  clear() {
    this.currentInput = '0';
    this.previousInput = '';
    this.operator = null;
    this.waitingForOperand = false;
    this.shouldResetDisplay = false;
    this.justCalculated = false;
    this.updateDisplay();
  }

  backspace() {
    // Don't allow backspace if we just calculated
    if (this.justCalculated) {
      return;
    }

    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = '0';
    }
    
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.display) {
      let displayValue = this.currentInput;
      
      // Add commas for large numbers (optional formatting)
      if (!displayValue.includes('.') && !displayValue.includes('e') && displayValue.length > 3) {
        const num = parseFloat(displayValue);
        if (!isNaN(num) && Math.abs(num) >= 1000) {
          displayValue = num.toLocaleString();
        }
      }
      
      this.display.value = displayValue;
    }
  }
}

// Initialize calculator when DOM is ready
let calculator;

function initializeCalculator() {
  calculator = new Calculator();
}

// Initialize immediately if DOM is already loaded, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCalculator);
} else {
  initializeCalculator();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Calculator;
}