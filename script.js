class Calculator {
    constructor() {
        this.currentInput = '0';
        this.history = '';
        this.memory = 0;
        this.lastOperation = null;
        this.waitingForSecondOperand = false;
        this.conversionRates = {
            length: {
                m: 1,
                km: 1000,
                cm: 0.01,
                mm: 0.001,
                inch: 0.0254,
                ft: 0.3048,
                yd: 0.9144,
                mile: 1609.34
            },
            weight: {
                kg: 1,
                g: 0.001,
                mg: 0.000001,
                lb: 0.453592,
                oz: 0.0283495
            },
            currency: {
                USD: 1,
                EUR: 0.85,
                GBP: 0.73,
                JPY: 110.42,
                CAD: 1.25,
                AUD: 1.36,
                INR: 74.38
            }
        };
        
        // Load history from localStorage or initialize empty array
        const savedHistory = localStorage.getItem('calculatorHistory');
        this.historyList = savedHistory ? JSON.parse(savedHistory) : [];
        
        // Load theme preference from localStorage or use default
        const savedTheme = localStorage.getItem('calculatorTheme');
        this.isDarkTheme = savedTheme ? savedTheme === 'dark' : true;
        
        this.activeConversion = 'length';
        
        // Use default currency rates
        console.log('Calculator initialized with default rates');
        
        this.initializeUI();
        this.setupTabs();
        this.setupConversionPanel();
        this.setupSpecialCalculations();
        this.attachEventListeners();
    }
    
    initializeUI() {
        this.displayElement = document.querySelector('.current-input');
        this.historyElement = document.querySelector('.history');
        this.buttons = document.querySelectorAll('.btn');
        this.themeToggle = document.getElementById('themeToggle');
        this.historyBtn = document.getElementById('historyBtn');
        
        // Apply saved theme
        if (!this.isDarkTheme) {
            document.body.classList.add('light-theme');
            this.themeToggle.textContent = '☀️';
        }
        
        // Show history count badge if there's history
        if (this.historyList.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'history-badge';
            badge.textContent = this.historyList.length;
            this.historyBtn.appendChild(badge);
            
            // Add badge style
            const style = document.createElement('style');
            style.textContent = `
                .history-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background-color: var(--equals-color);
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupTabs() {
        // Main calculator tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        const panels = document.querySelectorAll('.panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                panels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                button.classList.add('active');
                const panelId = `${button.dataset.tab}-panel`;
                document.getElementById(panelId).classList.add('active');
                
                // Simple tab change without extra effects
            });
        });
    }
    
    setupConversionPanel() {
        // Conversion tabs
        const conversionTabs = document.querySelectorAll('.conversion-tab');
        conversionTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                conversionTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.activeConversion = tab.dataset.conversion;
                this.updateConversionUnits();
            });
        });
        
        // Initialize conversion units
        this.updateConversionUnits();
        
        // Convert button
        document.getElementById('convertBtn').addEventListener('click', () => {
            this.performConversion();
        });
    }
    
    updateConversionUnits() {
        const fromUnitSelect = document.getElementById('fromUnit');
        const toUnitSelect = document.getElementById('toUnit');
        
        // Clear existing options
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';
        
        // Add new options based on active conversion type
        for (const unit in this.conversionRates[this.activeConversion]) {
            const fromOption = document.createElement('option');
            fromOption.value = unit;
            fromOption.textContent = unit;
            fromUnitSelect.appendChild(fromOption);
            
            const toOption = document.createElement('option');
            toOption.value = unit;
            toOption.textContent = unit;
            toUnitSelect.appendChild(toOption);
        }
        
        // Default to different units if possible
        if (toUnitSelect.options.length > 1) {
            toUnitSelect.selectedIndex = 1;
        }
    }
    
    performConversion() {
        const value = parseFloat(document.getElementById('conversionInput').value);
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;
        
        if (isNaN(value)) {
            alert('Please enter a valid number');
            return;
        }
        
        const result = this.convert(value, fromUnit, toUnit, this.activeConversion);
        document.getElementById('conversionResult').value = result;
        
        // Update calculator display
        this.currentInput = result.toString();
        this.history = `${value} ${fromUnit} = ${result} ${toUnit}`;
        this.updateDisplay();
    }
    
    setupSpecialCalculations() {
        // Special calculation tabs
        const specialTabs = document.querySelectorAll('.special-tab');
        const specialForms = document.querySelectorAll('.special-form');
        
        specialTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                specialTabs.forEach(t => t.classList.remove('active'));
                specialForms.forEach(form => form.classList.remove('active'));
                
                tab.classList.add('active');
                const formId = `${tab.dataset.special}-form`;
                document.getElementById(formId).classList.add('active');
            });
        });
        
        // BMI Calculator
        document.getElementById('bmiCalculateBtn').addEventListener('click', () => {
            this.calculateBMI();
        });
        
        // Interest Calculator
        document.getElementById('interestType').addEventListener('change', () => {
            const isCompound = document.getElementById('interestType').value === 'compound';
            document.getElementById('compoundFrequencyGroup').style.display = isCompound ? 'block' : 'none';
        });
        
        document.getElementById('interestCalculateBtn').addEventListener('click', () => {
            this.calculateInterest();
        });
        
        // Percentage Calculator
        document.getElementById('percentageType').addEventListener('change', () => {
            const type = document.getElementById('percentageType').value;
            if (type === 'difference') {
                document.getElementById('percentValueGroup').style.display = 'none';
                document.getElementById('baseValueLabel').textContent = 'First Value:';
                document.getElementById('secondValueGroup').style.display = 'block';
            } else {
                document.getElementById('percentValueGroup').style.display = 'block';
                document.getElementById('baseValueLabel').textContent = 'Value:';
                document.getElementById('secondValueGroup').style.display = 'none';
            }
        });
        
        document.getElementById('percentageCalculateBtn').addEventListener('click', () => {
            this.calculatePercentage();
        });
        
        // Date Calculator
        document.getElementById('dateType').addEventListener('change', () => {
            const type = document.getElementById('dateType').value;
            if (type === 'difference') {
                document.getElementById('secondDateGroup').style.display = 'block';
                document.getElementById('daysGroup').style.display = 'none';
            } else {
                document.getElementById('secondDateGroup').style.display = 'none';
                document.getElementById('daysGroup').style.display = 'block';
            }
        });
        
        document.getElementById('dateCalculateBtn').addEventListener('click', () => {
            this.calculateDate();
        });
        
        // Initialize date inputs with current date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('firstDate').value = today;
        document.getElementById('secondDate').value = today;
    }
    
    attachEventListeners() {
        // Number buttons
        document.querySelectorAll('.btn.number').forEach(button => {
            button.addEventListener('click', () => {
                if (button.textContent === '.') {
                    this.inputDecimal();
                } else {
                    this.inputDigit(button.textContent);
                }
            });
        });
        
        // Operator buttons
        document.querySelectorAll('.btn.operator').forEach(button => {
            button.addEventListener('click', () => {
                this.handleOperator(button.dataset.action);
            });
        });
        
        // Function buttons
        document.querySelectorAll('.btn.function').forEach(button => {
            button.addEventListener('click', () => {
                this.handleFunction(button.dataset.action);
            });
        });
        
        // Memory buttons
        document.querySelectorAll('.btn.memory').forEach(button => {
            button.addEventListener('click', () => {
                this.handleMemory(button.dataset.action);
            });
        });
        
        // Clear buttons
        document.querySelectorAll('.btn.clear').forEach(button => {
            button.addEventListener('click', () => {
                if (button.dataset.action === 'clear') {
                    this.clear();
                } else if (button.dataset.action === 'backspace') {
                    this.backspace();
                }
            });
        });
        
        // Equals buttons
        document.querySelectorAll('.btn.equals').forEach(button => {
            button.addEventListener('click', () => {
                this.calculate();
            });
        });
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // History button
        this.historyBtn.addEventListener('click', () => {
            this.showHistory();
        });
        
        // Keyboard support
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardInput(event);
        });
    }
    
    updateDisplay() {
        // Add animation class
        this.displayElement.classList.add('animate');
        
        // Update display text
        this.displayElement.textContent = this.currentInput;
        this.historyElement.textContent = this.history;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.displayElement.classList.remove('animate');
        }, 300);
    }
    
    inputDigit(digit) {
        if (this.waitingForSecondOperand) {
            this.currentInput = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? digit : this.currentInput + digit;
        }
        
        // Play soft beep sound for number input
        if (typeof createBeepSound === 'function') {
            createBeepSound(600, 100, 'sine');
        }
        
        this.updateDisplay();
    }
    
    inputDecimal() {
        if (this.waitingForSecondOperand) {
            this.currentInput = '0.';
            this.waitingForSecondOperand = false;
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
        
        // Play decimal point sound
        if (typeof createBeepSound === 'function') {
            createBeepSound(400, 150, 'triangle');
        }
        
        this.updateDisplay();
    }
    
    handleOperator(operator) {
        const inputValue = parseFloat(this.currentInput);
        
        if (this.lastOperation && !this.waitingForSecondOperand) {
            this.calculate();
        }
        
        this.history = `${this.currentInput} ${this.getOperatorSymbol(operator)}`;
        this.lastOperation = { operator, value: inputValue };
        this.waitingForSecondOperand = true;
        this.updateDisplay();
    }
    
    getOperatorSymbol(operator) {
        const symbols = {
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷',
            'power': '^'
        };
        return symbols[operator] || operator;
    }
    
    calculate() {
        if (!this.lastOperation) return;
        
        const inputValue = parseFloat(this.currentInput);
        const { operator, value } = this.lastOperation;
        let result;
        
        switch (operator) {
            case 'add':
                result = value + inputValue;
                break;
            case 'subtract':
                result = value - inputValue;
                break;
            case 'multiply':
                result = value * inputValue;
                break;
            case 'divide':
                if (inputValue === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                result = value / inputValue;
                break;
            case 'power':
                result = Math.pow(value, inputValue);
                break;
        }
        
        // Format the result to avoid extremely long decimals
        if (result.toString().includes('.') && result.toString().split('.')[1].length > 10) {
            result = parseFloat(result.toFixed(10));
        }
        
        const calculation = `${value} ${this.getOperatorSymbol(operator)} ${inputValue} = ${result}`;
        this.historyList.push(calculation);
        
        // Save history to localStorage
        this.saveHistory();
        
        // Update history badge if it exists
        const existingBadge = document.querySelector('.history-badge');
        if (existingBadge) {
            existingBadge.textContent = this.historyList.length;
        } else if (this.historyBtn) {
            const badge = document.createElement('span');
            badge.className = 'history-badge';
            badge.textContent = this.historyList.length;
            this.historyBtn.appendChild(badge);
        }
        
        this.currentInput = result.toString();
        this.history = '';
        this.lastOperation = null;
        this.updateDisplay();
        
        return result; // Return the result for the anime effects
    }
    
    saveHistory() {
        // Keep only the last 20 calculations
        if (this.historyList.length > 20) {
            this.historyList = this.historyList.slice(-20);
        }
        
        // Save to localStorage
        localStorage.setItem('calculatorHistory', JSON.stringify(this.historyList));
    }
    
    handleFunction(func) {
        const inputValue = parseFloat(this.currentInput);
        let result;
        
        switch (func) {
            case 'square':
                result = inputValue * inputValue;
                this.history = `sqr(${inputValue})`;
                break;
            case 'cube':
                result = inputValue * inputValue * inputValue;
                this.history = `cube(${inputValue})`;
                break;
            case 'sqrt':
                if (inputValue < 0) {
                    this.showError('Invalid input for square root');
                    return;
                }
                result = Math.sqrt(inputValue);
                this.history = `√(${inputValue})`;
                break;
            case 'sin':
                result = Math.sin(this.toRadians(inputValue));
                this.history = `sin(${inputValue})`;
                break;
            case 'cos':
                result = Math.cos(this.toRadians(inputValue));
                this.history = `cos(${inputValue})`;
                break;
            case 'tan':
                result = Math.tan(this.toRadians(inputValue));
                this.history = `tan(${inputValue})`;
                break;
            case 'log':
                if (inputValue <= 0) {
                    this.showError('Invalid input for logarithm');
                    return;
                }
                result = Math.log10(inputValue);
                this.history = `log(${inputValue})`;
                break;
            case 'ln':
                if (inputValue <= 0) {
                    this.showError('Invalid input for natural logarithm');
                    return;
                }
                result = Math.log(inputValue);
                this.history = `ln(${inputValue})`;
                break;
            case 'factorial':
                if (inputValue < 0 || !Number.isInteger(inputValue)) {
                    this.showError('Invalid input for factorial');
                    return;
                }
                result = this.factorial(inputValue);
                this.history = `${inputValue}!`;
                break;
            case 'power':
                this.handleOperator('power');
                return;
            case 'pi':
                result = Math.PI;
                this.history = 'π';
                break;
            case 'e':
                result = Math.E;
                this.history = 'e';
                break;
        }
        
        this.historyList.push(`${this.history} = ${result}`);
        this.saveHistory();
        this.currentInput = result.toString();
        this.updateDisplay();
    }
    
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    handleMemory(action) {
        const inputValue = parseFloat(this.currentInput);
        
        switch (action) {
            case 'memory-clear':
                this.memory = 0;
                break;
            case 'memory-recall':
                this.currentInput = this.memory.toString();
                break;
            case 'memory-add':
                this.memory += inputValue;
                break;
            case 'memory-subtract':
                this.memory -= inputValue;
                break;
        }
        
        this.updateDisplay();
    }
    
    clear() {
        this.currentInput = '0';
        this.history = '';
        this.lastOperation = null;
        
        // Play clear sound
        if (typeof createBeepSound === 'function') {
            createBeepSound(300, 200, 'square');
        }
        
        this.updateDisplay();
    }
    
    backspace() {
        if (this.currentInput.length === 1) {
            this.currentInput = '0';
        } else {
            this.currentInput = this.currentInput.slice(0, -1);
        }
        this.updateDisplay();
    }
    
    showError(message) {
        this.currentInput = 'Error';
        this.history = message;
        
        // Play error sound
        if (typeof playSound === 'function') {
            playSound('error');
        }
        
        this.updateDisplay();
        
        setTimeout(() => {
            this.clear();
        }, 2000);
    }
    
    calculateBMI() {
        const height = parseFloat(document.getElementById('bmiHeight').value) / 100; // convert to meters
        const weight = parseFloat(document.getElementById('bmiWeight').value);
        const resultDiv = document.getElementById('bmiResult');
        
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            resultDiv.innerHTML = 'Please enter valid height and weight';
            return;
        }
        
        const bmi = weight / (height * height);
        let category = '';
        
        if (bmi < 18.5) {
            category = 'Underweight';
        } else if (bmi < 25) {
            category = 'Normal weight';
        } else if (bmi < 30) {
            category = 'Overweight';
        } else {
            category = 'Obese';
        }
        
        resultDiv.innerHTML = `
            <p>Your BMI: <strong>${bmi.toFixed(2)}</strong></p>
            <p>Category: <strong>${category}</strong></p>
        `;
        
        // Set the result to calculator display
        this.currentInput = bmi.toFixed(2);
        this.history = 'BMI Calculation';
        this.updateDisplay();
    }
    
    calculateInterest() {
        const principal = parseFloat(document.getElementById('interestPrincipal').value);
        const rate = parseFloat(document.getElementById('interestRate').value) / 100; // Convert to decimal
        const time = parseFloat(document.getElementById('interestTime').value);
        const resultDiv = document.getElementById('interestResult');
        
        if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate <= 0 || time <= 0) {
            resultDiv.innerHTML = 'Please enter valid values';
            return;
        }
        
        let interest, amount;
        const type = document.getElementById('interestType').value;
        
        if (type === 'simple') {
            interest = principal * rate * time;
            amount = principal + interest;
            
            resultDiv.innerHTML = `
                <p>Principal: <strong>${principal.toFixed(2)}</strong></p>
                <p>Interest: <strong>${interest.toFixed(2)}</strong></p>
                <p>Total Amount: <strong>${amount.toFixed(2)}</strong></p>
            `;
        } else {
            const frequency = parseInt(document.getElementById('compoundFrequency').value);
            amount = principal * Math.pow(1 + (rate / frequency), frequency * time);
            interest = amount - principal;
            
            resultDiv.innerHTML = `
                <p>Principal: <strong>${principal.toFixed(2)}</strong></p>
                <p>Interest: <strong>${interest.toFixed(2)}</strong></p>
                <p>Total Amount: <strong>${amount.toFixed(2)}</strong></p>
            `;
        }
        
        // Set the result to calculator display
        this.currentInput = amount.toFixed(2);
        this.history = 'Interest Calculation';
        this.updateDisplay();
    }
    
    calculatePercentage() {
        const type = document.getElementById('percentageType').value;
        const resultDiv = document.getElementById('percentageResult');
        let result;
        
        if (type === 'difference') {
            const value1 = parseFloat(document.getElementById('baseValue').value);
            const value2 = parseFloat(document.getElementById('secondValue').value);
            
            if (isNaN(value1) || isNaN(value2) || value1 === 0) {
                resultDiv.innerHTML = 'Please enter valid values';
                return;
            }
            
            const difference = Math.abs(value1 - value2);
            const percentageDiff = (difference / Math.abs(value1)) * 100;
            
            resultDiv.innerHTML = `
                <p>Absolute Difference: <strong>${difference.toFixed(2)}</strong></p>
                <p>Percentage Difference: <strong>${percentageDiff.toFixed(2)}%</strong></p>
            `;
            
            result = percentageDiff;
        } else {
            const percentage = parseFloat(document.getElementById('percentValue').value);
            const value = parseFloat(document.getElementById('baseValue').value);
            
            if (isNaN(percentage) || isNaN(value)) {
                resultDiv.innerHTML = 'Please enter valid values';
                return;
            }
            
            switch (type) {
                case 'percent':
                    result = (percentage / 100) * value;
                    resultDiv.innerHTML = `
                        <p>${percentage}% of ${value} = <strong>${result.toFixed(2)}</strong></p>
                    `;
                    break;
                case 'increase':
                    result = value * (1 + percentage / 100);
                    resultDiv.innerHTML = `
                        <p>${value} increased by ${percentage}% = <strong>${result.toFixed(2)}</strong></p>
                        <p>Increase amount: <strong>${(result - value).toFixed(2)}</strong></p>
                    `;
                    break;
                case 'decrease':
                    result = value * (1 - percentage / 100);
                    resultDiv.innerHTML = `
                        <p>${value} decreased by ${percentage}% = <strong>${result.toFixed(2)}</strong></p>
                        <p>Decrease amount: <strong>${(value - result).toFixed(2)}</strong></p>
                    `;
                    break;
            }
        }
        
        // Set the result to calculator display
        this.currentInput = result.toFixed(2);
        this.history = 'Percentage Calculation';
        this.updateDisplay();
    }
    
    calculateDate() {
        const type = document.getElementById('dateType').value;
        const resultDiv = document.getElementById('dateResult');
        
        if (type === 'difference') {
            const date1 = new Date(document.getElementById('firstDate').value);
            const date2 = new Date(document.getElementById('secondDate').value);
            
            if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
                resultDiv.innerHTML = 'Please enter valid dates';
                return;
            }
            
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            resultDiv.innerHTML = `
                <p>Days between dates: <strong>${diffDays}</strong></p>
            `;
            
            // Set the result to calculator display
            this.currentInput = diffDays.toString();
            this.history = 'Date Difference';
            this.updateDisplay();
        } else {
            const date = new Date(document.getElementById('firstDate').value);
            const days = parseInt(document.getElementById('daysValue').value);
            
            if (isNaN(date.getTime()) || isNaN(days)) {
                resultDiv.innerHTML = 'Please enter valid date and days';
                return;
            }
            
            if (type === 'add') {
                date.setDate(date.getDate() + days);
            } else {
                date.setDate(date.getDate() - days);
            }
            
            const resultDate = date.toISOString().split('T')[0];
            
            resultDiv.innerHTML = `
                <p>Result Date: <strong>${resultDate}</strong></p>
            `;
        }
    }
    
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('light-theme');
        this.themeToggle.textContent = this.isDarkTheme ? '🌙' : '☀️';
        
        // Save theme preference to localStorage
        localStorage.setItem('calculatorTheme', this.isDarkTheme ? 'dark' : 'light');
    }
    
    // This method is no longer used
    handleConversionTypeChange() {
        // Removed since we're using the tab-based UI now
    }
    
    // This method is no longer used
    showConversionUI(type) {
        // Removed since we're using the built-in conversion panel now
    }
    
    fetchCurrencyRates() {
        // Just use the default rates
        console.log('Using default currency rates');
    }
    
    showNotification(message) {
        // Simple console log instead of DOM manipulation
        console.log('Notification:', message);
        // We could add a real notification system later if needed
    }
    
    convert(value, fromUnit, toUnit, type) {
        // Convert to base unit first, then to target unit
        const baseValue = value * this.conversionRates[type][fromUnit];
        const result = baseValue / this.conversionRates[type][toUnit];
        return parseFloat(result.toFixed(6));
    }
    
    showHistory() {
        if (this.historyList.length === 0) {
            alert('No calculation history yet');
            return;
        }
        
        // Create a modal for history
        const modal = document.createElement('div');
        modal.className = 'history-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'history-content';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        const title = document.createElement('h2');
        title.textContent = 'Calculation History';
        
        const historyList = document.createElement('div');
        historyList.className = 'history-list';
        
        // Display history items in reverse order (newest first)
        [...this.historyList].reverse().forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = `${this.historyList.length - index}. ${item}`;
            historyItem.addEventListener('click', () => {
                // Extract the result part from the history item
                const result = item.split('=')[1]?.trim() || item;
                this.currentInput = result;
                this.updateDisplay();
                document.body.removeChild(modal);
            });
            historyList.appendChild(historyItem);
        });
        
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-history-btn';
        clearBtn.textContent = 'Clear History';
        clearBtn.addEventListener('click', () => {
            this.historyList = [];
            localStorage.removeItem('calculatorHistory');
            document.body.removeChild(modal);
        });
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(historyList);
        modalContent.appendChild(clearBtn);
        modal.appendChild(modalContent);
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .history-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .history-content {
                background-color: var(--bg-color);
                padding: 20px;
                border-radius: 10px;
                width: 90%;
                max-width: 400px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: var(--shadow);
                position: relative;
            }
            .close-btn {
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 24px;
                cursor: pointer;
            }
            .history-list {
                margin: 20px 0;
            }
            .history-item {
                padding: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            .history-item:hover {
                background-color: var(--button-hover);
            }
            .clear-history-btn {
                background-color: var(--clear-color);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
                transition: background-color 0.2s ease;
            }
            .clear-history-btn:hover {
                background-color: #c62828;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }
    
    handleKeyboardInput(event) {
        // Only process keyboard input if we're on the standard or scientific calculator tabs
        const activePanel = document.querySelector('.panel.active');
        if (!activePanel || (activePanel.id !== 'standard-panel' && activePanel.id !== 'scientific-panel')) {
            return;
        }
        
        const key = event.key;
        
        // Prevent default behavior for calculator keys
        if (/[\d+\-*/.=]/.test(key) || key === 'Enter' || key === 'Backspace' || key === 'Escape') {
            event.preventDefault();
        }
        
        // Handle number keys
        if (/\d/.test(key)) {
            this.inputDigit(key);
        }
        
        // Handle decimal point
        if (key === '.') {
            this.inputDecimal();
        }
        
        // Handle operators
        switch (key) {
            case '+':
                this.handleOperator('add');
                break;
            case '-':
                this.handleOperator('subtract');
                break;
            case '*':
                this.handleOperator('multiply');
                break;
            case '/':
                this.handleOperator('divide');
                break;
            case '^':
                this.handleOperator('power');
                break;
            case '=':
            case 'Enter':
                this.calculate();
                break;
            case 'Backspace':
                this.backspace();
                break;
            case 'Escape':
                this.clear();
                break;
            // Additional scientific functions
            case 's':
                if (activePanel.id === 'scientific-panel') this.handleFunction('sin');
                break;
            case 'c':
                if (activePanel.id === 'scientific-panel') this.handleFunction('cos');
                break;
            case 't':
                if (activePanel.id === 'scientific-panel') this.handleFunction('tan');
                break;
            case 'l':
                if (activePanel.id === 'scientific-panel') this.handleFunction('log');
                break;
            case 'p':
                if (activePanel.id === 'scientific-panel') this.handleFunction('pi');
                break;
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize calculator immediately
    window.calculator = new Calculator();
    
    // Naruto cursor effect
    const cursor = document.querySelector('.cursor');
    let rotation = 0;
    
    // Continuous rotation animation
    function animateCursor() {
        rotation += 2;
        cursor.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        requestAnimationFrame(animateCursor);
    }
    
    // Start the animation
    animateCursor();
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Add click effect
    document.addEventListener('mousedown', () => {
        cursor.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0.8)`;
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
    });
    
    // Add cursor trail effect
    const trailCount = 5;
    const trails = [];
    
    // Create trail elements
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.opacity = (1 - i / trailCount) * 0.5;
        document.body.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0
        });
    }
    
    // Update trail positions
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateTrails() {
        // Update the first trail to follow the cursor with delay
        trails.forEach((trail, index) => {
            // Follow the previous trail with delay
            if (index === 0) {
                trail.x += (mouseX - trail.x) * 0.3;
                trail.y += (mouseY - trail.y) * 0.3;
            } else {
                trail.x += (trails[index-1].x - trail.x) * 0.3;
                trail.y += (trails[index-1].y - trail.y) * 0.3;
            }
            
            trail.element.style.left = trail.x + 'px';
            trail.element.style.top = trail.y + 'px';
        });
        
        requestAnimationFrame(updateTrails);
    }
    
    updateTrails();
});