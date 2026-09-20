const screen = document.querySelector('#screen');
const history = document.querySelector('#history');
const keys = document.querySelector('.keypad');
const themeToggle = document.querySelector('#themeToggle');

let expression = '';
let justCalculated = false;

const operators = ['+', '-', '*', '/'];
const friendlyExpression = (value) => value.replaceAll('*', '×').replaceAll('/', '÷');

function formatNumber(value) {
  if (!Number.isFinite(value)) return 'Error';
  return Number(value.toPrecision(12)).toLocaleString('en-US', { maximumFractionDigits: 10 });
}

function evaluate(value) {
  if (!value || operators.includes(value.at(-1))) return null;
  // Input is constrained to digits, decimal points, and the four calculator operators.
  const result = Function(`"use strict"; return (${value})`)();
  return formatNumber(result);
}

function updateScreen() {
  const result = evaluate(expression);
  screen.value = expression ? (result ?? friendlyExpression(expression)) : '0';
  screen.textContent = screen.value;
  history.textContent = expression ? (result ? `${friendlyExpression(expression)} =` : 'Calculating…') : 'Ready';
}

function addValue(value) {
  const last = expression.at(-1);
  if (justCalculated && !operators.includes(value)) expression = '';
  justCalculated = false;

  if (operators.includes(value)) {
    if (!expression && value !== '-') return;
    expression = operators.includes(last) ? `${expression.slice(0, -1)}${value}` : `${expression}${value}`;
  } else if (value === '.') {
    const currentNumber = expression.split(/[+\-*/]/).at(-1);
    if (!currentNumber.includes('.')) expression += currentNumber ? '.' : '0.';
  } else {
    expression += value;
  }
  updateScreen();
}

function calculate() {
  const result = evaluate(expression);
  if (result === null) return;
  history.textContent = `${friendlyExpression(expression)} =`;
  screen.value = result;
  screen.textContent = result;
  expression = result === 'Error' ? '' : result.replaceAll(',', '');
  justCalculated = true;
}

function performAction(action) {
  if (action === 'clear') {
    expression = '';
    justCalculated = false;
    updateScreen();
  }
  if (action === 'delete') {
    expression = expression.slice(0, -1);
    justCalculated = false;
    updateScreen();
  }
  if (action === 'equals') calculate();
}

function flashKey(selector) {
  const key = document.querySelector(selector);
  if (!key) return;
  key.classList.add('pressed');
  setTimeout(() => key.classList.remove('pressed'), 120);
}

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.value) addValue(button.dataset.value);
  if (button.dataset.action) performAction(button.dataset.action);
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9.]$/.test(event.key) || operators.includes(event.key)) {
    event.preventDefault();
    addValue(event.key);
    flashKey(`[data-value="${event.key}"]`);
  } else if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculate();
    flashKey('[data-action="equals"]');
  } else if (event.key === 'Backspace') {
    event.preventDefault();
    performAction('delete');
    flashKey('[data-action="delete"]');
  } else if (event.key === 'Escape' || event.key.toLowerCase() === 'c') {
    event.preventDefault();
    performAction('clear');
    flashKey('[data-action="clear"]');
  }
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.textContent = document.body.classList.contains('light') ? '☾' : '☼';
});

updateScreen();