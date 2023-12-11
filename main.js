// переменные: 
//состояние калькулятора
let calculateState = "ok";
//переменная для памяти
let memoryStoredValue = 0;
//первый операнд
let firstOperand = '';
firstOperand = '';
//теукущий оператор
let currentOperator = '';
// состояние ожидания ввода операнда
let operandExpected = false;
//состояние оператор введен
let operandInputed = false;
// опеределяем массив кнокпок
let buttons = Array.from(document.getElementsByTagName('button'));
//
buttons.forEach(btn => btn.addEventListener('click', e => processButton(e.target.id)));
// нажата ли цифра?
function isNumber(value) {
    return value.length == 1 && value >= "0" && value <= "9";
}
// главная функция
function processButton(value) {
    if (calculateState == 'err') {
        if (isNumber(value)) {
            clear();
        } else if (value != "ca") {
            return;
        }
    }
    let box = document.getElementById('box');
    let boxValue = box.innerText;
    if (isNumber(value)) {
        if (boxValue == '0' || boxValue == '-0') {
            boxValue = boxValue.slice(0, -1)
        }

        //проверка на ввод операнда
        if (operandExpected) {
            boxValue = '';
            operandExpected = false;
            operandInputed = true;
        }
        boxValue += value; // в бокс записываем цифру
    }
    if (['+', '-', '*', '/'].includes(value)) {
        if (firstOperand != '' && operandInputed) {
            const operand = cleanNumberStr(boxValue); //
            [boxValue, calculateState] = calculate(firstOperand, operand, currentOperator);
            operandInputed = false;
        }
        //записываем из бокса в первый операнд
        firstOperand = cleanNumberStr(boxValue);
        operandExpected = true;
        currentOperator = value;
    }

    let operand = '';
    // основной выбор действий
    switch (value) {
        case '=':
            //проверка - есть ли все данные
            if (operandExpected || firstOperand == '' || currentOperator == '') {
                return;
            }
            // создаем операнд для введенного значения
            let secondOperand = cleanNumberStr(boxValue);
            console.log(firstOperand, secondOperand, currentOperator);
            [boxValue, calculateState] = calculate(firstOperand, secondOperand, currentOperator);
            // меняем состояние 
            operandInputed = false;
            operandExpected = true;
            firstOperand = '';
            currentOperator = '';
            break;
        case '.':
            if (boxValue.indexOf('.') >= 0) {
                return;
            }
            boxValue += '.'
            break;
        case 'changeSign':
            if (boxValue.startsWith('-')) {
                boxValue = boxValue.slice(1);
            } else {
                boxValue = '-' + boxValue;
            }

            break;
        case 'sqrt':
            operand = cleanNumberStr(boxValue);
            if (operand.startsWith('-')) {
                calculateState = 'err';
            } else {
                boxValue = Math.sqrt(parseFloat(operand)).toString();
            }
            break;
        case '1divx':
            operand = cleanNumberStr(boxValue);
            if (operand == '0') {
                calculateState = 'err';
            } else {
                boxValue = (1.0 / parseFloat(operand)).toString();
            }
            break;
        case 'pow':
            operand = cleanNumberStr(boxValue);
            boxValue = Math.pow(parseFloat(operand), 2);
            break;
        case '%':
            operand = cleanNumberStr(boxValue);
            boxValue = (parseFloat(operand) / 100.0).toString();
            break;
        case 'mr':
            boxValue = memoryStoredValue.toString();
            if (operandExpected) {
                operandInputed = true;
                operandExpected = false;
            }
            break;
        case 'm+':
            operand = parseFloat(cleanNumberStr(boxValue));
            memoryStoredValue += operand;
            break;
        case 'm-':
            operand = parseFloat(cleanNumberStr(boxValue));
            memoryStoredValue -= operand;
            break;
        case 'mc':
            memoryStoredValue = 0;
            break;
        case 'remove':
            let removed = boxValue.slice(0, -1);
            boxValue = removed.length > 0 ? removed : '0';
            break;
        case 'ce':
            boxValue = '0';
            break;
        case 'ca':
            clear();
            return;
    }
    if (calculateState == 'err') {
        boxValue = 'Error';
    }
    // выводим инфу в бокс
    box.innerText = boxValue;
}


// функция удаления лишних нулей
function cleanNumberStr(numStr) {
    if (numStr == '0' || numStr == '-0' || numStr == '0.') {
        return '0';
    }
    return numStr;
}
//функция для арифметических операций
function calculate(firstOperand, secondOperand, operator) {
    let num1 = parseFloat(firstOperand);
    let num2 = parseFloat(secondOperand);
    let total = 0;
    switch (operator) {
        case '+':
            total = num1 + num2;
            break;
        case '-':
            total = num1 - num2;
            break;
        case '*':
            total = num1 * num2;
            break;
        case '/':
            if (num2 == 0) { return ['?', 'err'] }
            total = num1 / num2;
            break;
        case '-':
            total = num1 - num2;
            break;
        default:
            total = '?'
            break;
    }
    return [total.toString(), 'ok']
}
//функция очистки
function clear() {
    calculateState = 'ok';
    firstOperand = '';
    currentOperator = '';
    document.getElementById('box').innerText = '0';
    operandInputed = false;
    operandExpected = false;

}
