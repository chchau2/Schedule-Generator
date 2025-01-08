//click for the generate schedule
    //make the tables 
        //use the num weeks and start day to help make this table initally
        //then we need to populate the tables with the appropriate randomized scheduler
//click for the staffTable; want to make this like edit mode, so maybe we can make a function for it and just call that function when edit is clicked 
    //ALL WITHIN EDIT MODE

//START: constant objects and helper functions

// Color of cells helper function
function checkColor(cell, staffName) {
    const color = staffColors[staffName] || 'white'; // Default to white if no color is defined
    cell.style.backgroundColor = color;  // Change the cell's background color
  }


// Object of working staff's colors. Should be used to populate table and edit mode?
const staffColors = {
    Natalie: '#9dc4de',
    Meg: '#e3863a',
    Christine: '#cb9fd3',
    Abraham: '#bb2222',
};

//color map of all the options on the stafftable, so user will know what they are clicking on
let colorMap = new Map();
colorMap.set("rgb(67, 24, 67)", "Chris");
colorMap.set("rgb(116, 203, 96)", "Janice");
colorMap.set("rgb(157, 196, 222)", "Natalie");
colorMap.set("rgb(227, 134, 58)", "Meg");
colorMap.set("rgb(203, 159, 211)", "Christine");
colorMap.set("rgb(187, 34, 34)", "Abraham");
colorMap.set("rgb(40, 53, 108)", "Vicki");
colorMap.set("rgb(243, 243, 97)", "HK");
colorMap.set("white", "CLEAR (White)");

// Staff constraints
const staffRules = {
    Natalie: { requiredDays: 5, maxDays: 5, maxShiftsPerDay: 1 },
    Meg: { requiredDays: 5, maxDays: 5, maxShiftsPerDay: 1 },
    Christine: { minDays: 1, maxDays: 2, maxShiftsPerDay: 1 },
    Abraham: {
        minDays: 1,
        maxDays: 2,
        maxShiftsPerDay: 1,
        shiftPreferences: (day, isWeekend) => isWeekend ? ["day", "night"] : ["night"]
    },
};

// Used to shuffle/randomize the staff in order to generate the tables
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Calculate the start of the week based on the input date. Finds the right date to put on Sundays
function startOfWeekDate(randomDay) {
    const date = new Date(randomDay);
    //day of the week (0 = Sunday, 1 = Monday...)
    const dayOfWeek = date.getDay();
    
    let offset;

    //if day of week is sunday, then no offset is needed
    if (dayOfWeek === 0) {
        offset = 0;
    } else {
        //else, set the offset correctly
        offset = dayOfWeek;
    }
    //find correct date number for sunday
    date.setDate(date.getDate() - offset);
    return date;
}

// Schedule generation logic (integrating the logic we discussed earlier)
function generateSchedule(startDate) {
    // Get the staff availability from input fields
    const staffAvailability = {
        Natalie: parseDaysOff("natalieHours"), // Example: Set of calendar dates (e.g., 1, 2, ...)
        Meg: parseDaysOff("megHours"),
        Christine: parseDaysOff("christineHours"),
        Abraham: parseDaysOff("abrahamHours"),
    };

    let schedule;
    while (true) {
        let isValid = true;
        schedule = Array(7).fill(null).map(() => ({ day: [], night: [] }));

        // Helper to check if a day is a weekend
        const isWeekend = (dayIndex) => dayIndex === 0 || dayIndex === 6;

        // Assign shifts for each day
        schedule.forEach((daySchedule, dayIndex) => {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + dayIndex); // Calculate actual date for the day
            const calendarDate = currentDate.getDate(); // Get the day of the month (1-31)

            // Shuffle staff names each day to randomize the order
            const staffNames = Object.keys(staffRules);
            shuffleArray(staffNames);

            for (const staffName of staffNames) {
                const rules = staffRules[staffName];

                // Check if staff member has reached their max allowed days
                const assignedDays = getAssignedDays(staffName, schedule);
                if (rules.maxDays && assignedDays >= rules.maxDays) continue;

                // Skip staff member if unavailable on the calendar date
                if (staffAvailability[staffName].has(calendarDate)) continue;

                let possibleShifts = ["day", "night"];
                if (rules.shiftPreferences) {
                    possibleShifts = rules.shiftPreferences(dayIndex, isWeekend(dayIndex));
                }

                // Assign shift if there's room
                for (const shift of possibleShifts) {
                    if (daySchedule[shift].length < 1) { // Only one person per shift
                        daySchedule[shift].push(staffName);
                        break;
                    }
                }
            }

            // Validate that all shifts are filled
            if (daySchedule.day.length === 0 || daySchedule.night.length === 0) {
                isValid = false; // Mark as invalid schedule
            }
        });

        // Break the loop if a valid schedule is generated
        if (isValid) break;
    }
    return schedule;
}

// Count assigned days
function getAssignedDays(staffName, schedule) {
    return schedule.reduce((count, daySchedule) =>
        count + (daySchedule.day.includes(staffName) + daySchedule.night.includes(staffName)), 0
    );
}

// Parse days off from input fields
function parseDaysOff(inputId) {
    const input = document.getElementById(inputId).value.trim();
    return new Set(input.split(" ").map(Number)); // Convert to a Set of day numbers
}

// Make table for each week
function makeTable(inputDate, weekNum) {
    const tableContainer = document.getElementById("finalTablesContainer"); // this will be the container of all tables
    const currTable = document.createElement('table');
    const daysNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Generate the schedule for the week
    const schedule = generateSchedule(inputDate);

    let currentDate = new Date(inputDate);

    const shifts = [' ', '9am - 5pm', 'HK', '1pm - 9pm', 'MID Shift', 'NOTES:', 'Janice', 'Chris'];

    for (let i = 0; i < shifts.length; i++) {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = shifts[i];
        row.appendChild(timeCell);

        for (let j = 0; j < 7; j++) {
            const dayCell = document.createElement('td');
            if (i === 0) {
                // Add the date to the first row (shift times) for each day
                dayCell.textContent = daysNames[j] + " " + currentDate.getDate(); 
                dayCell.contentEditable = false;
            } else {
                // Fill in the schedule with staff names for each shift
                if (i === 1) {
                    dayCell.textContent = schedule[j].day.join(", ");
                    schedule[j].day.forEach(staffName => checkColor(dayCell, staffName));
                } else if (i === 3) {
                    dayCell.textContent = schedule[j].night.join(", ");
                    schedule[j].night.forEach(staffName => checkColor(dayCell, staffName));
                }
                dayCell.textContent = null;
                //dayCell.contentEditable = true; bc this should be something which is in edit mode 
            }
            if (i == 1 || i ==3) {
                dayCell.type = 'color-cell';
            } else if (i == 2) {
                dayCell.type = 'hk-cell';
            } else {
                dayCell.type = 'empty-cell';
            }
            row.appendChild(dayCell);
            currentDate.setDate(currentDate.getDate() + 1); // Updates the dates
        }
        currTable.appendChild(row);
    }

    // Append the table to the container
    const weekTitle = document.createElement('h2');
    weekTitle.textContent = `Week ${weekNum}`;
    tableContainer.appendChild(weekTitle);
    tableContainer.appendChild(currTable);
}

function overTwoDaysOff() {
    let offDayMap = new Map();
    let returnVal = false;
    const form = document.getElementById('staffInput'); 
    const inputs = form.querySelectorAll('input'); 
    console.log("Form", form);
    console.log("inputs", inputs);
    
    inputs.forEach(input => {
        let currDayOff = Number(input.value);
        if (!offDayMap.has(currDayOff)) {
           offDayMap.set(currDayOff, 1); 
        } else {
            let prevNum = Number(offDayMap.get(currDayOff));
            console.log("key", currDayOff);
            console.log("count", prevNum);
            if (prevNum == 2 && currDayOff != 0) {
                alert(`dont have enough people for day ${currDayOff}`);
                returnVal = true;
                return true;
            } else {
                offDayMap.set(currDayOff, prevNum + 1);
            }
        }
    });
    return returnVal;
}



// Trigger schedule generation on button click
document.getElementById("generateScheduleButton").addEventListener("click", function () {
    const startDateInput = document.getElementById('startDate').value;
    const numWeeks = document.getElementById('numWeeks').value;
    if (overTwoDaysOff()) return;

    if ((startDateInput.length > 5 && startDateInput[startDateInput.length - 1] != " ") || Number(numWeeks) > 12 || Number(numWeeks) < 1) {
        alert("Please check your fomat for start date and the number of weeks.");
        return;
    }
    if (!startDateInput || !numWeeks) {
        alert("Please enter both the start date and the number of weeks.");
        return;
    }
    // Parse the start date input into MM/DD format
    const startDateArr = startDateInput.trim().split(" ");
    const month = parseInt(startDateArr[0], 10) - 1; // Month is 0-indexed
    const day = parseInt(startDateArr[1], 10);

    // Create a JavaScript Date object for the start date
    const year = new Date().getFullYear();
    let startDate = new Date(year, month, day);
    startDate = startOfWeekDate(startDate);

    // Clear previous schedule
    document.getElementById('finalTablesContainer').innerHTML = "";

    // Generate tables for the number of weeks specified
    for (let i = 0; i < numWeeks; i++) {
        const weekStartDate = new Date(startDate);
        weekStartDate.setDate(startDate.getDate() + (i * 7)); // Increment start date by 7 days per week
        makeTable(weekStartDate, i + 1);
    }
});

let isToggleOn = document.getElementById("toggleButton");
let staffTableClickListener;
let finalTablesClickListener;
let finalTablesClickListenerForWriting;
let isEditMode = false; // Track if edit mode is active
let hkcolor = '#rgb(243, 243, 97)'; //#f3f361
let wantedColor = ''; // Default color

isToggleOn.addEventListener('change', function() {
    isEditMode = isToggleOn.checked;
    staffTableClickListener = function(event) {
        if (!isEditMode) return;
        wantedColor = event.target.style.backgroundColor; // Get the background color 
        nameRelatingToTheColor = colorMap.get(wantedColor)
        document.getElementById("selected-color-text").textContent = `Selected Color: ${nameRelatingToTheColor}`;
    };
    finalTablesClickListener = function(event) {
        if (!isEditMode) return;
        let clickedCell = event.target;
        if (clickedCell.type == 'color-cell' && wantedColor != '') {
            clickedCell.style.backgroundColor = wantedColor;
        } else if (clickedCell.type == 'hk-cell') {
            const currentColor = window.getComputedStyle(clickedCell).backgroundColor;
            if (currentColor === 'rgb(243, 243, 97)') {
                clickedCell.style.backgroundColor = 'white';
            } else {
                clickedCell.style.backgroundColor = '#f3f361';
            }
        }
    };
    function disableEditing() {
        const cells = document.querySelectorAll('#finalTablesContainer td');
        const cellsToEdit = Array.from(cells).slice(8);
        //filtered = cellsToEdit.filter((_, index) => index % 8 !== 0);
        cellsToEdit.forEach(cell => {
            cell.contentEditable = false; // Disable content editing
        });
    }
    // Function to enable content editing on all cells
    function enableEditing() {
        const cells = document.querySelectorAll('#finalTablesContainer td');
        const cellsToEdit = Array.from(cells).slice(8);
        cellsToEdit.forEach(cell => {
            cell.contentEditable = true; // Enable content editing
        });
    }
    if (isEditMode) {
        document.getElementById('staffTable').addEventListener('click', staffTableClickListener)
        document.getElementById('finalTablesContainer').addEventListener('click', finalTablesClickListener);
        enableEditing();
    } else {
        document.getElementById("staffTable").removeEventListener('click', staffTableClickListener);
        document.getElementById("finalTablesContainer").removeEventListener('click', finalTablesClickListener);
        disableEditing();
      return;
    }})