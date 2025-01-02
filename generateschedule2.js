// Fetch staff availability from input fields
const staffAvailability = {
  Natalie: parseDaysOff("natalieHours"),
  Meg: parseDaysOff("megHours"),
  Christine: parseDaysOff("christineHours"),
  Abraham: parseDaysOff("abrahamHours"),
};

// Parse days off from input
function parseDaysOff(inputId) {
  const input = document.getElementById(inputId).value.trim();
  return new Set(input.split(" ").map(Number)); // Convert to a Set of day numbers
}

// Staff constraints
const staffRules = {
  Natalie: { requiredDays: 5, maxShiftsPerDay: 1 },
  Meg: { requiredDays: 5, maxShiftsPerDay: 1 },
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

// Generate the schedule
function generateSchedule() {
  const schedule = Array(14).fill(null).map(() => ({ day: [], night: [] }));

  // Helper to check if a day is a weekend
  const isWeekend = (dayIndex) => dayIndex % 7 === 0 || dayIndex % 7 === 6;

  // Shuffle staff names before starting the schedule
  const staffNames = Object.keys(staffRules);
  shuffleArray(staffNames);  // Shuffle staff

  // Assign shifts for each day
  schedule.forEach((daySchedule, dayIndex) => {
    shuffleArray(staffNames);  // Shuffle staff
    for (const staffName of staffNames) { // Loop through shuffled staff names
      const rules = staffRules[staffName]; // Access staff rules by name
      if (rules.maxDays && rules.maxDays <= getAssignedDays(staffName, schedule)) continue;
      if (staffAvailability[staffName].has(dayIndex + 1)) continue; // Skip if not available

      let possibleShifts = ["day", "night"];
      if (rules.shiftPreferences) {
        possibleShifts = rules.shiftPreferences(dayIndex, isWeekend(dayIndex));
      }

      for (const shift of possibleShifts) {
        if (daySchedule[shift].length < 1) { // Only one person per shift
          daySchedule[shift].push(staffName);
          break;
        }
      }
    }
  });

  return schedule;
}

// Count assigned days
function getAssignedDays(staffName, schedule) {
  return schedule.reduce((count, daySchedule) => 
    count + (daySchedule.day.includes(staffName) || daySchedule.night.includes(staffName)), 0
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
  });
}

// Trigger schedule generation
document.getElementById("generateScheduleButton").addEventListener("click", () => {
  const schedule = generateSchedule();
  populateScheduleTable(schedule);
});
