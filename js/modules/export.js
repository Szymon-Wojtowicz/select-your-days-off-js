/**
 * Exports selected days off to the iCalendar format as a downloadable file.
 *
 * @function exportToICalendar
 * @param {string} type - A string representing the type of export. It is used in the generated file name
 *                        (e.g., "gmail", "outlook").
 *
 * @returns {void} - This function triggers the download of an `.ics` file and does not return any value.
 *
 * @example
 * exportToICalendar("gmail");
 * // Downloads a file named `gmail-your_days_off_in_2024-saved_21-12-2024_14:30:45.ics`.
 */
export function exportToICalendar(type) {
    // Collect selected dates directly from the DOM (list #selected-days)
    let selectedDates = [];
    $('#selected-days li').each(function() {
        selectedDates.push($(this).text());
    });

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

    // Get the year from the first selected date (assuming all dates are from the same year)
    const selectedYear = moment(selectedDates[0], "DD-MM-YYYY").format('YYYY');

    // Get the current date formatted as DD-MM-YYYY
    const today_formatted_date = moment().format('DD-MM-YYYY');

    // Create a unique timestamp in the format HH:mm:ss for the file name
    const currentTime = moment().format('HH:mm:ss');

    // Create the iCalendar file name by adding the current date, year, and a unique timestamp
    const filename = `${type}-your_days_off_in_${selectedYear}-saved_${today_formatted_date}_${currentTime}.ics`;

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

/**
 * Exports selected days off to a PDF file.
 *
 * @function exportToPDF
 * @param {number} year - The year of the selected days.
 * @param {Array<string>} selectedDates - An array of selected dates in the `DD-MM-YYYY` format.
 *                                        Dates are included in the PDF along with their corresponding days of the week.
 *
 * @returns {void} - This function triggers the download of a `.pdf` file and does not return any value.
 *
 * @example
 * exportToPDF(2024, ["24-12-2024", "27-12-2024"]);
 * // Downloads a file named `your_days_off_in_2024-saved_21-12-2024_14_30_45.pdf`.
 */
export function exportToPDF(year, selectedDates) {
    // Assign the jsPDF library to the global window object
    window.jsPDF = window.jspdf.jsPDF;

    // Create a new jsPDF object
    const doc = new jsPDF();

    // Set up the table
    const headers = [["Your Days Off in " + year, "Day of the Week"]];  // Add two header columns
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
    const selectedDaysText = "Number of Selected Days: " + selectedDates.length;

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
}

/**
 * Exports a holiday list to a PDF document.
 *
 * @function exportHolidayListToPDF
 * @param {number} year - The year of the holidays.
 * @param {Array<Object>} holidays - An array of holiday objects. Each object should have the following properties:
 *                                    - `date` {string}: The date of the holiday in ISO format (e.g., "2024-12-25").
 *                                    - `name` {string}: The name of the holiday (e.g., "Christmas").
 *                                    - `type` {string}: The type of the holiday (e.g., "Public Holiday", "Church Holiday").
 *
 * @returns {void} - This function triggers the download of a `.pdf` file and does not return any value.
 *
 * @example
 * const holidays = [
 *     { date: "2024-11-11", name: "Independence Day", type: "Public Holiday" },
 *     { date: "2024-12-25", name: "1st day of Christmas", type: "Church Holiday" }
 * ];
 * exportHolidayListToPDF(2024, holidays);
 * // Downloads a file named `all_holidays_in_2024-saved_21-12-2024_14_30_45.pdf`.
 */
export function exportHolidayListToPDF(year, holidays) {
    // Assign the jsPDF library to the global window object
    window.jsPDF = window.jspdf.jsPDF;

    // Create a new jsPDF instance with 'portrait' orientation, 'pt' units, and 'a4' page size
    const doc = new jsPDF('p', 'pt', 'a4');

    // Define left and top margins
    const leftMargin = 40;
    const topMargin = 40;

    // The starting y-coordinate for adding text in the PDF document
    let startY = topMargin + 15; // Adjust to account for cap height of the font

    // Sort holidays by date
    holidays.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Set the font style to bold
    doc.setFont("Helvetica", "bold");

    // Set the font size to 15 points
    doc.setFontSize(15);

    // Add the title to the PDF document
    doc.text(`List of Holidays for the Year ${year}`, leftMargin, startY);

    // Increase the y-coordinate by 30 units to move to the next line for adding text in the PDF document
    startY += 30;

    // Set the font style to normal
    doc.setFont("Helvetica", "normal");

    // Iterate over each holiday and add it to the PDF document
    holidays.forEach((holiday, index) => {
        const { date, name, type } = holiday;

        // Ensure type is a string before comparing
        const holidayType = typeof type === 'string' ? type : '';

        // Set the text color based on the type of holiday
        if (holidayType  === 'Church Holiday') {
            doc.setTextColor(255, 0, 0); // Red for Church holidays
        } else if (holidayType  === 'Public Holiday') {
            doc.setTextColor(255, 165, 0); // Orange for Public holidays
        } else {
            doc.setTextColor(0, 0, 0); // Default color for other types
        }

        // Add the holiday information to the PDF document
        doc.setFont("Helvetica", "normal"); // Normal for position number
        doc.text(`${index + 1}.)`, leftMargin, startY); // Column: Position

        doc.setFont("Helvetica", "bold"); // Bold for name
        doc.text(`${name}`, leftMargin + 30, startY); // Column: Name

        doc.setFont("Helvetica", "italic"); // Italic for type
        doc.text(`- ${type} -`, leftMargin + 230, startY); // Column: Type

        doc.setFont("Helvetica", "bold"); // Bold for date
        doc.text(`${new Date(date).toDateString()}`, leftMargin + 380, startY); // Column: Date

        // Increase the y-coordinate by 30 units to move to the next line for adding the next holiday information in the PDF document
        startY += 30;
    });

    // Get the current date formatted as 'DD-MM-YYYY'
    const today_formatted_date = moment().format('DD-MM-YYYY');

    // Create a unique timestamp in the format HH:mm:ss for the file name
    const currentTime = moment().format('HH:mm:ss');

    // Create a filename for the PDF document
    const filename = `all_holidays_in_${year}-saved_${today_formatted_date}_${currentTime}.pdf`;

    // Save the PDF document with the specified filename
    doc.save(filename);
}
