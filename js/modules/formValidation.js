/**
 * Attaches year validation logic to a form input element.
 *
 * This module dynamically sets the range of valid years based on the current year
 * and validates the user's input according to several criteria, including:
 * - The field must not be empty.
 * - The value must be a valid integer.
 * - Leading zeros are not allowed.
 * - The value must fall within the dynamically defined range.
 *
 * It also provides real-time feedback to the user and prevents form submission if validation fails.
 *
 * @module formValidation
 */
export function attachYearValidation() {
    document.addEventListener('DOMContentLoaded', function () {
        const yearInput = document.getElementById('year');
        const yearForm = document.getElementById('year-form');
        const feedbackElement = yearInput.nextElementSibling;

        // Set dynamic range of years
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 5;
        const maxYear = currentYear + 5;

        // Use dedicated properties for setting min and max
        yearInput.min = minYear;
        yearInput.max = maxYear;

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

            // Check if the value has leading zeros
            else if (/^0\d+/.test(value)) {
                yearInput.setCustomValidity("The year cannot have leading zeros.");
                feedbackElement.textContent = "The year cannot have leading zeros.";
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
