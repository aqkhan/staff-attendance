const fs = require("fs");
const neatCsv = require("neat-csv");

Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    return a.indexOf(i) < 0;
  });
};

const employeeIds = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13"
];

const getDate = csvDate => {
  let newDate = csvDate.split(" ");
  return newDate[0];
};

fs.readFile("./CHECKINOUT.csv", async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let userData = await neatCsv(data);
  let lateEmployees = [];
  let today = "";
  let newDay;
  let workingDays = [];
  let newDs = [];

  for (let i = 0; i < userData.length; i++) {
    if (userData[i].CHECKTYPE === "I") {
      userData[i].date = today;
      // So each employee should be
      // a) Present today
      // b) CHECKIN before 1:05 PM (13:05)

      // Should iterate date wise
      // Can create a boolean logic for switching between a new day
      if (today !== getDate(userData[i].CHECKTIME)) {
        // It's a new day at AlphaSquad
        today = getDate(userData[i].CHECKTIME);
        newDay = true;
        userData[i].date = today;
        workingDays.push(today);
      } else {
        newDay = false;
      }
    }
  }
  for (let i = 0; i < workingDays.length; i++) {
    let day = {};
    day.date = workingDays[i];
    let dayData = [];
    let lateEmployees = []
    // workingDays[i] is a day at AlphaSquad
    for (let j = 0; j < userData.length; j++) {
      if (workingDays[i] === userData[j].date && userData[j].CHECKTYPE === 'I') {
        dayData.push(userData[j].USERID);
        // Check for absent employees here
        newDay = new Date(workingDays[i] + ' ' + '13:10:00')
        // Check for late employees
        let checkInTime = new Date(userData[j].CHECKTIME)
        if(checkInTime > newDay) {
            lateEmployees.push(userData[j].USERID)
            // console.log(`Employee ${userData[j].USERID} is late on ${workingDays[i]}`)
        }
      }
    }
    day.lateEmployees = lateEmployees
    day.data = dayData
    newDs.push(day)
  }
  //console.table(newDs)

  // Absent employees
  for (i = 0; i < newDs.length; i++) {
    let absentEmployees = employeeIds.filter(x => !newDs[i].data.includes(x));
    //console.log(`Absent employees for ${newDs[i].date} are ${difference}`);
    //   console.log(newDs[i].data)
    newDs[i].absentEmployees = absentEmployees;
  }
  console.table(newDs);
});
