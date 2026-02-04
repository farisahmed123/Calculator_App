class Calculator {
    constructor(historyElement, currentElement) {
        this.historyElement = historyElement;
        this.currentElement = currentElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
            case 'add':
                computation = prev + current;
                break;
            case '-':
            case 'subtract':
                computation = prev - current;
                break;
            case '×':
            case 'multiply':
                computation = prev * current;
                break;
            case '÷':
            case 'divide':
                if (current === 0) {
                    alert("Can't divide by zero!");
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            let opSymbol = this.operation;
            if (opSymbol === 'add') opSymbol = '+';
            if (opSymbol === 'subtract') opSymbol = '-';
            if (opSymbol === 'multiply') opSymbol = '×';
            if (opSymbol === 'divide') opSymbol = '÷';

            this.historyElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${opSymbol}`;
        } else {
            this.historyElement.innerText = '';
        }
    }

    percent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = current / 100;
    }
}

const historyDisplay = document.getElementById('history-display');
const currentDisplay = document.getElementById('current-display');
const calculator = new Calculator(historyDisplay, currentDisplay);

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]');

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
        animateButton(button);
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;

        if (action === 'clear') {
            calculator.clear();
        } else if (action === 'delete') {
            calculator.delete();
        } else if (action === 'equal') {
            calculator.compute();
        } else if (action === 'percent') {
            calculator.percent();
        } else {
            calculator.chooseOperation(action);
        }
        calculator.updateDisplay();
        animateButton(button);
    });
});

function animateButton(button) {
    button.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(0.95)' },
        { transform: 'scale(1)' }
    ], {
        duration: 100
    });
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    let key = e.key;
    if (key >= '0' && key <= '9') {
        const btn = document.querySelector(`[data-number="${key}"]`);
        if (btn) btn.click();
    }
    if (key === '.') {
        const btn = document.querySelector(`[data-number="."]`);
        if (btn) btn.click();
    }
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        let action = '';
        if (key === '+') action = 'add';
        if (key === '-') action = 'subtract';
        if (key === '*') action = 'multiply';
        if (key === '/') action = 'divide';

        const btn = document.querySelector(`[data-action="${action}"]`);
        if (btn) btn.click();
    }
    if (key === 'Enter' || key === '=') {
        e.preventDefault();
        const btn = document.querySelector(`[data-action="equal"]`);
        if (btn) btn.click();
    }
    if (key === 'Backspace') {
        const btn = document.querySelector(`[data-action="delete"]`);
        if (btn) btn.click();
    }
    if (key === 'Escape') {
        const btn = document.querySelector(`[data-action="clear"]`);
        if (btn) btn.click();
    }
});

// --- Smart Connectivity & AI Features ---

const smartInput = document.getElementById('smart-input');
const aiBtn = document.getElementById('ai-btn');

// Modal Elements
const modalHTML = `
<div id="api-modal" class="modal">
    <div class="modal-content">
        <h3 class="modal-title">✨ Enable AI Power</h3>
        <p style="color:#94a3b8; margin-bottom: 1rem; font-size: 0.9rem;">
            Enter your Google Gemini API Key to enable advanced reasoning.
            (It's free!)
        </p>
        <input type="password" id="api-key-input" class="modal-input" placeholder="Paste Gemini API Key here...">
        <div class="modal-btns">
            <button id="save-key" class="btn-modal btn-save">Save & Enable</button>
            <button id="cancel-key" class="btn-modal btn-cancel">Cancel</button>
        </div>
    </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

const modal = document.getElementById('api-modal');
const keyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key');
const cancelKeyBtn = document.getElementById('cancel-key');

let apiKey = localStorage.getItem('gemini_api_key');

// Toggle AI Modal
aiBtn.addEventListener('click', () => {
    if (smartInput.value.trim() !== "") {
        // If there is text, try to solve it first
        processSmartCommand(smartInput.value);
    } else {
        // If empty, show settings
        modal.style.display = 'flex';
        keyInput.value = apiKey || '';
    }
});

saveKeyBtn.addEventListener('click', () => {
    const key = keyInput.value.trim();
    if (key) {
        apiKey = key;
        localStorage.setItem('gemini_api_key', apiKey);
        alert('API Key Saved! AI is ready.');
        modal.style.display = 'none';
    }
});

cancelKeyBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Smart Input Handler
smartInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        processSmartCommand(smartInput.value);
    }
});

async function processSmartCommand(query) {
    if (!query) return;

    // 1. Try Local Math Parsing first (Free & Instant)
    const lowerQ = query.toLowerCase();

    // Simple regex for "sqrt of X"
    const sqrtMatch = lowerQ.match(/sqrt\s+(?:of\s+)?(\d+(\.\d+)?)/);
    if (sqrtMatch) {
        const num = parseFloat(sqrtMatch[1]);
        calculator.currentOperand = Math.sqrt(num);
        calculator.updateDisplay();
        smartInput.value = '';
        return;
    }

    // Direct math evaluation (careful usage)
    try {
        // Safe evaluation of basic math expressions allowed in JS
        // e.g. "50 * 3 + 2" or "Math.sin(30)"
        // We replace some natural language tokens
        let mathQ = lowerQ
            .replace(/x/g, '*')
            .replace(/plus/g, '+')
            .replace(/minus/g, '-')
            .replace(/times/g, '*')
            .replace(/divided by/g, '/')
            .replace(/pi/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/\^/g, '**');

        // Check if it looks like a math expression
        if (/^[\d\s\+\-\*\/\.\(\)MathPIEsincoan\*]+$/.test(mathQ) || !isNaN(parseFloat(mathQ))) {
            // Basic cleaner
            const result = eval(mathQ); // Use with valid input only
            calculator.currentOperand = result;
            calculator.updateDisplay();
            return;
        }
    } catch (e) {
        // Validation failed, proceed to AI
    }

    // 2. If local fail, use AI (if key exists)
    if (apiKey) {
        aiBtn.innerHTML = '⏳';
        try {
            const result = await askGemini(query);
            if (!isNaN(parseFloat(result))) {
                calculator.currentOperand = parseFloat(result);
                calculator.updateDisplay();
            } else {
                alert("AI Says: " + result);
            }
        } catch (error) {
            alert('AI Error: ' + error.message);
        }
        aiBtn.innerHTML = '✨';
    } else {
        // Prompt for key if simple parsing failed and no key
        modal.style.display = 'flex';
    }
}

async function askGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `You are a calculator assistant. Return ONLY the numeric answer for this math problem. If it is not a math problem, answer briefly in one sentence. Query: ${prompt}`
                }]
            }]
        })
    });

    if (!response.ok) throw new Error('Failed to fetch from Gemini');

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return text.trim();
}

