// Import required modules for handling form validation, calendar setup, navigation
import { attachYearValidation } from './modules/formValidation.js';
import { initializeCalendar, getHolidays, checkSelectedDays } from './modules/calendar.js';
import { setupNavigation, getYearFromURL } from './utils/navigation.js';

// Wait for the DOM to fully load before initializing functionality
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.id; // Identify the type of page based on the ID of the <body> element

    // Initialize the appropriate functionality based on the page type
    switch (page) {
        case 'form':
            attachYearValidation(); // Enable year validation on the form page
            break;
        case 'take-your-days-off':
            handleTakeYourDaysOffPage(); // Initialize "Take Your Days Off" page functionality
            break;
        case 'all-holidays':
            handleAllHolidaysPage(); // Initialize "All Holidays" page functionality
            break;
        default:
            console.error('Unknown page type. Ensure body ID is set correctly.'); // Log error for unrecognized pages
    }
});

// Configure the "Take Your Days Off" page functionality
function handleTakeYourDaysOffPage() {
    const year = getYearFromURL(); // Extract the 'year' parameter from the URL query string, returning it as a number or null if invalid
    if (!year) {
        console.error('Year parameter is missing from the URL.'); // Stop further processing if the 'year' parameter is missing
        return;
    }

    const selectedDates = []; // Array to store selected days off
    const maxSelectableDays = 26; // Maximum days the user can select

    // Set the maximum number of days off dynamically in the HTML
    const maxDaysElement = document.getElementById('max-days');
    if (maxDaysElement) {
        maxDaysElement.textContent = String(maxSelectableDays);
    }

    const holidays = getHolidays(year); // Fetch the list of holidays for the specified year

    if (!isNaN(year)) {
        document.title = `Take Your Days Off in ${year}`; // Update the page title dynamically based on the selected year
    }

    // Set up the interactive calendar for selecting days off
    initializeCalendar(
        year,               // Year displayed in the calendar
        maxSelectableDays,  // Maximum number of selectable days
        holidays,           // Predefined church and public holidays to block from selection
        selectedDates,      // Array to store the selected days
        checkSelectedDays   // Callback to manage the state of uncheck and export buttons
    );

    checkSelectedDays(selectedDates); // Update the state of the buttons (enable/disable) based on whether any dates have been selected

    const exportDaysOffButton  = document.getElementById('export-days-off-pdf');
    if (exportDaysOffButton) {
        // Add an event listener to export selected days to a PDF
        exportDaysOffButton.addEventListener('click', () => {
            // Dynamically import the export module to optimize initial page load
            import('./modules/export.js').then(({ exportToPDF }) => {
                exportToPDF(year, selectedDates); // Generate and download a PDF with the selected days off for the given year
            }).catch(error => {
                console.error('Error loading the export module:', error); // Log any module loading errors
            });
        });
    }

    // References to buttons for exporting selected days to Gmail's or Outlook's calendars
    const gmailExportButton = document.getElementById('gmail-export');
    const outlookExportButton = document.getElementById('outlook-export');

    if (gmailExportButton) {
        gmailExportButton.addEventListener('click', () => {
            // Dynamically import the export module and call the function to export selected days to Gmail's calendar
            import('./modules/export.js')
                .then(({ exportToICalendar }) => {
                    exportToICalendar('gmail'); // Generate and download an ICS file for Gmail's calendar
                })
                .catch(error => {
                    console.error('Error loading exportToICalendar for Gmail:', error); // Log errors during module loading or execution
                });
        });
    }

    if (outlookExportButton) {
        outlookExportButton.addEventListener('click', () => {
            // Dynamically import the export module and call the function to export selected days to Outlook's calendar
            import('./modules/export.js')
                .then(({ exportToICalendar }) => {
                    exportToICalendar('outlook'); // Generate and download an ICS file for Outlook's calendar
                })
                .catch(error => {
                    console.error('Error loading exportToICalendar for Outlook:', error); // Log errors during module loading or execution
                });
        });
    }

    setupNavigation(year); // Set up navigation buttons and export options for the selected year
}

function handleAllHolidaysPage() {
    const year = getYearFromURL(); // Extract the 'year' parameter from the URL query string
    if (!year) {
        console.error('Year parameter is missing from the URL.'); // Stop further processing if the 'year' parameter is missing
        return;
    }

    const holidays = getHolidays(year); // Fetch the list of holidays for the specified year

    if (!isNaN(year)) {
        document.title = `Church and Public Holidays for the Year ${year}`; // Set dynamic page title
        const headerElement = document.getElementById('holidays-header');
        if (headerElement) {
            headerElement.textContent = `List of Holidays for the Year ${year}:`; // Set dynamic page header
        }
    }

    holidays.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort holidays by date in ascending order

    const holidaysElement = document.getElementById('holidays');
    holidaysElement.innerHTML = ''; // Clear previous holiday entries before rendering new ones

    // Add list header for better clarity
    const header = document.createElement('li');
    header.innerHTML = `
        <div class="holiday-item header">
            <span class="holiday-name">Holiday Name</span>
            <span class="holiday-type">Type</span>
            <span class="holiday-date">Date</span>
        </div>
    `;
    holidaysElement.appendChild(header);

    // Render each holiday in the list with appropriate formatting and CSS classes
    holidays.forEach(holiday => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="holiday-item">
                <span class="holiday-name">${holiday.name}</span>
                <span class="holiday-type">${holiday.type}</span>
                <span class="holiday-date">${holiday.date.toDateString()}</span>
            </div>
        `;
        li.className = holiday.type === 'Public Holiday' ? 'public-holiday' : 'church-holiday'; // Assign CSS class based on holiday type
        holidaysElement.appendChild(li);
    });

    const exportAllHolidaysButton = document.getElementById('export-all-holidays-to-pdf');
    exportAllHolidaysButton.addEventListener('click', () => {
        // Dynamically import the export module to handle PDF generation
        import('./modules/export.js')
            .then(({ exportHolidayListToPDF }) => {
                // Generate and download a PDF with all holidays (church and public) for the selected year
                exportHolidayListToPDF(year, holidays);
            })
            .catch(error => {
                // Log errors encountered during module import or PDF generation
                console.error('Error loading export module for PDF generation:', error);
            });
    });

    setupNavigation(year); // Set up navigation buttons and export options for the selected year
}
