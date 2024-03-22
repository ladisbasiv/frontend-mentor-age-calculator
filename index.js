function initialize() {
    const calculateButton = document.querySelector('.button img');
    calculateButton.addEventListener('click', event => {
        clearErrors();
        calculateAge();
    });

    calculateButton.addEventListener('keydown', event => {
        if (event.key === 'Enter') event.target.click();
    });

    document.querySelectorAll('.birthday-form input').forEach(input => {
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter') calculateButton.focus();
        });
    });
}

function calculateAge() {
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');

    validateDay(dayInput);
    validateMonth(monthInput);
    validateYear(yearInput);
    if (document.querySelector('.error')) return;

    validateDate(dayInput, monthInput, yearInput)
    if (document.querySelector('.error')) return;

    showAge(dayInput, monthInput, yearInput);
}

function validateDay(input) {
    const day = +input.value;

    if (checkBlank(input)) return;

    if (day < 1 || day > 31) {
        showError(input, 'Must be a valid day');
        return;
    }
}

function validateMonth(input) {
    const month = +input.value;

    if (checkBlank(input)) return;

    if (month < 1 || month > 12) {
        showError(input, 'Must be a valid month');
        return;
    }

}

function validateYear(input) {
    const year = +input.value;

    if (checkBlank(input)) return;

    if (year < 0) {
        showError(input, 'Should be this era');
        return;
    }

    if (year > (new Date().getFullYear())) {
        showError(input, 'Should be in the past');
        return;
    }
}

function validateDate(dayInput, monthInput, yearInput) {

    const [day, month, year] = [dayInput.value, monthInput.value - 1, yearInput.value]
    
    const date = new Date(year, month, day);
    date.setFullYear(year);

    if (date.getMonth() !== month) {
        showError(dayInput, 'Must be a valid date');
        return;
    }

    if (+date > Date.now()) {

        const currentDate = new Date();

        if (currentDate.getMonth() < month) {
            showError(monthInput, 'Must be in the past');
            return;
        }  

        showError(dayInput, 'Must be in the past');
        return;
    }
}

function checkBlank(input) {
    if (!input.value) {
        showError(input, 'This field is required');
        return true;
    }

    return false;
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(err => err.remove());
    document.querySelectorAll('.validation-error').forEach(err => err.classList.remove('validation-error'));
}

function showError(input, text) {
    const error = document.createElement('small');
    error.className = 'error';
    error.textContent = text;

    input.after(error);
    input.parentElement.classList.add('validation-error')
}

function showAge(dayInput, monthInput, yearInput) {

    const birthDate = new Date(yearInput.value, monthInput.value - 1, dayInput.value);
    birthDate.setFullYear(yearInput.value);

    const currentDate = new Date();

    const dayField = document.querySelector('.age-element.days span');
    const monthField = document.querySelector('.age-element.months span');
    const yearField = document.querySelector('.age-element.years span');
    
    const [birthDay, birthMonth, birthYear] = [birthDate.getDate(), birthDate.getMonth(), birthDate.getYear()];
    const [currentDay, currentMonth, currentYear] = [currentDate.getDate(), currentDate.getMonth(), currentDate.getYear()];


    //calculate days

    if (birthDay <= currentDay) {
        dayField.textContent = currentDay - birthDay;

    } else {
        const birthDateCpy = new Date(+birthDate);
        birthDateCpy.setMonth(birthMonth + 1);
        birthDateCpy.setDate(0);
        dayField.textContent = currentDay + birthDateCpy.getDate() - birthDay;
    }

    
    // calculate months

    if (birthMonth <= currentMonth) {
        monthField.textContent = currentMonth - birthMonth;

        if (currentMonth === birthMonth && currentDay < birthDay) {
            monthField.textContent = 11;
        }

    } else {
        monthField.textContent = (12 - monthInput.value + currentMonth);
    }

    if (currentDay === birthDay && currentMonth != birthMonth && currentMonth < birthMonth) {
        monthField.textContent = +monthField.textContent + 1;
    }


    // calculate years

    if (birthMonth > currentMonth || (birthMonth === currentMonth && birthDay > currentDay)) {
        yearField.textContent = currentYear - birthYear - 1;

    } else {
        yearField.textContent = currentYear - birthYear;
    }

}

initialize();