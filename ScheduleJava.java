import java.util.*;

public class ScheduleJava {
    // Staff assignment tracking
    private static Map<String, List<Staff>> assignedStaff = new HashMap<>();
    
    // Initialize staff for each shift type
    private static List<Staff> dayShift = Arrays.asList(
        new Staff("Natalie", false, 0), 
        new Staff("Meg", false, 0), 
        new Staff("Christine", false, 0));
    
    private static List<Staff> nightShift = Arrays.asList(
        new Staff("Natalie", false, 0), 
        new Staff("Meg", false, 0), 
        new Staff("Christine", false, 0), 
        new Staff("Abraham", false, 0));
    
    public static void main(String[] args) {
        // Initialize assignedStaff map
        assignedStaff.put("dayShift", new ArrayList<>());
        assignedStaff.put("nightShift", new ArrayList<>());
        
        // Generate assignments for both shifts
        List<String> allAssignments = generateAssignmentsForShift();

        // Print out the weekly schedule table in console
        printWeeklySchedule(allAssignments);
    }

    public static void printWeeklySchedule(List<String> assignments) {
    // Define the days of the week
    String[] daysOfWeek = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
    
    // Print header for the table
    System.out.println("---------------------------------------------------");
    System.out.println(" Weekly Schedule (Day and Night Shifts) ");
    System.out.println("---------------------------------------------------");
    
    // Print table headers
    System.out.printf("%-15s %-15s %-15s%n", "Day", "Day Shift", "Night Shift");
    System.out.println("---------------------------------------------------");

    // Loop through each day and print the schedule
    for (int dayIndex = 0; dayIndex < 7; dayIndex++) {
        // Get the assigned person for day shift (even index) and night shift (odd index)
        String dayShiftPerson = assignments.get(dayIndex * 2);    // Day shift (even days in the list)
        String nightShiftPerson = assignments.get(dayIndex * 2 + 1);  // Night shift (odd days in the list)

        // Print the day and the assigned staff for both shifts
        System.out.printf("%-15s %-15s %-15s%n", 
                          daysOfWeek[dayIndex], 
                          dayShiftPerson != null ? dayShiftPerson : "None", 
                          nightShiftPerson != null ? nightShiftPerson : "None");
    }

    // Print a footer line for visual separation
    System.out.println("---------------------------------------------------");

}


   public static List<String> generateAssignmentsForShift() {
    List<String> assignments = new ArrayList<>(Arrays.asList(new String[14])); // Initialize week with null values
    Collections.fill(assignments, null); // Fill with null values
    
    //Set<Integer> assignedDays = new HashSet<>(); // Set to track assigned days to prevent duplicates

    // Select shift type
    List<Staff> shiftAssignmentsDay = new ArrayList<>(dayShift);;
    List<Staff> shiftAssignmentsNight = new ArrayList<>(nightShift);
    
    
    // Shuffle staff list to randomize order
    Collections.shuffle(shiftAssignmentsDay);
    Collections.shuffle(shiftAssignmentsNight);

    // Set to track who has been assigned to any shift for a given day
    Set<String> assignedStaffForDay = new HashSet<>();
    String shiftType = "day";
    Staff previousStaff = null;
    Staff currentStaff = null;
    // Loop over each day and assign day and night shifts sequentially
    for (int dayIndex = 0; dayIndex < 14; dayIndex++) {
        previousStaff = currentStaff;
        Collections.shuffle(shiftAssignmentsNight);

        // Loop through the staff for this shift and assign them to the day if they're not assigned already
        for (Staff staff : shiftAssignmentsNight) {
            // Ensure Natalie and Meg work exactly 5 days
            if (staff.name.equals("Natalie") || staff.name.equals("Meg")) {
                if (staff.daysAssigned < 5 && !assignedStaffForDay.contains(staff.name)) {
                    currentStaff = staff;
                    break;
                }
            }
            // Ensure Abraham and Christine only work 1-2 days
            else if (staff.name.equals("Christine") 
                    && staff.daysAssigned < 2 && !assignedStaffForDay.contains(staff.name)) {
                currentStaff = staff;
                break;
            }
            else if(staff.name.equals("Abraham") && staff.daysAssigned < 2 
                && !assignedStaffForDay.contains(staff.name) && (shiftType.equals("day") && (dayIndex == 0 || dayIndex == 1 || dayIndex == 13 || dayIndex == 14)))
            {
                currentStaff = staff;
                break;  
            }
            // For other staff, assign up to 2 days
            else if (staff.daysAssigned < 2 && !assignedStaffForDay.contains(staff.name)) {
                currentStaff = staff;
                break;
            }
        }

        if (currentStaff != null) {
            // Assign the selected staff to the shift for the day
            assignments.set(dayIndex, currentStaff.name);
            currentStaff.daysAssigned++;
            assignedStaffForDay.add(currentStaff.name);  // Mark that the staff has been assigned for this day

            // Add staff to the corresponding shift list
            if (shiftType.equals("day")) {
                assignedStaff.get("dayShift").add(currentStaff);
            } else {
                assignedStaff.get("nightShift").add(currentStaff);
            }
        } else {
            // If we couldn't assign a staff member to the shift, log an error
            System.out.println("Unable to assign staff to day " + dayIndex/2);
        }

        // Reset the daily tracker after each day
        if(dayIndex % 2 == 0)
            shiftType = "night";
        if(dayIndex % 2 == 1){
            assignedStaffForDay.clear();
            shiftType = "day";
        }
    }

    // If any staff hasn't been assigned their required number of days, we return an error
    for (Staff staff : shiftAssignmentsNight) {
        if (staff.name.equals("Natalie") || staff.name.equals("Meg")) {
            if (staff.daysAssigned != 5) {
                System.out.println("Error: " + staff.name + " did not get assigned exactly 5 days.");
            }
        } else if (staff.name.equals("Abraham") || staff.name.equals("Christine")) {
            if (staff.daysAssigned < 1 || staff.daysAssigned > 2) {
                System.out.println("Error: " + staff.name + " did not get assigned between 1 and 2 days.");
            }
        }
    }

    fixDuplicates(assignments);
    return assignments; // Return the final assignments list
}

    public static void fixDuplicates(List<String> assignments) {
        // Iterate through all the shifts in the assignments list
        for (int i = 0; i < assignments.size(); i++) {
            // Check for duplicates in the following shifts
            for (int j = i + 1; j < assignments.size(); j++) {
                if (assignments.get(i).equals(assignments.get(j))) {
                    // Duplicate found, swap the duplicate with a random valid shift
                    int randInd;
                    do {
                        // Generate a random even index to target valid shifts
                        randInd = (int)(Math.random() * (assignments.size() / 2)) * 2;
                    } while (assignments.get(randInd).equals(assignments.get(i)) 
                        || assignments.get(randInd + 1).equals(assignments.get(i)));

                    // Swap the duplicate with the random valid shift
                    String temp = assignments.get(randInd + 1);
                    assignments.set(randInd + 1, assignments.get(j));
                    assignments.set(j, temp);
                }
            }
        }
    }



    static class Staff {
        String name;
        boolean maxDays;
        int daysAssigned;

        public Staff(String name, boolean maxDays, int daysAssigned) {
            this.name = name;
            this.maxDays = maxDays;
            this.daysAssigned = daysAssigned;
        }

        @Override
        public String toString() {
            return name + " (" + daysAssigned + " days)";
        }
    }


}
