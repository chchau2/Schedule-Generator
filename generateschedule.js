let staffMap = new Map();
let colorMap = new Map();

colorMap.set("chris", "#431843");
colorMap.set("janice", "#74cb60");
colorMap.set("natalie", "#9dc4de");
colorMap.set("meg", "#e3863a");
colorMap.set("christine", "#cb9fd3");
colorMap.set("abraham", "#bb2222");
colorMap.set("vicki", "#28356c");

function shuffleMap(map) { 
    let mapArray = Array.from(map.entries());
    // Shuffle the array using Fisher-Yates (Knuth) shuffle algorithm
    for (let i = mapArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mapArray[i], mapArray[j]] = [mapArray[j], mapArray[i]]; // Swap elements
    }
    // Convert the shuffled array back into a Map
    return new Map(mapArray);
} 

//makes the week tables using the numWeeks to see how many to make; this is based on which month it is
function makeWeekTables(month) {
    //ALL RAW COPIED AND PASTED FROM HTML FILE SO NEED TO FIX

    let currentDate = new Date();
        
        // Function to get the start of the current week (Sunday)
        function getStartOfWeek(date) {
            let day = date.getDay(),
                diff = date.getDate() - day; // Get the difference from Sunday
            return new Date(date.setDate(diff));
        }
        
        // Get the start of the current week (Sunday)
        let startOfWeek = getStartOfWeek(new Date(currentDate));
        
        // Define day names and the corresponding date numbers
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const tableHeaders = document.querySelectorAll("#toggleTable th");
        
        // Loop through the days of the week and set day names + date in the headers
        // forEach is an array method which helps iterate over the elements th (table headers) with index starting at 0
        tableHeaders.forEach((th, index) => {
            if (index > 0) { // Skip the first header (empty cell)
                let dayOffset = index - 1; // Index 1 corresponds to Sunday, 2 to Monday, etc.
                let dayDate = new Date(startOfWeek);
                dayDate.setDate(startOfWeek.getDate() + dayOffset); // Calculate the date for the current day
                
                // Create a variable with day name and date
                let dayHeader = `${dayNames[index - 1]} ${dayDate.getDate()}`;
                
                // Update the <th> with the generated variable
                th.textContent = dayHeader; // Insert the variable content into the <th>
            }
        });

    // Generate the table dynamically, meaning we dynamically make the table with cells
    const table = document.getElementById("");
    const rows = 7; // Number of rows
    const cols = 8; // Number of columns (14 * 14 = 196 cells)

   
    for (let i = 0; i < rows; i++) {
        const row = table.insertRow(); // Create a new row
        for (let j = 0; j < cols; j++) 
        {
            const cell = row.insertCell();
            //const cell = row.insertCell(); // Create a new cell
            if (i == 0 && j == 0) cell.textContent = '9am - 5pm';
            if (i == 1 && j == 0) cell.textContent = 'HK';
            if (i == 2 && j == 0) cell.textContent = '1pm - 9pm';
            if (i == 3 && j == 0) cell.textContent = 'MID Shift';
            if (i == 4 && j == 0) cell.textContent = 'NOTES:';
            if (i == 5 && j == 0) cell.textContent = 'Janice';
            if (i == 6 && j == 0) cell.textContent = 'Chris';
            if ((i == 0 || i == 2 || i == 3) && j != 0) cell.classList.add('empty-cell');
            if (i == 1) cell.addEventListener("click", () => {
                //makes clicking to add notes a bit weird, works but weird... but want to fix
                if (cell.style.backgroundColor == "yellow") {
                    cell.style.backgroundColor = "";
                } else {
                    cell.style.backgroundColor = "yellow"; // for Hk, but might not need if they can select the colors above
                }
                    
                });
            if (i > 3) {
                cell.onclick = function(){
                    makeCellEditable(this);
                };
            } else {
                cell.addEventListener("dblclick", function(){
                    makeCellEditable(this);
                });
            }
        } 
    
    } 
    
    function makeCellEditable(cell) {
        if(!cell.isEditable){ cell.contentEditable = true; }      
    }
}

function makeOneTable() {
    
}

document.getElementById("generateScheduleButton").onclick = function() {
    staffMap.set('chris', document.getElementById("chrisHours").value.trim().split(" "));
    staffMap.set('janice', document.getElementById("janiceHours").value.trim().split(" "));
    staffMap.set("nataile", document.getElementById("natalieHours").value.trim().split(" "));
    staffMap.set("meg", document.getElementById("megHours").value.trim().split(" "));
    staffMap.set("christine", document.getElementById("christineHours").value.trim().split(" "));
    staffMap.set("abraham", document.getElementById("abrahamHours").value.trim().split(" "));
    staffMap.set("vicki", document.getElementById("vickiHours").value.trim().split(" "));

    let shuffleStaffMap = shuffleMap(staffMap);
    //build the table based on this shuffle staffmap
    console.log(staffMap.values()); //for debugging
    console.log(shuffleMap(staffMap)); //for debugging
}