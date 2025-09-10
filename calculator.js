// Calculator JavaScript - Complete DOM Manipulation Implementation

class Calculator {
  constructor() {
    // Calculator state
    this.currentInput = '0';
    this.previousInput = '';
    this.operator = null;
    this.waitingForOperand = false;
    this.shouldResetDisplay = false;
    
    // Initialize when DOM is ready
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
    // Get display element
    this.display = document.getElementById('calculatorDisplay');
    
    // Setup all button event listeners using DOM manipulation
    this.setupNumberButtons();
    this.setupOperatorButtons();
    this.setupSpecialButtons();
    this.setupKeyboardInput();
    
    // Update display initially
    this.updateDisplay();
  }

  setupNumberButtons() {
    // Number buttons (0-9)
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
      { id: 'divideBtn', operator: '/' },
      { id: 'percentBtn', operator: '%' }
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
    // Add keyboard support
    document.addEventListener('keydown', (event) => {
      event.preventDefault(); // Prevent default browser behavior
      
      const key = event.key;
      
      // Numbers
      if (key >= '0' && key <= '9') {
        this.inputNumber(key);
      }
      // Operators
      else if (key === '+') {
        this.inputOperator('+');
      }
      else if (key === '-') {
        this.inputOperator('-');
      }
      else if (key === '*' || key === 'x' || key === 'X') {
        this.inputOperator('*');
      }
      else if (key === '/' || key === '÷') {
        this.inputOperator('/');
      }
      else if (key === '%') {
        this.inputOperator('%');
      }
      // Special keys
      else if (key === '.' || key === ',') {
        this.inputDecimal();
      }
      else if (key === 'Enter' || key === '=') {
        this.calculate();
      }
      else if (key === 'Escape' || key === 'c' || key === 'C') {
        this.clear();
      }
      else if (key === 'Backspace' || key === 'Delete') {
        this.backspace();
      }
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
    if (this.shouldResetDisplay) {
      this.currentInput = '0.';
      this.shouldResetDisplay = false;
    } else if (this.waitingForOperand) {
      this.currentInput = '0.';
      this.waitingForOperand = false;
    } else if (this.currentInput.indexOf('.') === -1) {
      this.currentInput = this.currentInput + '.';
    }

    this.updateDisplay();
  }

  inputOperator(nextOperator) {
    const inputValue = parseFloat(this.currentInput);

    if (this.previousInput === '') {
      this.previousInput = inputValue;
    } else if (this.operator) {
      const currentValue = this.previousInput || 0;
      const newValue = this.performCalculation();

      this.currentInput = String(newValue);
      this.previousInput = newValue;
    }

    this.waitingForOperand = true;
    this.operator = nextOperator;
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

    if (isNaN(prev) || isNaN(current)) {
      return current;
    }

    let result;
    
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
        result = current !== 0 ? prev / current : 0;
        break;
      case '%':
        result = prev % current;
        break;
      default:
        return current;
    }

    // Handle floating point precision
    return Math.round((result + Number.EPSILON) * 100000000) / 100000000;
  }

  clear() {
    this.currentInput = '0';
    this.previousInput = '';
    this.operator = null;
    this.waitingForOperand = false;
    this.shouldResetDisplay = false;
    
    this.updateDisplay();
    this.showFeedback('cleared');
  }

  backspace() {
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = '0';
    }
    
    this.updateDisplay();
  }

  updateDisplay() {
    // Format the display value
    let displayValue = this.currentInput;
    
    // Handle very large numbers
    if (displayValue.length > 12) {
      const num = parseFloat(displayValue);
      if (num > 999999999999) {
        displayValue = num.toExponential(5);
      } else {
        displayValue = displayValue.substring(0, 12);
      }
    }
    
    // Update the display element
    if (this.display) {
      this.display.value = displayValue;
    }
  }

  showFeedback(type) {
    // Visual feedback for actions
    const display = this.display;
    if (!display) return;

    const originalBg = display.style.backgroundColor;
    
    switch (type) {
      case 'cleared':
        display.style.backgroundColor = 'rgba(255, 99, 99, 0.3)';
        break;
      case 'calculated':
        display.style.backgroundColor = 'rgba(99, 255, 99, 0.3)';
        break;
      default:
        return;
    }

    setTimeout(() => {
      display.style.backgroundColor = originalBg;
    }, 200);
  }

  // Utility methods for external access
  getCurrentValue() {
    return parseFloat(this.currentInput);
  }

  getState() {
    return {
      current: this.currentInput,
      previous: this.previousInput,
      operator: this.operator,
      waitingForOperand: this.waitingForOperand
    };
  }

  // Memory functions (bonus features)
  addToMemory(value = null) {
    const val = value !== null ? value : this.getCurrentValue();
    if (!this.memory) this.memory = 0;
    this.memory += val;
    console.log(`Added to memory: ${val}, Total memory: ${this.memory}`);
  }

  clearMemory() {
    this.memory = 0;
    console.log('Memory cleared');
  }

  recallMemory() {
    if (this.memory !== undefined) {
      this.currentInput = String(this.memory);
      this.updateDisplay();
      console.log(`Memory recalled: ${this.memory}`);
    }
  }
}

// Initialize the calculator
const calculator = new Calculator();

// Export some methods to global scope for console access
window.calculator = calculator;

// Add some global utility functions
window.clearCalculator = () => calculator.clear();
window.getCalculatorState = () => calculator.getState();