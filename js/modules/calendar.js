// A. Calendar initialization and main operations
/**
 * Initializes the datepicker widget with configuration customized for the application:
 * - Blocks holidays and limits the number of selectable days.
 * - Handles date selection and resetting selected days.
 * - Updates the user interface based on selected dates.
 *
 * @param {number} year - The year for which the calendar operates.
 * @param {number} maxSelectableDays - The maximum number of days that can be selected.
 * @param {Array} holidays - Array of holiday objects (contains `date`, `name`, `type`).
 * @param {Array} selectedDates - Array of currently selected dates.
 * @param {Function} checkSelectedDays - Function to update button states based on the number of selected dates.
 */
export function initializeCalendar(year, maxSelectableDays, holidays, selectedDates, checkSelectedDays) {
    const datepickerElement = $('#datepicker');
    // Check if the #datepicker element exists in the DOM to avoid initialization errors
    if (datepickerElement.length === 0) {
        console.error("Element #datepicker does not exist.");
        return;
    }

    // Datepicker widget configuration
    datepickerElement.datepicker({
        defaultDate: new Date(year, 0),  // Set the initial date to January 1st of the selected year
        changeMonth: false,                    // Disable dropdown list for months. Month can only be changed using arrows
        changeYear: false,                     // Disable dropdown list for years. Year can only be changed using arrows
        yearRange: `${year}:${year}`,          // Restrict the calendar to a single year
        showButtonPanel: true,                 // Display button panel (e.g., "Today" button)
        dateFormat: "dd-mm-yy",                // Date format displayed in the UI

        /**
         * Function called before displaying each day in the calendar.
         * Sets CSS classes and tooltips for days based on:
         * - Day type (e.g., weekend, holiday).
         * - Number of selected days (disables selection after reaching the limit).
         */
        beforeShowDay: date => getCssClassesAndTooltipText(date, holidays, maxSelectableDays, selectedDates),

        /**
         * Function handling date selection.
         * Adds or removes a date from the list of selected dates and refreshes the interface.
         */
        onSelect: function (dateText) {
            handleDateSelect(dateText, this, selectedDates, maxSelectableDays, holidays);
            checkSelectedDays(selectedDates); // Update button states after date selection
        }
    });

    // Handle resetting (deselecting) all selected days on button click
    $('#reset-all-days-btn').click(function() {
        resetAllDays(selectedDates, checkSelectedDays);
    });

    // Initialize the UI state – disables export buttons if no dates are selected
    checkSelectedDays(selectedDates);
}

/**
 * Resets all selected days in the calendar and updates the user interface:
 * - Removes all dates from the selected list.
 * - Clears UI elements related to selected dates.
 * - Resets the counter of selected days to 0.
 * - Refreshes button states based on the empty list of selected dates.
 *
 * @param {Array} selectedDates - Array storing the selected dates (will be cleared).
 * @param {Function} checkSelectedDays - Function responsible for updating button states.
 */
function resetAllDays(selectedDates, checkSelectedDays) {
    selectedDates.length = 0; // Clear the selected dates array
    $('#selected-days').empty(); // Remove selected dates from the UI list
    $('#counter-value').text('0'); // Reset the selected days counter in the UI
    checkSelectedDays(selectedDates); // Refresh the UI button states
}

// B. Event and interaction handling
/**
 * Handles selecting or deselecting a date in the datepicker widget:
 * - Prevents selecting holiday dates.
 * - Limits the selection of dates to the maximum allowed number.
 * - Updates the list of selected dates and the user interface.
 *
 * @param {string} dateText - Selected date in text format (e.g., "15-07-2024").
 * @param {HTMLElement} picker - Datepicker widget element triggering the event.
 * @param {Array} selectedDates - Array storing the list of currently selected dates.
 * @param {number} maxSelectableDays - The maximum number of days the user can select.
 * @param {Array} holidays - Array of objects representing holidays (`date`, `name`, `type`).
 */
function handleDateSelect(dateText, picker, selectedDates, maxSelectableDays, holidays) {
    const date = $(picker).datepicker('getDate'); // Get the date object from the widget
    const dateString = $.datepicker.formatDate('dd-mm-yy', date); // Format the date as text
    const index = selectedDates.indexOf(dateString); // Check if the date is already selected
    const counter = $('#counter-value'); // UI element displaying the selected days counter

    // Check if the selected date is a holiday
    const isHoliday = holidays.some(holiday => holiday.date.toDateString() === date.toDateString());
    if (isHoliday) {
        alert("You cannot select this date because it is a holiday."); // Notify the user that selecting holiday dates is not allowed
        return; // Abort event handling
    }

    // Add the date if it is not yet selected and the selection limit is not exceeded
    if (index === -1 && selectedDates.length < maxSelectableDays) {
        selectedDates.push(dateString); // Add the date to the selected list
        $('#selected-days').append(`<li>${dateText}</li>`); // Add the date to the UI list
    } else if (index > -1) {
        // Remove the date if it was already selected
        selectedDates.splice(index, 1); // Remove the date from the selected list
        $(`#selected-days li:contains(${dateText})`).remove(); // Remove the date from the UI list
    }

    counter.text(selectedDates.length.toString()); // Update the counter value in the UI
}

/**
 * Updates the state of UI buttons based on the number of selected dates:
 * - If no dates are selected, the buttons are disabled.
 * - If valid dates are selected (minimum of 1 day), the buttons are enabled.
 *
 * @param {Array} selectedDates - Array storing the list of currently selected dates.
 *                                 Its length determines the number of selected days.
 */
export function checkSelectedDays(selectedDates) {
    const numberOfSelectedDays = selectedDates.length; // Get the number of selected dates

    // List of button selectors whose states should be controlled
    const buttons = ['#reset-all-days-btn', '#export-days-off-pdf', '#export-icalendar'];

    if (numberOfSelectedDays === 0) {
        // If no dates are selected, disable all buttons
        buttons.forEach(selector => $(selector).attr('disabled', 'disabled'));
    } else {
        // If dates are selected, enable the buttons
        buttons.forEach(selector => $(selector).removeAttr('disabled'));
    }
}

// C. Calendar helper functions
/**
 * Determines CSS classes and tooltip text for dates in the calendar:
 * - Assigns appropriate CSS class based on day type (e.g., holiday, weekend, workday).
 * - Disables date selection if the maximum selection limit is reached.
 * - Adds tooltips (holiday name and type) for holidays.
 *
 * @param {Date} date - The date for which classes and tooltips are determined.
 * @param {Array} holidays - Array of holiday objects, where each object contains `date`, `name`, `type`.
 * @param {number} maxSelectableDays - The maximum number of days that can be selected.
 * @param {Array} selectedDates - Array of currently selected dates in text format (`dd-mm-yy`).
 * @returns {Array} - An array containing: [whether the day is selectable (boolean), CSS classes (string), tooltip text (string)].
 */
function getCssClassesAndTooltipText(date, holidays, maxSelectableDays, selectedDates) {
    // Initialization of variables for CSS class and tooltip text, updated based on conditions
    let cssClass = "", tooltip = "";

    // Get the day of the week from the date object (0 = Sunday, 6 = Saturday)
    const day = date.getDay();

    // Check if the date is a holiday
    const holiday = holidays.find(h => h.date.toDateString() === date.toDateString());
    if (holiday) {
        // Classify the holiday based on its type
        cssClass = holiday.type === 'Public Holiday' ? 'public-holiday' : 'church-holiday';
        tooltip = `${holiday.name} (${holiday.type})`; // Tooltip text with the name and type of the holiday
    } else {
        // Assign CSS class depending on whether it is a weekend or a workday
        cssClass = (day === 0 || day === 6) ? "weekend" : "working-day";
    }

    // Disable date selection if the maximum selection limit is reached
    if (selectedDates.length >= maxSelectableDays) {
        return [false, cssClass + " disabled-all-days", tooltip]; // Add CSS class blocking selection
    }

    // By default, the date is selectable
    return [true, cssClass, tooltip];
}

// D. Generating holidays
/**
 * Generates an array of objects representing holidays for a given year.
 *
 * Each holiday object includes:
 * - `date` (Date): The date of the holiday.
 * - `name` (string): The name of the holiday.
 * - `type` (string): The type of holiday, e.g., 'Public Holiday' or 'Church Holiday'.
 *
 * Includes both public holidays and church holidays.
 * Some holidays, such as Easter and Corpus Christi, are dynamically calculated.
 *
 * @param {number} year - The year for which holidays are generated.
 * @returns {Array} - Array of objects containing holiday dates and information.
 */
export function getHolidays(year) {
    // Calculate the date of Easter Monday (the day after Easter)
    const easterMonday = getEaster(year);
    easterMonday.setDate(easterMonday.getDate() + 1);

    // Calculate the date of Corpus Christi (60 days after Easter)
    const corpusChristi = getCorpusChristi(year);

    // Public holidays
    const publicHolidays = [
        { date: new Date(year, 4, 1), name: 'Labour Day', type: 'Public Holiday' },
        { date: new Date(year, 4, 3), name: 'May 3rd Constitution Day', type: 'Public Holiday' },
        { date: new Date(year, 10, 11), name: 'Independence Day', type: 'Public Holiday' },
    ];

    // Church holidays
    const churchHolidays = [
        { date: new Date(year, 0, 1), name: 'New Year', type: 'Church Holiday' },
        { date: new Date(year, 0, 6), name: 'Feast of the Three Kings', type: 'Church Holiday' },
        { date: getEaster(year), name: 'Easter', type: 'Church Holiday' },
        { date: easterMonday, name: 'Easter Monday', type: 'Church Holiday' },
        { date: corpusChristi, name: 'Corpus Christi', type: 'Church Holiday' },
        { date: new Date(year, 7, 15), name: 'Assumption of Mary', type: 'Church Holiday' },
        { date: new Date(year, 10, 1), name: 'All Saints\' Day', type: 'Church Holiday' },
        { date: new Date(year, 11, 25), name: '1st day of Christmas', type: 'Church Holiday' },
        { date: new Date(year, 11, 26), name: '2nd day of Christmas', type: 'Church Holiday' }
    ];

    // Combine public and church holidays into a single array
    return [...publicHolidays, ...churchHolidays];
}

/**
 * Calculates the date of Easter for a given year using the Meeus/Jones/Butcher algorithm.
 * Based on the Meeus/Jones/Butcher algorithm, as described on Wikipedia:
 * https://pl.wikipedia.org/wiki/Wielkanoc#Wyznaczanie_daty_Wielkanocy_w_danym_roku
 *
 * The algorithm accounts for solar and lunar cycles within the Gregorian calendar.
 * Easter falls on the first Sunday after the first full moon occurring after the spring equinox (March 21).
 *
 * @param {number} year - The year for which the Easter date is calculated.
 * @returns {Date} - The date of Easter as a Date object.
 */
export function getEaster(year) {
    const a = year % 19;  // a: The year's position in the 19-year Metonic cycle (used to approximate the lunar cycle)
    const b = Math.floor(year / 100);  // b: The century the year belongs to (e.g., for 2024, b = 20)
    const c = year % 100;  // c: The year within the century (e.g., for 2024, c = 24)
    const d = Math.floor(b / 4);  // d: The number of leap years in the century
    const e = b % 4;  // e: The remainder when dividing the century number by 4 (indicating the position in the leap-year cycle)
    const f = Math.floor((b + 8) / 25);  // f: The number of centuries where adjustments to the lunar calendar were skipped (related to the Gregorian reform)
    const g = Math.floor((b - f + 1) / 3);  // g: Another Gregorian correction factor, accounting for the extra leap day suppression
    const h = (19 * a + b - d - g + 15) % 30;  // h: Determines the "epact," the age of the moon on January 1st of the given year
    const i = Math.floor(c / 4);  // i: The number of leap years within the current century
    const k = c % 4;  // k: The position of the year within the 4-year leap-year cycle
    const l = (32 + 2 * e + 2 * i - h - k) % 7;  // l: Determines the day of the week for the Paschal full moon
    const m = Math.floor((a + 11 * h + 22 * l) / 451);  // m: A correction factor for the Gregorian calendar adjustment
    const n = Math.floor((h + l - 7 * m + 114) / 31);  // n: The month of Easter (3 for March, 4 for April)
    const p = (h + l - 7 * m + 114) % 31;  // p: The day of Easter within the month

    // Return a new Date object representing the Easter date for the given year (n - 1 because months are zero-based)
    return new Date(year, n - 1, p + 1);
}

/**
 * Calculates the date of Corpus Christi for a given year.
 * Corpus Christi is a movable feast that always occurs 60 days after Easter.
 *
 * The algorithm is based on first calculating the date of Easter
 * using the `getEaster(year)` function and then adding 60 days to its date.
 *
 * @param {number} year - The year for which the date of Corpus Christi is calculated.
 * @returns {Date} - A Date object representing the date of Corpus Christi in the given year.
 */
export function getCorpusChristi(year) {
    const easterDate = getEaster(year); // Get the date of Easter
    const corpusChristiDate = new Date(easterDate); // Create a copy of the Easter date
    corpusChristiDate.setDate(corpusChristiDate.getDate() + 60); // Add 60 days
    return corpusChristiDate; // Return the date of Corpus Christi
}
