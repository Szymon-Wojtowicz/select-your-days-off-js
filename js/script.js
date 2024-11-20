$(document).ready(function() {  // jQuery document ready function
    // Get the year parameter from the URL query string
    const year = new URL(window.location.href).searchParams.get("year");

    // Initialize selectedDates as an empty array
    let selectedDates = [];

    // Set the maximum number of selectable days
    const maxSelectableDays = 26;

    checkSelectedDays();  // Call this function ensure that the Export buttons' states are correctly updated whenever there is a change in the selected dates

    // This function is called for each date in the datepicker to determine its CSS classes and tooltip text.
    // It takes the date parameter representing the current date being rendered.
    // Within this function, it is defined the logic to determine the CSS classes and tooltip text for each date.
    // The returned values will be applied to the corresponding date in the datepicker.
    function getCssClassesAndTooltipText(date) {
        let day = date.getDay();  // Get the day of the week (0-6) from the provided date
        let cssClass = "";  // Initialize an empty string variable to store the CSS class
        let tooltip = "";  // Initialize an empty string variable to store the tooltip text

        // Mapping holiday types to CSS classes and tooltips
        const holidayMapping = {
            'Public holiday': { cssClass: 'public-holiday', tooltip: 'Public Holiday' },
            'Church holiday': { cssClass: 'church-holiday', tooltip: 'Church Holiday' }
        };

        // Iterate over the holidays array and check if it's a holiday first
        holidays.forEach(function (holiday) {
            // Check if the current holiday matches the provided date
            if (holiday.date.getFullYear() === date.getFullYear()
                && holiday.date.getMonth() === date.getMonth()
                && holiday.date.getDate() === date.getDate()) {

                // Check if the holiday type exists in the mapping
                if (holidayMapping[holiday.type]) {
                    const { cssClass: holidayCssClass, tooltip: holidayTooltip } = holidayMapping[holiday.type];
                    cssClass = holidayCssClass;
                    tooltip = holiday.name + " (" + holidayTooltip + ")";
                }
            }
        });

        // Jeśli dzień nie jest świętem, sprawdzamy, czy to weekend czy dzień roboczy
        if (!cssClass) {
            cssClass = (day === 0 || day === 6) ? "weekend" : "working-day";
        }

        // Disable days if the maximum number of selectable days has been reached
        if (selectedDates.length >= maxSelectableDays) {
            // Return an array indicating that the date is not selectable,
            // along with the CSS class disabled-all-days and the tooltip text
            return [false, cssClass + "disabled-all-days", tooltip];
        }

        // Disable public holidays and church holidays
        if (holidays.some(function(holiday) {
            return holiday.date.getFullYear() === date.getFullYear() &&
                holiday.date.getMonth() === date.getMonth() &&
                holiday.date.getDate() === date.getDate();
        })) {
            // If the current date is a public holiday or a church holiday,
            // return an array indicating that the date is not selectable,
            // along with the CSS class disabled-holiday and the tooltip text
            return [false, cssClass + " disabled-holiday", tooltip];
        }

        // Return an array with a boolean value indicating if the date is selectable, the calculated CSS class, and the tooltip text
        return [true, cssClass, tooltip];
    }

    // Initialize the datepicker widget for the element with the ID datepicker.
    // This code configures the datepicker with various options and settings to enable date selection and define its behavior.
    $("#datepicker").datepicker({
        defaultDate: new Date(parseInt(year), 0),  // Set the default date to the first month of the year
        changeMonth: false,  // Disable the ability to change the month
        changeYear: false,  // Disable the ability to change the year
        yearRange: `${year}:${year}`,  // Set the year range to the current year only
        showButtonPanel: true,  // Show the button panel, including the Today button
        dateFormat: "dd-mm-yy", // Set the date format to dd/mm/yy

        beforeShowDay: getCssClassesAndTooltipText,  // Assign the getCssClassesAndTooltipText function as the callback for the beforeShowDay event of the datepicker.
                                                     // This function is responsible for determining the CSS classes and tooltip text for each date before it is displayed.

        onSelect: function (dateText, inst) {
            // This is the callback function that gets executed when a date is selected in the datepicker.
            // It takes two parameters: dateText (the selected date in text format) and inst (the datepicker instance).
            // The code within this function handles the logic for selecting and deselecting dates, updating the counter,
            // and calling the checkSelectedDays function to update the buttons' states based on the selected dates.

            let date = $(this).datepicker('getDate');  // Get the selected date from the datepicker widget and assign it to the variable date
            let dateString = $.datepicker.formatDate('dd-mm-yy', date);  // Format the selected date as a string in the format dd-mm-yy using the jQuery UI datepicker's formatDate function and assign it to the variable dateString

            let index = $.inArray(dateString, selectedDates);  // Find the index of the selected date in the array of selected dates
            let counter = document.getElementById('counter-value');  // Get the element with the ID counter-value and assign it to the variable counter

            if (index === -1 && selectedDates.length < maxSelectableDays) {
                // If the index is equal to -1 (indicating that the selected date is not already in the selectedDates array)
                // and the length of selectedDates is less than the maximum selectable days (maxSelectableDays),
                // then execute the code within this block

                selectedDates.push(dateString);  // Add the selected date to the array of selected dates

                $('#selected-days').append('<li>' + dateText + '</li>');  // Append the selected date to the list of selected days

                counter.innerText = selectedDates.length.toString();  // Update the counter with the new count of selected dates

            } else if (index > -1) {
                // If the index is greater than -1 (indicating that the selected date is already in the selectedDates array),
                // then execute the code within this block

                selectedDates.splice(index, 1);  // Remove the deselected date from the array of selected dates

                $('#selected-days li:contains(' + dateText + ')').remove();  // Remove the deselected date from the list of selected days

                counter.innerText = selectedDates.length.toString();  // Update the counter with the new count of selected dates
            }
            checkSelectedDays();  // Call the checkSelectedDays function to ensure that the buttons' states are correctly updated whenever there is a change in the selected dates
        },

        onClose: function (dateText, inst) {
            // This is the callback function that gets executed when the datepicker is closed.
            // It takes two parameters: dateText (the currently selected date in text format) and inst (the datepicker instance).
            // The code within this function sets the selected date in the datepicker currently selected date.
            // This ensures that when the datepicker is reopened, it displays the previously selected date as the default.
            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay));  // Set the selected date of the datepicker to the currently selected date for default display
        }
    });

    // Function to clear the datepicker and remove all selected days (days off) from the list
    function resetAllDays() {
        selectedDates = [];  // Clear the array of selected dates
        $("#datepicker td.selected").removeClass("selected");  // Remove the selected class from all datepicker table cells
        $("#selected-days").empty();  // Empty the selected days list
        $("#counter-value").text("0");  // Reset the counter value to 0
        checkSelectedDays();  // Trigger a check on the selected days
    }

    // Code to call the resetAllDays() function when the Uncheck all days button is clicked
    $("#resetAllDaysBtn").click(function() {
        resetAllDays();  // Call the resetAllDays function to clear and reset the selected days (days off)
    });

    // Function to check if days were selected and enable/disable buttons accordingly
    function checkSelectedDays() {
        if (selectedDates.length === 0) {  // Check if there are no selected dates
            $('#exportPDFBtn').attr('disabled', 'disabled');  // Disable the export PDF button
            $('#dropdownMenuButton').attr('disabled', 'disabled');  // Disable the dropdown menu button
        } else {
            $('#exportPDFBtn').removeAttr('disabled');  // Enable the export PDF button
            $('#dropdownMenuButton').removeAttr('disabled');  // Enable the dropdown menu button
        }
    }

    // Event handler for showing all holidays (public and church holidays) in the selected year
    $("#showAllHolidaysBtn").click(function() {
        window.location.href = "all_holidays_in_the_year.html?year=" + year;
    });

    // Function to calculate Easter date for the given year
    // Based on the Meeus/Jones/Butcher algorithm, as described on Wikipedia:
    // https://pl.wikipedia.org/wiki/Wielkanoc#Wyznaczanie_daty_Wielkanocy_w_danym_roku
    function getEaster(year) {
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

    // Calculate the date for Easter Monday based on the given year
    const easterMonday = getEaster(year);
    easterMonday.setDate(easterMonday.getDate() + 1);

    // Function to calculate Corpus Christi date for the given year
    function getCorpusChristi(year) {
        const easter = getEaster(year);
        const corpusChristi = new Date(easter.getTime());
        corpusChristi.setDate(easter.getDate() + 60);

        // Return a new Date object representing the Corpus Christi date for the given year
        return corpusChristi;
    }

    // Define an array of holiday objects for the given year
    const holidays = [
        // Public holidays
        { date: new Date(year, 4, 1), name: 'Labour Day', type: 'Public holiday' },
        { date: new Date(year, 4, 3), name: 'May 3rd Constitution Day', type: 'Public holiday' },
        { date: new Date(year, 10, 11), name: 'Independence Day', type: 'Public holiday' },
        // Church holidays
        { date: new Date(year, 0, 1), name: 'New Year', type: 'Church holiday' },
        { date: new Date(year, 0, 6), name: 'Feast of the Three Kings', type: 'Church holiday' },
        { date: getEaster(year), name: 'Easter', type: 'Church holiday' },
        { date: easterMonday, name: 'Easter Monday', type: 'Church holiday' },
        { date: getCorpusChristi(year), name: 'Corpus Christi', type: 'Church holiday' },
        { date: new Date(year, 7, 15), name: 'Assumption of Mary', type: 'Church holiday' },
        { date: new Date(year, 10, 1), name: 'All Saints\' Day', type: 'Church holiday' },
        { date: new Date(year, 11, 25), name: '1st day of Christmas', type: 'Church holiday' },
        { date: new Date(year, 11, 26), name: '2nd day of Christmas', type: 'Church holiday' }
    ];

    // Export selected days (days off) to a PDF file
    $('#exportPDFBtn').click(function() {
        // Assign the jsPDF library to the global window object
        window.jsPDF = window.jspdf.jsPDF;

        // Create a new jsPDF object
        const doc = new jsPDF();

        // Set up the table
        const headers = [["Your days off in " + year, "Day of the week"]];  // Add two header columns
        const rows = [];  // Create an empty array to store the rows of data for the PDF table

        // Iterate over each selected day in the list and retrieve day of the week of each date
        $('#selected-days li').each(function() {
            const date = $(this).text();  // Retrieve the date text from the list item
            const dayOfWeek = moment(date, 'DD-MM-YYYY').format('dddd');  // Get the day of the week for the date
            rows.push([date, dayOfWeek]);  // Add day of the week to each row
        });

        // Sort the rows based on the date using moment.js to have the selected days in ascending order in the PDF file
        rows.sort(function(a, b) {
            const dateA = moment(a[0], 'DD-MM-YYYY');  // Parse the date string in format DD-MM-YYYY using moment.js
            const dateB = moment(b[0], 'DD-MM-YYYY');
            return dateA - dateB;  // Compare the parsed dates for sorting
        });

        // AutoTable options
        const options = {
            head: headers,
            body: rows,
            theme: 'striped',
            headStyles: {
                fillColor: [0, 119, 204],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            bodyStyles: {
                lineWidth: 0.2,
                lineColor: 255,
                fontSize: 10
            },
            columnStyles: {
                0: { cellWidth: 50 }
            },
            tableWidth: 'wrap'
        };

        // Add the table to the PDF
        doc.autoTable(options);

        // Add the number of selected days
        const selectedDaysText = "Number of selected days: " + selectedDates.length;

        doc.setFontSize(10);  // Set the font size to 10

        const spaceFromBottom = 70;  // Fixed space from the bottom of the page
        const pageHeight = doc.internal.pageSize.height;  // Get the height of the page
        const textYCoordinate = pageHeight - spaceFromBottom;  // Calculate the Y-coordinate (vertical position) of the text

        doc.text(selectedDaysText, 14, textYCoordinate);  // Add the selectedDaysText to the PDF document at the specified coordinates (14 is the X-coordinate, horizontal position)

        const today_formatted_date = moment().format('DD-MM-YYYY');  // Get the current date and format it as DD-MM-YYYY
        const currentTime = moment().format('HH:mm:ss');  // Create a unique timestamp in the format HH:mm:ss for the file name
        const filename = `your_days_off_in_${year}-saved_${today_formatted_date}_${currentTime}.pdf`;  // Create the PDF file name by adding the current date, year, and a unique timestamp

        // Save the PDF
        doc.save(filename);
    });

    // Function for collecting unique dates selected by the user from Bootstrap Datepicker Calendar
    function getUniqueDates() {
        // Use Set to collect unique dates from the text content of list items
        const uniqueDates = [...new Set($('#selected-days li').map(function() {
            return $(this).text();
        }).get())];

        // Return the array of unique dates
        return uniqueDates;
    }

    // Function for exporting selected days off to the iCalendar format
    function exportToICalendar(type) {
        // Collect unique dates
        let selectedDates = getUniqueDates();

        // Create a calendar string
        let calendarString = "BEGIN:VCALENDAR\nVERSION:2.0\n";

        // Loop through selected dates and add events to the calendar string
        selectedDates.forEach(function(selectedDate) {
            // Calculate start date, end date, reminder date, and trigger for each selected date
            const startDate = moment(selectedDate, "DD-MM-YYYY").format('YYYYMMDD');
            const endDate = moment(selectedDate, "DD-MM-YYYY").add(1, 'days').format('YYYYMMDD');
            const reminderDate = moment(selectedDate, "DD-MM-YYYY").subtract(1, 'days').set('hour', 17).set('minute', 30).set('second', 0).format('YYYYMMDDTHHmmss');
            const trigger = moment(selectedDate, "DD-MM-YYYY").set('hour', 0).set('minute', 0).set('second', 0).diff(moment(reminderDate), 'minutes');
            // Add event details to the calendar string
            calendarString += "BEGIN:VEVENT\nDTSTART;VALUE=DATE:" + startDate + "\nDTEND;VALUE=DATE:" + endDate + "\nSUMMARY:Day Off\nBEGIN:VALARM\nACTION:DISPLAY\nDESCRIPTION:Reminder\nTRIGGER:-PT" + trigger + "M\nEND:VALARM\nEND:VEVENT\n";
        });

        // Add the closing tag for the iCalendar format to the calendar string
        calendarString += "END:VCALENDAR";

        // Get the current date formatted as DD-MM-YYYY
        const today_formatted_date = moment().format('DD-MM-YYYY');

        // Create a unique timestamp in the format HH:mm:ss for the file name
        const currentTime = moment().format('HH:mm:ss');

        // Create the iCalendar file name by adding the current date, year, and a unique timestamp
        const filename = `${type}-your_days_off_in_${year}-saved_${today_formatted_date}_${currentTime}.ics`;  // Create the ics file name by adding the current date, year, and a unique timestamp

        // Create a blob object from the calendar string
        const blob = new Blob([calendarString], {type: "text/calendar;charset=utf-8"});

        // Create a download link element
        const downloadLink = document.createElement("a");

        // Set the URL of the download link to the Blob object
        downloadLink.href = window.URL.createObjectURL(blob);

        // Set the filename for the download
        downloadLink.download = filename;

        // Append the download link to the document body
        document.body.appendChild(downloadLink);

        // Simulate a click on the download link to trigger the download
        downloadLink.click();

        // Remove the download link from the document body
        document.body.removeChild(downloadLink);
    }

    // Export selected days (days off) to Gmail (Google Calendar), in the iCalendar format
    $("#gmail-export").click(function() {
        exportToICalendar('gmail');
    });

    // Export selected days (days off) to Outlook (Outlook Calendar), in the iCalendar format
    $("#outlook-export").click(function() {
        exportToICalendar('outlook');
    });

});