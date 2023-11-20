$(document).ready(function() {  // jQuery document ready function
    // Get the year parameter from the URL query string
    const year = new URL(window.location.href).searchParams.get("year");

    // Initialize the datepicker widget for the element with the ID datepicker.
    // This code configures the datepicker with various options and settings to enable date selection and define its behavior.
    $("#datepicker").datepicker({
        defaultDate: new Date(parseInt(year), 0),  // Set the default date to the first month of the year
        changeMonth: false,  // Disable the ability to change the month
        changeYear: false,  // Disable the ability to change the year
        yearRange: `${year}:${year}`,  // Set the year range to the current year only
        showButtonPanel: true,  // Show the button panel, including the Today button
        dateFormat: "dd-mm-yy", // Set the date format to dd/mm/yy

        onSelect: function (dateText, inst) {
            // This is the callback function that gets executed when a date is selected in the datepicker.
            // It takes two parameters: dateText (the selected date in text format) and inst (the datepicker instance).
            // The code within this function handles the logic for selecting and deselecting dates, updating the counter,
            // and calling the checkSelectedDays function to update the buttons' states based on the selected dates.

        },

        onClose: function (dateText, inst) {
            // This is the callback function that gets executed when the datepicker is closed.
            // It takes two parameters: dateText (the currently selected date in text format) and inst (the datepicker instance).
            // The code within this function sets the selected date in the datepicker currently selected date.
            // This ensures that when the datepicker is reopened, it displays the previously selected date as the default.

        }
    });

    // Event handler for showing all holidays (public and church holidays) in the selected year
    $("#showAllHolidaysBtn").click(function() {
        window.location.href = "all_holidays_in_the_year.html?year=" + year;
    });

});