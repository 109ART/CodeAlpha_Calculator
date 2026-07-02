let expression = "";

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

// updates both the small expression line and the main result line
function updateDisplay() {
  expressionEl.textContent = expression;
  resultEl.textContent = evaluateLive();
}

// adds a number or decimal point to the expression
function appendNumber(num) {
  if (num === ".") {
    const parts = expression.split(/[\+\-\*\/%]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes(".")) return; // avoid multiple decimals
    if (lastPart === "") expression += "0";
  }
  expression += num;
  updateDisplay();
}

// adds an operator, replacing the last one if user presses operator twice
function appendOperator(op) {
  if (expression === "" && op !== "-") return;

  const lastChar = expression.slice(-1);
  if (["+", "-", "*", "/", "%"].includes(lastChar)) {
    expression = expression.slice(0, -1) + op;
  } else {
    expression += op;
  }
  updateDisplay();
}

// clears everything (AC button)
function clearAll() {
  expression = "";
  resultEl.textContent = "0";
  expressionEl.textContent = "";
}

// removes the last character (DEL button)
function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

// shows a live preview of the result while typing, without finalizing it
function evaluateLive() {
  if (expression === "") return "0";
  try {
    if (!/^[0-9+\-*/.%\s]+$/.test(expression)) return resultEl.textContent;
    let safeExp = expression.replace(/%/g, "/100");
    let value = Function('"use strict"; return (' + safeExp + ")")();
    if (value === undefined || isNaN(value) || !isFinite(value)) return resultEl.textContent;
    return roundResult(value);
  } catch (e) {
    return resultEl.textContent;
  }
}

// runs when "=" is pressed, finalizes the calculation
function calculateResult() {
  if (expression === "") return;
  try {
    let safeExp = expression.replace(/%/g, "/100");
    let value = Function('"use strict"; return (' + safeExp + ")")();
    if (value === undefined || isNaN(value) || !isFinite(value)) {
      resultEl.textContent = "Error";
      expression = "";
      return;
    }
    resultEl.textContent = roundResult(value);
    expression = String(roundResult(value));
    expressionEl.textContent = "";
  } catch (e) {
    resultEl.textContent = "Error";
    expression = "";
  }
}

// rounds off floating point results to avoid ugly long decimals
function roundResult(value) {
  return Math.round((value + Number.EPSILON) * 1e10) / 1e10;
}

// keyboard support (bonus requirement)
document.addEventListener("keydown", function (e) {
  const key = e.key;

  if (/[0-9]/.test(key)) {
    appendNumber(key);
  } else if (["+", "-", "*", "/", "%"].includes(key)) {
    appendOperator(key);
  } else if (key === ".") {
    appendNumber(".");
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculateResult();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearAll();
  }
});