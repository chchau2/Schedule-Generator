//click for the generate schedule
    //make the tables 
        //use the num weeks and start day to help make this table initally
        //then we need to populate the tables with the appropriate randomized scheduler
//click for the staffTable; want to make this like edit mode, so maybe we can make a function for it and just call that function when edit is clicked 
    //ALL WITHIN EDIT MODE

//START: constant objects and helper functions

//Object of working staff's colors. Should be used to populate table and edit mode?
const staffColors = {
    Natalie: '#9dc4de',
    Meg: '#e3863a',
    Christine: '#cb9fd3',
    Abraham: '#bb2222',
};

// Staff constraints
const staffRules = {
    Natalie: { requiredDays: 5, maxDays: 5, maxShiftsPerDay: 1 },
    Meg: { requiredDays: 5, maxDays: 5, maxShiftsPerDay: 1 },
    Christine: { minDays: 1, maxDays: 2, maxShiftsPerDay: 1 },
    Abraham: {minDays: 1, maxDays: 2, maxShiftsPerDay: 1,
      shiftPreferences: (day, isWeekend) => isWeekend ? ["day", "night"] : ["night"] //Abraham can work day and/or night on weekends, but NOT weekdays
    },
};

//used to shuffle/randomize the staff in order to generate the tables
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startOfWeekDate(randomDay) {
    const date = new Date(randomDay);
    const dayOfWeek = date.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 0 : dayOfWeek; // If it's Sunday (0), subtract 6 days; otherwise subtract (dayOfWeek - 1)
    date.setDate(date.getDate() - daysToSubtract);
    return date;
}
/*
// Parse days off from input into a Set 
function parseInput(inputId) {
    const input = document.getElementById(inputId).value.trim();
    return input.split(" ");
    //return new Set(input.split(" ").map(Number)); // Convert to a Set of day numbers

}*/


/*
*
*
*
*/
//START of the BIG functions

//making the table. we should call this within a loop of the totalNumWeeks, thus the parameter we have right now is just used to write the heading and assign name to this table
function makeTable(inputDate, weekNum) {
    const tableContainer = document.getElementById("finalTablesContainer"); //this will be the container of all tables
    const currTable = document.createElement('table');
    const daysNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
                dayCell.textContent = `${daysNames[j]} ${currentDate.getDate()}`; 
                dayCell.contentEditable = false;
            } else {
                //Make cells editable on double click
                dayCell.addEventListener('dblclick', function() {
                    if (dayCell.contentEditable === "true") {
                        dayCell.contentEditable = "false";  // Disable editing
                    } else {
                        dayCell.contentEditable = "true";   // Enable editing
                    }
                });
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

    // Trigger randomize schedule for each new table generated
    //randomizeSchedule(weekTable); //NEED TO ADD THIS
}

let isEditMode = false; // Track if edit mode is active
let wantedColor = 'white'; // Default color
let hkcolor = '#rgb(243, 243, 97)'; //#f3f361


//idea: all the stuff for when we click on the generate schedule button
document.getElementById("generateScheduleButton").addEventListener("click", function() {
    const startDateInput = document.getElementById('startDate').value;
    const numWeeks = document.getElementById('numWeeks').value;

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
 
    // Event listener for the "Edit Schedule" button
    document.getElementById("editScheduleButton").addEventListener('click', function() {
        isEditMode = !isEditMode;

        if (isEditMode) {  
            // Grabs staffs colors from table on click in order to transfer to the finalTable
            document.getElementById('staffTable').addEventListener('click', function(event) {
                wantedColor = event.target.style.backgroundColor; // Get the background color 
            });
            // Listen for clicks on the final tables container to apply the selected color
            document.getElementById('finalTablesContainer').addEventListener('click', function(event) {
                let clickedCell = event.target;
                // Only proceed if the clicked element is a <td> and has the class 'color-cell'
                //console.log(clickedCell.type);
                if (clickedCell.type == 'color-cell') {
                    // Apply the selected color to the clicked cell
                    clickedCell.style.backgroundColor = wantedColor;
                } else if (clickedCell.type == 'hk-cell') {
                    const currentColor = window.getComputedStyle(clickedCell).backgroundColor;
                    if (currentColor === 'rgb(243, 243, 97)') {
                        clickedCell.style.backgroundColor = 'white';
                    } else {
                        clickedCell.style.backgroundColor = '#f3f361';
                    }
                }
            });
        }
    });