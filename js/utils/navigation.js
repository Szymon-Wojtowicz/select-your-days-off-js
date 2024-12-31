/**
 * Utility functions for handling navigation within the application.
 * Includes URL parameter extraction and button event handling for page redirection.
 */

/**
 * Extracts the `year` parameter from the current page URL.
 *
 * @function getYearFromURL
 * @returns {number|null} - The year extracted from the URL as a number, or `null` if:
 *                          - The `year` parameter is not present in the URL.
 *                          - The `year` parameter is not a valid integer.
 *                          - The `year` parameter is `NaN` after parsing.
 *
 * @example
 * // URL: http://example.com?page=calendar&year=2024
 * const year = getYearFromURL(); // 2024
 *
 * // URL: http://example.com?page=calendar
 * const year = getYearFromURL(); // null
 */
export function getYearFromURL() {
    // Extracts the 'year' parameter from the URL query string, converts it to an integer in base 10, and assigns it to the 'year' variable
    const year = parseInt(new URLSearchParams(window.location.search).get('year'), 10);
    return isNaN(year) ? null : year; // Returns null if the extracted 'year' value is not a valid number; otherwise, returns the parsed year
}

/**
 * Configures the navigation on the page by attaching event listeners to buttons.
 *
 * This function dynamically creates links to pages such as "calendar" and "all holidays"
 * by embedding the provided `year` parameter into the URLs.
 *
 * @function setupNavigation
 * @param {number} year - The year to include as a parameter in navigation links.
 *                        Must be a valid integer representing a year (e.g., 2024).
 *
 * @returns {void} - This function does not return a value.
 *
 * @example
 * // Example usage:
 * setupNavigation(2024);
 *
 * // Result:
 * // - Clicking the "Back to the calendar" button navigates to `take_your_days_off.html?year=2024`.
 * // - Clicking the "Show all holidays" button navigates to `all_holidays_in_the_year.html?year=2024`.
 */
export function setupNavigation(year) {
    // Handle "Back to the calendar" button click event
    const backToCalendarButton = document.getElementById('back-to-calendar');
    if (backToCalendarButton) {
        backToCalendarButton.addEventListener('click', () => {
            const calendarPageURL = `take_your_days_off.html?year=${year}`;
            window.location.href = calendarPageURL;
        });
    }

    // Handle "Show all holidays" button click event
    const showAllHolidaysButton = document.getElementById('show-all-holidays-btn');
    if (showAllHolidaysButton) {
        showAllHolidaysButton.addEventListener('click', () => {
            const holidaysPageURL = `all_holidays_in_the_year.html?year=${year}`;
            window.location.href = holidaysPageURL;
        });
    }
}
