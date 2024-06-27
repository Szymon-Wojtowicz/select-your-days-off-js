# Select Your Days Off (JS) 

A web application for selecting and exporting days off using JavaScript, jQuery, jQuery UI, jsPDF, and moment.js.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Dependencies](#dependencies)

## Overview

This project provides a user-friendly web interface for selecting days off, visualizing them in a date picker, and exporting the selected days to a PDF file. It also supports exporting selected days in iCalendar format for Gmail and Outlook calendars.

## Features

- Date picker for selecting days off.
- The user can only choose days off except for church and public holidays in Poland.<!-- Użytkownik może wybrać tylko dni wolne poza świętami kościelnymi i państwowymi w Polsce. -->
- When the user hovers mouse over a day in the calendar that is a church or national holiday, it will be displayed in the tooltip the information about the name of the holiday and its type.<!-- Po najechaniu myszką przez użytkownika w kalendarzu na dzień będący świętem kościelnym lub państwowym, zostanie w tooltpie wyświetlona informacja o nazwie święta i jego rodzaju. -->  
- Export selected days to a PDF file.
- Export selected days in iCalendar format for Gmail and Outlook calendars.
- Holiday display functionality.
- Responsive and user-friendly design (using Twitter Bootstrap).

## Installation

1. Clone the repository:

   Open your terminal and run the following command to clone the repository:

    ```bash
    git clone https://github.com/Szymon-Wojtowicz/select-your-days-off-js.git
    ```
   
2. Open the application.

   Open `form.html` in your preferred web browser to start using the application.

## Usage

1. Access the application by opening `form.html` in a web browser. Enter a year between 1900 and 2099 in the form.
2. Select days off using the date picker. You can select max 26 days.
3. Use the `Uncheck all days` button to unselect all days which you checked earlier.
4. Use the `Export Days Off to PDF` button to generate a PDF file with selected days.
5. Use the `Export to Your calendar \ Gmail` and `Export to Your calendar \ Outlook` buttons to generate iCalendar files for Gmail and Outlook calendars.
6. Use the `Show all Church and Public Holidays in this Year` button to see complete list of public and church holidays for selected year. 
7. Use the `Export to PDF: List of Holidays for this Year` button to generate a PDF file with complete list of public and church holidays for selected year.

## Configuration

- The project is configured to use Twitter Bootstrap, jQuery, jQuery UI, Moment.js, jsPDF, jsPDF-AutoTable, iCalendar and FileSaver.

- The `holidays` array in `script.js` is updated with the corresponding holidays (their days) for the selected year.

## Dependencies

- [Twitter Bootstrap](https://getbootstrap.com/)
- [jQuery](https://jquery.com/)
- [jQuery UI](https://jqueryui.com/)
- [Moment.js](https://cdnjs.com/libraries/moment.js/2.29.1)
- [jsPDF](https://cdnjs.com/libraries/jspdf)
- [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- [iCalendar](https://github.com/nwcell/ics.js/)
- [FileSaver](https://cdnjs.com/libraries/FileSaver.js)
