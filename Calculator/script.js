const input = document.getElementById('input');
const output = document.getElementById('output');
const historyList = document.getElementById('history-list');

let variables = {
    pi: 3.1415,
    e: 2.7182
};

let history = [];

function appendToInput(value) {
    if (value === 'sin' || value === 'cos' || value === 'tan') {
        input.value += `${value}(`;
    } else {
        input.value += value;
    }
}

function clearInput() {
    input.value = '';
    output.innerText = '';
}

function calculate() {
    const expr = input.value.trim();
    if (!expr) return;

    try {
        if (expr.includes('=')) {

            const [varName, varExpr] = expr.split('=').map(s => s.trim());
            if (variables.hasOwnProperty(varName) && (varName === 'pi' || varName === 'e')) {
                throw new Error('Cannot override constants pi or e');
            }
            const varValue = evaluateExpression(varExpr);
            variables[varName] = varValue;
            output.innerText = `${varName} = ${varValue.toFixed(4)}`;
            addToHistory(`${varName} = ${varExpr}`, varValue.toFixed(4));
        } else {
 
            const result = evaluateExpression(expr);
            output.innerText = result.toFixed(4);
            addToHistory(expr, result.toFixed(4));
        }
    } catch (error) {
        output.innerText = `Error: ${error.message}`;
    }
}

function evaluateExpression(expr) {

    for (const [key, value] of Object.entries(variables)) {
        expr = expr.replace(new RegExp(key, 'g'), value);
    }


    expr = expr.replace(/\^/g, '**');


    expr = expr.replace(/√/g, 'Math.sqrt');

 
    expr = expr.replace(/sin/g, 'Math.sin');
    expr = expr.replace(/cos/g, 'Math.cos');
    expr = expr.replace(/tan/g, 'Math.tan');


    const result = eval(expr);

    if (isNaN(result)) {
        throw new Error('Invalid expression');
    }
    if (!isFinite(result)) {
        throw new Error('Division by zero or infinite result');
    }

    return result;
}

function addToHistory(expr, result) {
    history.push({ expr, result });
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerText = `${item.expr} = ${item.result}`;
        li.onclick = () => reuseHistory(index);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteHistory(index);
        };
        
        li.appendChild(deleteBtn);
        historyList.appendChild(li);
    });
}

function reuseHistory(index) {
    input.value = history[index].expr;
    calculate();
}

function deleteHistory(index) {
    history.splice(index, 1);
    renderHistory();
}