// Special Calculations Module
class SpecialCalculations {
    constructor(calculator) {
        this.calculator = calculator;
        this.initializeUI();
    }
    
    initializeUI() {
        // Add special calculations button to the calculator tools
        const toolsSection = document.querySelector('.calculator-tools');
        const specialBtn = document.createElement('button');
        specialBtn.className = 'btn-tool';
        specialBtn.id = 'specialBtn';
        specialBtn.textContent = 'Special';
        specialBtn.addEventListener('click', () => this.showSpecialMenu());
        toolsSection.appendChild(specialBtn);
    }
    
    showSpecialMenu() {
        // Create a modal for special calculations
        const modal = document.createElement('div');
        modal.className = 'special-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'special-content';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        const title = document.createElement('h2');
        title.textContent = 'Special Calculations';
        
        const optionsList = document.createElement('div');
        optionsList.className = 'special-options';
        
        const options = [
            { id: 'bmi', name: 'BMI Calculator' },
            { id: 'interest', name: 'Interest Calculator' },
            { id: 'percentage', name: 'Percentage Calculator' },
            { id: 'date', name: 'Date Calculator' }
        ];
        
        options.forEach(option => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'special-option';
            optionBtn.textContent = option.name;
            optionBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
                this.showCalculator(option.id);
            });
            optionsList.appendChild(optionBtn);
        });
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(optionsList);
        modal.appendChild(modalContent);
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .special-modal {
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
            .special-content {
                background-color: var(--bg-color);
                padding: 20px;
                border-radius: 10px;
                width: 90%;
                max-width: 400px;
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
            .special-options {
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
                margin-top: 20px;
            }
            .special-option {
                background-color: var(--primary-color);
                color: white;
                border: none;
                padding: 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.2s ease;
            }
            .special-option:hover {
                background-color: var(--secondary-color);
                transform: translateY(-2px);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }
    
    showCalculator(type) {
        switch (type) {
            case 'bmi':
                this.showBMICalculator();
                break;
            case 'interest':
                this.showInterestCalculator();
                break;
            case 'percentage':
                this.showPercentageCalculator();
                break;
            case 'date':
                this.showDateCalculator();
                break;
        }
    }
    
    showBMICalculator() {
        const modal = this.createModalBase('BMI Calculator');
        const form = document.createElement('div');
        form.className = 'special-form';
        
        // Height input
        const heightGroup = document.createElement('div');
        heightGroup.className = 'input-group';
        const heightLabel = document.createElement('label');
        heightLabel.textContent = 'Height (cm):';
        const heightInput = document.createElement('input');
        heightInput.type = 'number';
        heightInput.placeholder = 'Enter height';
        heightGroup.appendChild(heightLabel);
        heightGroup.appendChild(heightInput);
        
        // Weight input
        const weightGroup = document.createElement('div');
        weightGroup.className = 'input-group';
        const weightLabel = document.createElement('label');
        weightLabel.textContent = 'Weight (kg):';
        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.placeholder = 'Enter weight';
        weightGroup.appendChild(weightLabel);
        weightGroup.appendChild(weightInput);
        
        // Calculate button
        const calculateBtn = document.createElement('button');
        calculateBtn.className = 'calculate-btn';
        calculateBtn.textContent = 'Calculate BMI';
        
        // Result div
        const resultDiv = document.createElement('div');
        resultDiv.className = 'calculation-result';
        
        calculateBtn.addEventListener('click', () => {
            const height = parseFloat(heightInput.value) / 100; // convert to meters
            const weight = parseFloat(weightInput.value);
            
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
            this.calculator.currentInput = bmi.toFixed(2);
            this.calculator.history = 'BMI Calculation';
            this.calculator.updateDisplay();
        });
        
        form.appendChild(heightGroup);
        form.appendChild(weightGroup);
        form.appendChild(calculateBtn);
        form.appendChild(resultDiv);
        
        modal.querySelector('.special-content').appendChild(form);
        document.body.appendChild(modal);
    }
    
    showInterestCalculator() {
        const modal = this.createModalBase('Interest Calculator');
        const form = document.createElement('div');
        form.className = 'special-form';
        
        // Type selector
        const typeGroup = document.createElement('div');
        typeGroup.className = 'input-group';
        const typeLabel = document.createElement('label');
        typeLabel.textContent = 'Interest Type:';
        const typeSelect = document.createElement('select');
        
        const simpleOption = document.createElement('option');
        simpleOption.value = 'simple';
        simpleOption.textContent = 'Simple Interest';
        typeSelect.appendChild(simpleOption);
        
        const compoundOption = document.createElement('option');
        compoundOption.value = 'compound';
        compoundOption.textContent = 'Compound Interest';
        typeSelect.appendChild(compoundOption);
        
        typeGroup.appendChild(typeLabel);
        typeGroup.appendChild(typeSelect);
        
        // Principal input
        const principalGroup = document.createElement('div');
        principalGroup.className = 'input-group';
        const principalLabel = document.createElement('label');
        principalLabel.textContent = 'Principal Amount:';
        const principalInput = document.createElement('input');
        principalInput.type = 'number';
        principalInput.placeholder = 'Enter principal amount';
        principalGroup.appendChild(principalLabel);
        principalGroup.appendChild(principalInput);
        
        // Rate input
        const rateGroup = document.createElement('div');
        rateGroup.className = 'input-group';
        const rateLabel = document.createElement('label');
        rateLabel.textContent = 'Interest Rate (% per year):';
        const rateInput = document.createElement('input');
        rateInput.type = 'number';
        rateInput.placeholder = 'Enter interest rate';
        rateGroup.appendChild(rateLabel);
        rateGroup.appendChild(rateInput);
        
        // Time input
        const timeGroup = document.createElement('div');
        timeGroup.className = 'input-group';
        const timeLabel = document.createElement('label');
        timeLabel.textContent = 'Time (years):';
        const timeInput = document.createElement('input');
        timeInput.type = 'number';
        timeInput.placeholder = 'Enter time period';
        timeGroup.appendChild(timeLabel);
        timeGroup.appendChild(timeInput);
        
        // Compound frequency (for compound interest)
        const frequencyGroup = document.createElement('div');
        frequencyGroup.className = 'input-group';
        frequencyGroup.style.display = 'none'; // Initially hidden
        const frequencyLabel = document.createElement('label');
        frequencyLabel.textContent = 'Compound Frequency:';
        const frequencySelect = document.createElement('select');
        
        const frequencies = [
            { value: '1', text: 'Annually' },
            { value: '2', text: 'Semi-annually' },
            { value: '4', text: 'Quarterly' },
            { value: '12', text: 'Monthly' },
            { value: '365', text: 'Daily' }
        ];
        
        frequencies.forEach(freq => {
            const option = document.createElement('option');
            option.value = freq.value;
            option.textContent = freq.text;
            frequencySelect.appendChild(option);
        });
        
        frequencyGroup.appendChild(frequencyLabel);
        frequencyGroup.appendChild(frequencySelect);
        
        // Show/hide frequency based on interest type
        typeSelect.addEventListener('change', () => {
            if (typeSelect.value === 'compound') {
                frequencyGroup.style.display = 'block';
            } else {
                frequencyGroup.style.display = 'none';
            }
        });
        
        // Calculate button
        const calculateBtn = document.createElement('button');
        calculateBtn.className = 'calculate-btn';
        calculateBtn.textContent = 'Calculate Interest';
        
        // Result div
        const resultDiv = document.createElement('div');
        resultDiv.className = 'calculation-result';
        
        calculateBtn.addEventListener('click', () => {
            const principal = parseFloat(principalInput.value);
            const rate = parseFloat(rateInput.value) / 100; // Convert to decimal
            const time = parseFloat(timeInput.value);
            
            if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate <= 0 || time <= 0) {
                resultDiv.innerHTML = 'Please enter valid values';
                return;
            }
            
            let interest, amount;
            
            if (typeSelect.value === 'simple') {
                interest = principal * rate * time;
                amount = principal + interest;
                
                resultDiv.innerHTML = `
                    <p>Principal: <strong>${principal.toFixed(2)}</strong></p>
                    <p>Interest: <strong>${interest.toFixed(2)}</strong></p>
                    <p>Total Amount: <strong>${amount.toFixed(2)}</strong></p>
                `;
            } else {
                const frequency = parseInt(frequencySelect.value);
                amount = principal * Math.pow(1 + (rate / frequency), frequency * time);
                interest = amount - principal;
                
                resultDiv.innerHTML = `
                    <p>Principal: <strong>${principal.toFixed(2)}</strong></p>
                    <p>Interest: <strong>${interest.toFixed(2)}</strong></p>
                    <p>Total Amount: <strong>${amount.toFixed(2)}</strong></p>
                `;
            }
            
            // Set the result to calculator display
            this.calculator.currentInput = amount.toFixed(2);
            this.calculator.history = 'Interest Calculation';
            this.calculator.updateDisplay();
        });
        
        form.appendChild(typeGroup);
        form.appendChild(principalGroup);
        form.appendChild(rateGroup);
        form.appendChild(timeGroup);
        form.appendChild(frequencyGroup);
        form.appendChild(calculateBtn);
        form.appendChild(resultDiv);
        
        modal.querySelector('.special-content').appendChild(form);
        document.body.appendChild(modal);
    }
    
    showPercentageCalculator() {
        const modal = this.createModalBase('Percentage Calculator');
        const form = document.createElement('div');
        form.className = 'special-form';
        
        // Type selector
        const typeGroup = document.createElement('div');
        typeGroup.className = 'input-group';
        const typeLabel = document.createElement('label');
        typeLabel.textContent = 'Calculation Type:';
        const typeSelect = document.createElement('select');
        
        const options = [
            { value: 'percent', text: 'X% of Y' },
            { value: 'increase', text: 'X% increase of Y' },
            { value: 'decrease', text: 'X% decrease of Y' },
            { value: 'difference', text: 'Percentage difference' }
        ];
        
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            typeSelect.appendChild(opt);
        });
        
        typeGroup.appendChild(typeLabel);
        typeGroup.appendChild(typeSelect);
        
        // First value input
        const value1Group = document.createElement('div');
        value1Group.className = 'input-group';
        const value1Label = document.createElement('label');
        value1Label.textContent = 'Percentage (%):';
        const value1Input = document.createElement('input');
        value1Input.type = 'number';
        value1Input.placeholder = 'Enter percentage';
        value1Group.appendChild(value1Label);
        value1Group.appendChild(value1Input);
        
        // Second value input
        const value2Group = document.createElement('div');
        value2Group.className = 'input-group';
        const value2Label = document.createElement('label');
        value2Label.textContent = 'Value:';
        const value2Input = document.createElement('input');
        value2Input.type = 'number';
        value2Input.placeholder = 'Enter value';
        value2Group.appendChild(value2Label);
        value2Group.appendChild(value2Input);
        
        // Third value input (for percentage difference)
        const value3Group = document.createElement('div');
        value3Group.className = 'input-group';
        value3Group.style.display = 'none'; // Initially hidden
        const value3Label = document.createElement('label');
        value3Label.textContent = 'Second Value:';
        const value3Input = document.createElement('input');
        value3Input.type = 'number';
        value3Input.placeholder = 'Enter second value';
        value3Group.appendChild(value3Label);
        value3Group.appendChild(value3Input);
        
        // Update labels and visibility based on calculation type
        typeSelect.addEventListener('change', () => {
            if (typeSelect.value === 'difference') {
                value1Group.style.display = 'none';
                value2Label.textContent = 'First Value:';
                value3Group.style.display = 'block';
            } else {
                value1Group.style.display = 'block';
                value2Label.textContent = 'Value:';
                value3Group.style.display = 'none';
            }
        });
        
        // Calculate button
        const calculateBtn = document.createElement('button');
        calculateBtn.className = 'calculate-btn';
        calculateBtn.textContent = 'Calculate';
        
        // Result div
        const resultDiv = document.createElement('div');
        resultDiv.className = 'calculation-result';
        
        calculateBtn.addEventListener('click', () => {
            const type = typeSelect.value;
            let result;
            
            if (type === 'difference') {
                const value1 = parseFloat(value2Input.value);
                const value2 = parseFloat(value3Input.value);
                
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
                const percentage = parseFloat(value1Input.value);
                const value = parseFloat(value2Input.value);
                
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
            this.calculator.currentInput = result.toFixed(2);
            this.calculator.history = 'Percentage Calculation';
            this.calculator.updateDisplay();
        });
        
        form.appendChild(typeGroup);
        form.appendChild(value1Group);
        form.appendChild(value2Group);
        form.appendChild(value3Group);
        form.appendChild(calculateBtn);
        form.appendChild(resultDiv);
        
        modal.querySelector('.special-content').appendChild(form);
        document.body.appendChild(modal);
    }
    
    showDateCalculator() {
        const modal = this.createModalBase('Date Calculator');
        const form = document.createElement('div');
        form.className = 'special-form';
        
        // Type selector
        const typeGroup = document.createElement('div');
        typeGroup.className = 'input-group';
        const typeLabel = document.createElement('label');
        typeLabel.textContent = 'Calculation Type:';
        const typeSelect = document.createElement('select');
        
        const options = [
            { value: 'difference', text: 'Days between dates' },
            { value: 'add', text: 'Add days to date' },
            { value: 'subtract', text: 'Subtract days from date' }
        ];
        
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            typeSelect.appendChild(opt);
        });
        
        typeGroup.appendChild(typeLabel);
        typeGroup.appendChild(typeSelect);
        
        // First date input
        const date1Group = document.createElement('div');
        date1Group.className = 'input-group';
        const date1Label = document.createElement('label');
        date1Label.textContent = 'First Date:';
        const date1Input = document.createElement('input');
        date1Input.type = 'date';
        date1Input.valueAsDate = new Date();
        date1Group.appendChild(date1Label);
        date1Group.appendChild(date1Input);
        
        // Second date input (for difference)
        const date2Group = document.createElement('div');
        date2Group.className = 'input-group';
        const date2Label = document.createElement('label');
        date2Label.textContent = 'Second Date:';
        const date2Input = document.createElement('input');
        date2Input.type = 'date';
        date2Input.valueAsDate = new Date();
        date2Group.appendChild(date2Label);
        date2Group.appendChild(date2Input);
        
        // Days input (for add/subtract)
        const daysGroup = document.createElement('div');
        daysGroup.className = 'input-group';
        daysGroup.style.display = 'none'; // Initially hidden
        const daysLabel = document.createElement('label');
        daysLabel.textContent = 'Number of Days:';
        const daysInput = document.createElement('input');
        daysInput.type = 'number';
        daysInput.placeholder = 'Enter number of days';
        daysGroup.appendChild(daysLabel);
        daysGroup.appendChild(daysInput);
        
        // Update visibility based on calculation type
        typeSelect.addEventListener('change', () => {
            if (typeSelect.value === 'difference') {
                date2Group.style.display = 'block';
                daysGroup.style.display = 'none';
            } else {
                date2Group.style.display = 'none';
                daysGroup.style.display = 'block';
            }
        });
        
        // Calculate button
        const calculateBtn = document.createElement('button');
        calculateBtn.className = 'calculate-btn';
        calculateBtn.textContent = 'Calculate';
        
        // Result div
        const resultDiv = document.createElement('div');
        resultDiv.className = 'calculation-result';
        
        calculateBtn.addEventListener('click', () => {
            const type = typeSelect.value;
            
            if (type === 'difference') {
                const date1 = new Date(date1Input.value);
                const date2 = new Date(date2Input.value);
                
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
                this.calculator.currentInput = diffDays.toString();
                this.calculator.history = 'Date Difference';
                this.calculator.updateDisplay();
            } else {
                const date = new Date(date1Input.value);
                const days = parseInt(daysInput.value);
                
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
                
                // We don't update the calculator display for date results
            }
        });
        
        form.appendChild(typeGroup);
        form.appendChild(date1Group);
        form.appendChild(date2Group);
        form.appendChild(daysGroup);
        form.appendChild(calculateBtn);
        form.appendChild(resultDiv);
        
        modal.querySelector('.special-content').appendChild(form);
        document.body.appendChild(modal);
    }
    
    createModalBase(title) {
        const modal = document.createElement('div');
        modal.className = 'special-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'special-content';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(titleElement);
        modal.appendChild(modalContent);
        
        // Add modal styles if not already added
        if (!document.querySelector('style.special-styles')) {
            const style = document.createElement('style');
            style.className = 'special-styles';
            style.textContent = `
                .special-modal {
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
                .special-content {
                    background-color: var(--bg-color);
                    padding: 20px;
                    border-radius: 10px;
                    width: 90%;
                    max-width: 400px;
                    max-height: 90vh;
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
                .special-form {
                    margin-top: 20px;
                }
                .input-group {
                    margin-bottom: 15px;
                }
                .input-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: var(--text-color);
                }
                .input-group input, .input-group select {
                    width: 100%;
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid var(--secondary-color);
                    background-color: var(--button-bg);
                    color: var(--text-color);
                }
                .calculate-btn {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 100%;
                    margin-bottom: 15px;
                    font-size: 16px;
                }
                .calculate-btn:hover {
                    background-color: var(--secondary-color);
                }
                .calculation-result {
                    padding: 15px;
                    background-color: var(--display-bg);
                    border-radius: 5px;
                    min-height: 50px;
                }
                .calculation-result p {
                    margin-bottom: 8px;
                }
            `;
            document.head.appendChild(style);
        }
        
        return modal;
    }
}

// Initialize special calculations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the calculator to be initialized
    setTimeout(() => {
        const calculator = new SpecialCalculations(window.calculator);
    }, 100);
});