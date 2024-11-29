export function attachYearValidation() {
    document.addEventListener('DOMContentLoaded', function () {
        const yearInput = document.getElementById('year');
        const yearForm = document.getElementById('year-form');
        const feedbackElement = yearInput.nextElementSibling;

        // Set dynamic range of years
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 5;
        const maxYear = currentYear + 5;

        yearInput.setAttribute('min', minYear);
        yearInput.setAttribute('max', maxYear);

        // Validation function
        const validateYear = () => {
            yearInput.setCustomValidity(''); // Reset custom error message
            feedbackElement.textContent = ''; // Reset error text

            const value = yearInput.value.trim();

            // Check if the field is empty
            if (yearInput.validity.valueMissing) {
                yearInput.setCustomValidity("Please fill out this field.");
                feedbackElement.textContent = "Please fill out this field.";
            }
            // Check if the value is an integer
            else if (isNaN(value) || value.includes('.') || !/^\d+$/.test(value)) {
                yearInput.setCustomValidity("The year must be a valid number.");
                feedbackElement.textContent = "The year must be a valid number.";
            }
            // Check the range
            else if (yearInput.validity.rangeUnderflow) {
                yearInput.setCustomValidity(`The year must be at least ${minYear}.`);
                feedbackElement.textContent = `The year must be at least ${minYear}.`;
            } else if (yearInput.validity.rangeOverflow) {
                yearInput.setCustomValidity(`The year must be no more than ${maxYear}.`);
                feedbackElement.textContent = `The year must be no more than ${maxYear}.`;
            }
        };

        // Check during input
        yearInput.addEventListener('input', validateYear);

        // Check before form submission
        yearForm.addEventListener('submit', function (event) {
            validateYear();
            if (!yearForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            yearForm.classList.add('was-validated');
        });
    });
}
