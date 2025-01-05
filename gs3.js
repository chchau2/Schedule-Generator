// schedule.js

let selectedColor = null;

// Function to make the table dynamic
function makeTable(weekNumber, startDate) {
    const tableContainer = document.getElementById('scheduleContainer');
    const weekTable = document.createElement('table');
    const tableHeaderRow = document.createElement('tr');
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Create header for the days of the week
    const headerCell = document.createElement('th');
    weekTable.appendChild(tableHeaderRow);
    tableHeaderRow.appendChild(headerCell); // Empty cell for the shift names
    dayNames.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        tableHeaderRow.appendChild(th);
    });

    // Calculate the start of the week and generate the dates for the header
    let currentDate = new Date(startDate);

    // Add rows for each staff shift (example: '9am - 5pm', etc.)
    const shifts = ['9am - 5pm', 'HK', '1pm - 9pm', 'MID Shift', 'NOTES:', 'Janice', 'Chris'];

    for (let i = 0; i < shifts.length; i++) {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = shifts[i];
        row.appendChild(timeCell);

        for (let j = 0; j < 7; j++) {
            const dayCell = document.createElement('td');
            if (i === 0) {
                // Add the date to the first row (shift times) for each day
                dayCell.textContent = `${dayNames[j]} ${currentDate.getDate()}`;
            }

            // Make cells editable
            dayCell.contentEditable = true;

            // Add click event for coloring cells
            dayCell.addEventListener('click', function() {
                if (selectedColor) {
                    dayCell.style.backgroundColor = selectedColor;
                }
            });

            // Add double-click for editing content
            dayCell.addEventListener('dblclick', function() {
                dayCell.contentEditable = true;
                dayCell.focus();
            });

            row.appendChild(dayCell);
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }

        weekTable.appendChild(row);
    }

    // Append the table to the container
    const weekTitle = document.createElement('h2');
    weekTitle.textContent = `Week ${weekNumber}`;
    tableContainer.appendChild(weekTitle);
    tableContainer.appendChild(weekTable);

    // Trigger randomize schedule for each new table generated
    randomizeSchedule(weekTable);
}

// Function to randomize schedule
function randomizeSchedule(table) {
    const rows = table.querySelectorAll('tr');
    
    // Array of staff colors (or any colors you prefer)
    const staffColors = ['#ffeb3b', '#2196f3', '#4caf50', '#ff5722', '#9c27b0', '#f44336', '#673ab7'];

    // Loop through all rows except the header row
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td');
        
        // Loop through each cell in the row (except for the first column which contains shift names)
        for (let j = 1; j < cells.length; j++) {
            const cell = cells[j];

            // Randomize content in editable cells
            const randomIndex = Math.floor(Math.random() * staffColors.length);
            const randomColor = staffColors[randomIndex];
            const randomStaffName = getRandomStaff(); // Get a random staff name

            // Apply random color and staff name (if the cell is not part of the shift header)
            cell.style.backgroundColor = randomColor;
            cell.textContent = randomStaffName;
        }
    }
}

// Get a random staff name
function getRandomStaff() {
    const staffNames = ['Chris', 'Janice', 'Natalie', 'Meg', 'Christine', 'Abraham', 'Vicki'];
    const randomIndex = Math.floor(Math.random() * staffNames.length);
    return staffNames[randomIndex];
}

// Event listener for button click to generate the schedule
document.getElementById('generateScheduleButton').addEventListener('click', function() {
    const startDateInput = document.getElementById('startDate').value;
    const numWeeks = document.getElementById('numWeeks').value;

    if (!startDateInput || !numWeeks) {
        alert("Please enter both the start date and the number of weeks.");
        return;
    }

    // Parse the start date input into MM/DD format
    const startDateArr = startDateInput.trim().split('/');
    const month = parseInt(startDateArr[0], 10) - 1; // Month is 0-indexed
    const day = parseInt(startDateArr[1], 10);

    // Create a JavaScript Date object for the start date
    const year = new Date().getFullYear();
    const startDate = new Date(year, month, day);

    // Clear previous schedule
    document.getElementById('scheduleContainer').innerHTML = "";

    // Generate tables for the number of weeks specified
    for (let i = 0; i < numWeeks; i++) {
        const weekStartDate = new Date(startDate);
        weekStartDate.setDate(startDate.getDate() + (i * 7)); // Increment start date by 7 days per week
        makeTable(i + 1, weekStartDate);
    }
});

// Event listener for selecting a color for the cells
document.getElementById('staffTable').addEventListener('click', function(event) {
    const cell = event.target;

    // Check if the clicked cell is a color cell and get its background color
    if (cell.classList.contains('color-cell')) {
        selectedColor = cell.style.backgroundColor;
        console.log("Selected color:", selectedColor); // For debugging
    }
});
