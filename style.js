// Calculator JavaScript - Complete DOM Manipulation Implementation

class Calculator {
  constructor() {
    // Calculator state
    this.currentInput = '0';
    this.previousInput = '';
    this.operator = null;
    this.waitingForOperand = false;
    this.shouldResetDisplay = false;
    this.memory = 0;
    
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
    
    if (!this.display) {
      console.error('Calculator display element not found!');
      return;
    }
    
    // Setup all button event listeners using DOM manipulation
    this.setupNumberButtons();
    this.setupOperatorButtons();
    this.setupSpecialButtons();
    this.setupKeyboardInput();
    
    // Update display initially
    this.updateDisplay();
    
    console.log('Calculator initialized successfully');
  }

  setupNumberButtons() {
    // Number buttons (0-9)
    for (let i = 0; i <= 9; i++) {
      const button = document.getElementById(`btn${i}`);
      if (button) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          console.log(`Number ${i} clicked`);
          this.inputNumber(i.toString());
        });
      } else {
        console.warn(`Button btn${i} not found`);
      }
    }

    // Decimal button
    const decimalBtn = document.getElementById('decimalBtn');
    if (decimalBtn) {
      decimalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Decimal clicked');
        this.inputDecimal();
      });
    } else {
      console.warn('Decimal button not found');
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
        button.addEventListener('click', (e) => {
          e.preventDefault();
          console.log(`Operator ${operator} clicked`);
          this.inputOperator(operator);
        });
      } else {
        console.warn(`Operator button ${id} not found`);
      }
    });

    // Equals button
    const equalsBtn = document.getElementById('equalsBtn');
    if (equalsBtn) {
      equalsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Equals clicked');
        this.calculate();
      });
    } else {
      console.warn('Equals button not found');
    }
  }

  setupSpecialButtons() {
    // Clear button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Clear clicked');
        this.clear();
      });
    } else {
      console.warn('Clear button not found');
    }

    // Backspace button
    const backspaceBtn = document.getElementById('backspaceBtn');
    if (backspaceBtn) {
      backspaceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Backspace clicked');
        this.backspace();
      });
    } else {
      console.warn('Backspace button not found');
    }
  }

  setupKeyboardInput() {
    // Add keyboard support
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      console.log(`Key pressed: ${key}`);
      
      // Numbers
      if (key >= '0' && key <= '9') {
        event.preventDefault();
        this.inputNumber(key);
      }
      // Operators
      else if (key === '+') {
        event.preventDefault();
        this.inputOperator('+');
      }
      else if (key === '-') {
        event.preventDefault();
        this.inputOperator('-');
      }
      else if (key === '*' || key === 'x' || key === 'X') {
        event.preventDefault();
        this.inputOperator('*');
      }
      else if (key === '/' || key === '÷') {
        event.preventDefault();
        this.inputOperator('/');
      }
      else if (key === '%') {
        event.preventDefault();
        this.inputOperator('%');
      }
      // Special keys
      else if (key === '.' || key === ',') {
        event.preventDefault();
        this.inputDecimal();
      }
      else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        this.calculate();
      }
      else if (key === 'Escape' || key.toLowerCase() === 'c') {
        event.preventDefault();
        this.clear();
      }
      else if (key === 'Backspace' || key === 'Delete') {
        event.preventDefault();
        this.backspace();
      }
    });
  }

  inputNumber(num) {
    console.log(`Input number: ${num}, Current state:`, {
      currentInput: this.currentInput,
      waitingForOperand: this.waitingForOperand,
      shouldResetDisplay: this.shouldResetDisplay
    });
    
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

    console.log(`After input number: ${this.currentInput}`);
    this.updateDisplay();
  }

  inputDecimal() {
    console.log('Input decimal, Current state:', {
      currentInput: this.currentInput,
      waitingForOperand: this.waitingForOperand,
      shouldResetDisplay: this.shouldResetDisplay
    });
    
    if (this.shouldResetDisplay) {
      this.currentInput = '0.';
      this.shouldResetDisplay = false;
    } else if (this.waitingForOperand) {
      this.currentInput = '0.';
      this.waitingForOperand = false;
    } else if (this.currentInput.indexOf('.') === -1) {
      this.currentInput = this.currentInput + '.';
    }

    console.log(`After input decimal: ${this.currentInput}`);
    this.updateDisplay();
  }

  inputOperator(nextOperator) {
    console.log(`Input operator: ${nextOperator}, Current state:`, {
      currentInput: this.currentInput,
      previousInput: this.previousInput,
      operator: this.operator,
      waitingForOperand: this.waitingForOperand
    });
    
    const inputValue = parseFloat(this.currentInput);

    if (this.previousInput === '') {
      this.previousInput = inputValue;
    } else if (this.operator && !this.waitingForOperand) {
      const newValue = this.performCalculation();
      this.currentInput = String(newValue);
      this.previousInput = newValue;
    }

    this.waitingForOperand = true;
    this.operator = nextOperator;
    
    console.log(`After input operator:`, {
      currentInput: this.currentInput,
      previousInput: this.previousInput,
      operator: this.operator,
      waitingForOperand: this.waitingForOperand
    });
    
    this.updateDisplay();
  }

  calculate() {
    console.log('Calculate, Current state:', {
      currentInput: this.currentInput,
      previousInput: this.previousInput,
      operator: this.operator,
      waitingForOperand: this.waitingForOperand
    });
    
    if (this.operator && !this.waitingForOperand) {
      const newValue = this.performCalculation();
      
      console.log(`Calculation result: ${newValue}`);
      
      this.currentInput = String(newValue);
      this.previousInput = '';
      this.operator = null;
      this.waitingForOperand = true;
      this.shouldResetDisplay = true;
      
      this.updateDisplay();
      this.showFeedback('calculated');
    }
  }

  performCalculation() {
    const prev = parseFloat(this.previousInput);
    const current = parseFloat(this.currentInput);

    console.log(`Performing calculation: ${prev} ${this.operator} ${current}`);

    if (isNaN(prev) || isNaN(current)) {
      console.warn('Invalid numbers for calculation');
      return current || 0;
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
        if (current === 0) {
          console.warn('Division by zero');
          result = 0;
        } else {
          result = prev / current;
        }
        break;
      case '%':
        result = prev % current;
        break;
      default:
        console.warn(`Unknown operator: ${this.operator}`);
        return current;
    }

    // Handle floating point precision
    const roundedResult = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
    console.log(`Calculation result: ${result} -> ${roundedResult}`);
    return roundedResult;
  }

  clear() {
    console.log('Clear calculator');
    
    this.currentInput = '0';
    this.previousInput = '';
    this.operator = null;
    this.waitingForOperand = false;
    this.shouldResetDisplay = false;
    
    this.updateDisplay();
    this.showFeedback('cleared');
  }

  backspace() {
    console.log(`Backspace, current input: ${this.currentInput}`);
    
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = '0';
    }
    
    console.log(`After backspace: ${this.currentInput}`);
    this.updateDisplay();
  }

  updateDisplay() {
    if (!this.display) {
      console.error('Display element not available');
      return;
    }
    
    // Format the display value
    let displayValue = this.currentInput;
    
    // Handle very large numbers
    if (displayValue.length > 12) {
      const num = parseFloat(displayValue);
      if (Math.abs(num) > 999999999999) {
        displayValue = num.toExponential(5);
      } else {
        displayValue = displayValue.substring(0, 12);
      }
    }
    
    // Update the display element
    this.display.value = displayValue;
    console.log(`Display updated to: ${displayValue}`);
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
      waitingForOperand: this.waitingForOperand,
      shouldResetDisplay: this.shouldResetDisplay
    };
  }

  // Memory functions (bonus features)
  addToMemory(value = null) {
    const val = value !== null ? value : this.getCurrentValue();
    this.memory += val;
    console.log(`Added to memory: ${val}, Total memory: ${this.memory}`);
  }

  clearMemory() {
    this.memory = 0;
    console.log('Memory cleared');
  }

  recallMemory() {
    this.currentInput = String(this.memory);
    this.updateDisplay();
    console.log(`Memory recalled: ${this.memory}`);
  }
}

// Initialize the calculator when the script loads
let calculator;

// Ensure calculator is initialized after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    calculator = new Calculator();
  });
} else {
  calculator = new Calculator();
}

// Export some methods to global scope for console access and debugging
window.calculator = calculator;
window.clearCalculator = () => calculator && calculator.clear();
window.getCalculatorState = () => calculator && calculator.getState();

console.log('Calculator script loaded successfully');