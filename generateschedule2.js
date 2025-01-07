// Staff names and their respective colors
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
  Abraham: { 
    minDays: 1, 
    maxDays: 2, 
    maxShiftsPerDay: 1,
    shiftPreferences: (day, isWeekend) => isWeekend ? ["day", "night"] : ["night"]
  },
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

// Parse days off from input
function parseDaysOff(inputId) {
  const input = document.getElementById(inputId).value.trim();
  return new Set(input.split(" ").map(Number)); // Convert to a Set of day numbers
}

// Generate the schedule
function generateSchedule() {
  // Get today's date
  const today = new Date();

  // Calculate the first day of the schedule (start of the current week)
  const scheduleStartDate = new Date(today);
  scheduleStartDate.setDate(today.getDate() - today.getDay()); // Move to Sunday (start of the week)

  // Fetch staff availability from input fields
  const staffAvailability = {
    Natalie: parseDaysOff("natalieHours"), // Set of calendar dates (e.g., 1, 2, ...)
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
      // Calculate the actual calendar date for this day
      const currentDate = new Date(scheduleStartDate);
      currentDate.setDate(scheduleStartDate.getDate() + dayIndex); // Add dayIndex to start date
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

// Populate table with schedule
function populateScheduleTable(schedule) {
  const table = document.getElementById("toggleTable");

  // Iterate over each day (index represents the day)
  schedule.forEach((daySchedule, dayIndex) => {
    const dayCell = table.rows[0].cells[dayIndex + 1]; // First row is the header (skip it)
    const dayShiftCell = table.rows[1].cells[dayIndex + 1]; // Day shift cell for current day
    const nightShiftCell = table.rows[3].cells[dayIndex + 1]; // Night shift cell for current day

    dayShiftCell.textContent = daySchedule.day.join(", "); // Fill day shift for the day
    nightShiftCell.textContent = daySchedule.night.join(", "); // Fill night shift for the day
  
    checkColor(dayShiftCell);
    checkColor(nightShiftCell);

    dayShiftCell.textContent = null; // Get rid of names before displaying
    nightShiftCell.textContent = null; // Get rid of names before displaying
  });

}

function checkColor(cell)
{
  const staffName = cell.textContent.trim();  // Get the staff name from the cell text
  const color = staffColors[staffName] || 'white';// Default to white if no color is defined
  if (cell.textContent === staffName) {
    // Change the cell's background color
    cell.style.backgroundColor = color;
  }
}

// Trigger schedule generation
document.getElementById("generateScheduleButton").addEventListener("click", () => {
  const schedule = generateSchedule();
  populateScheduleTable(schedule);

});
