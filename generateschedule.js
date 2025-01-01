let staffMap = new Map();
let chrisNonWorkingDays;
let janiceNonWorkingDays;
let natalieNonWorkingDays;
let megNonWorkingDays;
let christineNonWorkingDays;
let abrahamNonWorkingDays;
let vickiNonWorkingDays;

document.getElementById("generateScheduleButton").onclick = function() {
    staffMap.set('chris', document.getElementById("chrisHours").value.trim().split(" "));
    staffMap.set('janice', document.getElementById("janiceHours").value.trim().split(" "));
    staffMap.set("nataile", document.getElementById("natalieHours").value.trim().split(" "));
    staffMap.set("meg", document.getElementById("megHours").value.trim().split(" "));
    staffMap.set("christine", document.getElementById("christineHours").value.trim().split(" "));
    staffMap.set("abraham", document.getElementById("abrahamHours").value.trim().split(" "));
    staffMap.set("vicki", document.getElementById("vickiHours").value.trim().split(" "));

    console.log(staffMap.values());
    


    // chrisNonWorkingDays = document.getElementById("chrisHours").value;
    // janiceNonWorkingDays = document.getElementById("janiceHours").value;
    // natalieNonWorkingDays = document.getElementById("natalieHours").value;
    // megNonWorkingDays = document.getElementById("megHours").value;
    // christineNonWorkingDays = document.getElementById("christineHours").value;
    // abrahamNonWorkingDays = document.getElementById("abrahamHours").value;
    // vickiNonWorkingDays = document.getElementById("vickiHours").value;

    // console.log(chrisNonWorkingDays);
    // console.log(janiceNonWorkingDays);
    // console.log(natalieNonWorkingDays);
    // console.log(megNonWorkingDays);
    // console.log(christineNonWorkingDays);
    // console.log(abrahamNonWorkingDays);
    // console.log(vickiNonWorkingDays);

}