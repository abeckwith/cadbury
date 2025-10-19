let TESTING = false;

let today = "";
let displayTime = "";
let password = "123";
let signingIn = true;
let ismorningSideResident = true;
let isresident = false;
let isvisitor = false;
let isagency = false;
let fn = "";
let ln = "";
let name = "";
let howLongOut = "";
let whereGoing = "";
let visitorName = "";
let residentName = "";
let agencyName = "";
let responsibleParty = "";
let roomSaved = "";
let question = false;
let checkingOut = false;

function going(id, others) {
    whereGoing = id;
    show("how-long");
    selectedButton(id, others);
}
function howLong(id, others) {
    howLongOut = id;
    show("date-and-button");
    selectedButton(id, others);
}

function resident() {
    isresident = true;
    isvisitor = false;
    isagency = false;
    show("signin-form");
    disableBtns(["resbtn", "visbtn", "agbtn"]);
    selectedButton("resbtn", ["visbtn", "agbtn"]);
}
function visitor() {
    isresident = false;
    isvisitor = true;
    isagency = false;
    show("signin-form-vis");
    disableBtns(["resbtn", "visbtn", "agbtn"]);
    selectedButton("visbtn", ["resbtn", "agbtn"]);
}

function agency() {
    isresident = false;
    isvisitor = false;
    isagency = true;
    show("signin-form-vis");
    disableBtns(["resbtn", "visbtn", "agbtn"]);

    selectedButton("agbtn", ["resbtn", "visbtn"]);
}
function morningSide(isMorningside) {
    ismorningSideResident = isMorningside;
    if (isMorningside) {
        if (isresident) selectedButton("res-morn", ["res-assist"]);
        else selectedButton("vis-morn", ["vis-assist"]);
    } else {
        if (isresident) selectedButton("res-assist", ["vis-assist"]);
        else selectedButton("vis-assist", ["res-assist"]);
    }
}

/** called when morningside resident is checkng out */
function submitName1() {
    show("where-going-assist");
}
/**
 * called when visitor starts typing in last name box
 */
function submitName() {
    show("date-and-button");
    if (signingIn) {
        show("auto-name2");
        show("auto-room-input2");
        // show("room-button2");
    }
    if (isagency && signingIn) {
        show("agency-nm");
    }
}

function signIn() {
    signingIn = true;
    if (isresident) {
        selectedButton("signin-btn", ["signout-btn"]);
        disableBtns(["signin-btn", "signout-btn"]);
        show("auto-name");
        show("auto-room-input");
        show("auto-room");
    } else {
        selectedButton("signin-btn-vis", ["signout-btn-vis"]);
        disableBtns(["signin-btn-vis", "signout-btn-vis"]);
        show("name-entry");
    }
}
function signOut() {
    signingIn = false;

    if (isresident) {
        selectedButton("signout-btn", ["signin-btn"]);
        disableBtns(["signout-btn", "signin-btn"]);
        show("auto-room");
        show("auto-room-input");
        show("auto-name");
    } else {
        selectedButton("signout-btn-vis", ["signin-btn-vis"]);
        disableBtns(["signout-btn-vis", "signin-btn-vis"]);
        show("name-entry");
    }
}
function checkOutMorningside() {
    checkingOut = true;
    show("where-going-morn");
}
function notcheckOutMorningside() {
    checkingOut = false;
    hide("morningside-out");
}
function checkOutTrad() {
    checkingOut = true;
    show("where-going-assist");
}
function notcheckOutTrad() {
    checkingOut = false;
    hide("morningside-trad");
}
function checkForName(roomNum) {
    //morningside needs responsible party
    // if(isresident && !signingIn && roomNum.toUpperCase() in morningsideRooms){

    // }
    if (isresident && !signingIn) show("where-going-assist");
    if (isresident && signingIn) show("date-and-button");

    roomNum = roomNum.toUpperCase();
    roomSaved = roomNum;

    if (roomNum in residents && residents[roomNum] !== "") {
        document.getElementById("auto-name-input2").value = residents[roomNum];
        document.getElementById("auto-name-input").value = residents[roomNum];
    } else {
        document.getElementById("auto-name-input2").value = ""; //not found";
        document.getElementById("auto-name-input").value = ""; //not found";
    }
}

function submitRoom2() {
    room = getEntry("auto-room-input2").toUpperCase(); //so 'a' becomes 'A'
    console.log(residents[room]);
    if (room in residents && residents[room] !== "") {
        document.getElementById("auto-name-input2").value = residents[room];
    } else document.getElementById("auto-name-input2").value = "not found";
}

function printVersion() {
    //get start and end dates:
    startDate = document.getElementById("start-date").value;

    endDate = document.getElementById("end-date").value;
    if (startDate === "mm/dd/yyyy") startDate = endDate;
    startDate =
        startDate.substring(5, 7) +
        "/" +
        startDate.substring(8, 10) +
        "/" +
        startDate.substring(0, 4);
    endDate =
        endDate.substring(5, 7) +
        "/" +
        endDate.substring(8, 10) +
        "/" +
        endDate.substring(0, 4);
    if (endDate < startDate) alert("End must be after start date!");
    else {
        // hide("heading");
        // const tds = document.querySelectorAll("td");
        // const ths = document.querySelectorAll("th");
        logTable = document.getElementById("logtable");
        html = "<table id='logtable2'>";
        html +=
            "<tr>" +
            "<th>Visitor</th>" +
            "<th>Resident</th>" +
            "<th>Room</th>" +
            "<th>Type</th>" +
            "<th>Agency</th>" +
            "<th>Going</th>" +
            "<th>Hrs</th>" +
            "<th>ARRIVED</th>" +
            "<th>DEPARTED</th>" +
            "<th>Resp.Party</th>" +
            "</tr>";
        const rows = logTable.getElementsByTagName("tr");
        let filterDate = "";
        for (let i = 1; i < rows.length; i++) {
            // rows[i].getElementsByTagName("td").forEach(element => {
            //     // console.log(element.textContent)
            // });
            const arrDate = rows[i].getElementsByTagName("td")[7].textContent;
            const depDate = rows[i].getElementsByTagName("td")[8].textContent;
            // console.log(arrDate)
            // console.log(depDate)
            if (arrDate === "" || typeof arrDate === "undefined")
                filterDate = depDate;
            else filterDate = arrDate;

            // console.log(filterDate)
            filterDate = filterDate.substring(0, filterDate.indexOf(" "));
            if (filterDate.length == 9) filterDate = "0" + filterDate;
            if (filterDate <= endDate && filterDate >= startDate) {
                html += "<tr>";
                for (j = 0; j < 10; j++)
                    html +=
                        "<td>" +
                        rows[i].getElementsByTagName("td")[j].textContent +
                        "</td>";
                html += "</tr>";
            }
        }
        html += "</table>";

        hide("logtable");
        // logTable.style.width = "100%";
        document.getElementById("heading").innerHTML =
            html + "<a href='#' onclick='adminPage()'>BACK</a>";
        // ths.forEach((th) => {
        //     th.style.fontSize = "10px"; // Replace '16px' with desired font size
        //     th.style.backgroundColor = "white";
        //     th.style.color = "black";
        //     // th.style.width = "fit-content";
        // });
        // tds.forEach((td) => {
        //     td.style.fontSize = "10px"; // Replace '16px' with desired font size
        //     td.style.backgroundColor = "white";
        //     td.style.color = "black";
        // });
        downloadPDF(html);
        alert("The log for those dates has been downloaded to your device!");
        adminEmail = "info@cadburycommons.com";

        email =
            '<a href="mailto:' +
            adminEmail +
            "?subject=log%20from%20" +
            new Date().toLocaleDateString() +
            "&body=Select 'attach' and find Cadbury " +
            new Date().toLocaleDateString() +
            " in downloads" +
            '" target="_blank">EMAIL THE LOG</a>';
        document.getElementById("email").innerHTML = email;
    }
    // document.getElementById("logtable").style.fontSize = "10px";
}
/**
 * Gets data from local storage and builds table for log, sorted to most recent first
 *
 * @param {Array} data array of JSON objects for log
 */
let data2 = "";
function back() {
    window.location.href = "index.html";
}
function adminPage() {
    hide("logo");
    hide("login");
    hide("main");
    hide("start-over");
    hide("date-and-button");
    document.getElementById("heading").innerHTML =
        '<input onclick="seeLog()" type="button" class="visit-type-button" value="SEE LOG"><Br>' +
        ' <input onclick="editList()" type="button" class="visit-type-button" value="EDIT RESIDENCE LIST"><Br>' +
        ' <input onclick="editLog()" type="button" class="visit-type-button" value="EDIT LOG DATA"><Br>' +
        ' <input onclick="changePassword()" type="button" class="visit-type-button" value="CHANGE ADMIN PASSWORD"><Br><BR>' +
        '<input id="back-button" onclick="back()" type="button" class="visit-type-button" value="RETURN TO SIGN-IN PAGE"></input><Br>' +
        '<div id="edit-page"></div>';
}
function hash(pt) {
    ct = enc(pt)
;    return ct;
}
function unhash(ct){
    pt = decr(ct);
    return pt;
}
function changePassword() {
    done = false;
    while (!done) {
        p1 = prompt("Enter your new password (minimum 6 characters/no other restrictions):");
        if(p1 === null) done = true; //cancel button clicked
        else {
            if(p1.length <6) alert("Not enough characters (minimum of 6)!");
            else{
            p2 = prompt("Re-enter your new password:");
            if (p1 !== p2 && p2 !== null) alert("=== PASSWORDS DON'T MATCH ===");
            else done = true;
            if(p2 === null) done = true; //cancel button clicked
            }
        }
    }
    if (p1 === p2 && p1 !== null && p2 != null) {
        //if didn't cancel
        alert("Password SUCCESSFULLY CHANGED");
        hsh = hash(p1);
        localStorage.setItem("p", JSON.stringify(hsh));
    }
}
let editStatus = "";
function deleteRes(theKey) {
    editStatus = "delete";

    document.getElementById("conf-row" + theKey).style.backgroundColor =
        "powderblue";
    document.getElementById("conf-btn" + theKey).innerHTML =
        "Confirm Remove " + editDATA[theKey];
}
function changeRes(theKey) {
    editStatus = "change";
    newName = prompt(
        "ENTER THE NEW NAME OF THE RESIDENT IN ROOM " + theKey + ":"
    );

    document.getElementById("conf-row" + theKey).style.backgroundColor =
        "powderblue";
    document.getElementById("conf-btn" + theKey).innerHTML =
        "Confirm Changing " + editDATA[theKey] + " to " + newName;
}
function confirm(theKey) {
    if (editStatus === "delete") {
        editDATA[theKey] = "";
        localStorage.setItem("residents", JSON.stringify(editDATA));
        // alert("Resident has been removed from room");
        editList();
    }
    if (editStatus === "change") {
        editDATA[theKey] = newName;
        localStorage.setItem("residents", JSON.stringify(editDATA));
        // alert("Change has been made!");
        editList();
    }
}
function sort2DArrayAlphabetically(arr) {
    arr.sort((a, b) => {
        const firstElementA = a[0];
        const firstElementB = b[0];

        if (firstElementA < firstElementB) {
            return -1;
        }
        if (firstElementA > firstElementB) {
            return 1;
        }
        return 0;
    });
    return arr;
}
function cancel() {
    document.getElementById("finish-delete").innerHTML = "";
}
function deleteData() {
    d = data2["all"].sort(function (a, b) {
        return new Date(b.dateObject) - new Date(a.dateObject);
    });
    deleteDate = document.getElementById("start").value;
    count = 0;
    newData = [];
    for (let index = 0; index < d.length; index++) {
        const element = d[index];
        console.log(element.dateObject.substring(0, 10) + ", " + deleteDate);
        if (element.dateObject.substring(0, 10) >= deleteDate)
            newData.push(element);
    }
    allData = { all: newData }; //data to store back to local storage
    localStorage.setItem("log_data", JSON.stringify(allData));
}
function getDate() {
    d = data2["all"].sort(function (a, b) {
        return new Date(b.dateObject) - new Date(a.dateObject);
    });
    deleteDate = document.getElementById("start").value;
    count = 0;
    for (let index = 0; index < d.length; index++) {
        const element = d[index];
        if (element.dateObject.substring(0, 10) < deleteDate) count++;
    }
    html = "There are " + count + " entries before " + deleteDate;
    html +=
        "<br><b><span style='color:red'>CONFIRM DELETE " +
        count +
        " ENTRIES: </span></b> ";
    html += "<button onclick='deleteData()'>OK TO DELETE</button> ";
    html += "<button onclick='cancel()'>CANCEL</button>";
    document.getElementById("finish-delete").innerHTML = html;
}

/*
  name="trip-start"
  value="2018-07-22"
  min="2018-01-01"
  max="2018-12-31"
*/
function editLog() {
    //sorts so most recent is first:

    d = data2["all"].sort(function (a, b) {
        return new Date(b.dateObject) - new Date(a.dateObject);
    });
    if (d.length != 0) {
        // d.length;
        html =
            "<hr><b>EDITING LOG DATA:</b><br><Br>There are currently " +
            d.length +
            " log entries";
        html += "<br>OLDEST: " + d[d.length - 1].dateObject.substring(0, 10);
        html += "<br>NEWEST: " + d[0].dateObject.substring(0, 10);
        html +=
            '<Br><Br><label for="start">Delete log entries before </label>' +
            '<input type="date" id="start" name="start" min="" value="" />';
        html += "<button onclick='getDate()'>Find entries to delete</button>";
        html += "<div id='finish-delete'></div>";
    } else html = "No data to delete";
    document.getElementById("edit-page").innerHTML = html;
}

var editDATA;

function editList() {
    //load room/resident data from local storage
    editStatus = "";
    editDATA = JSON.parse(localStorage.getItem("residents"));
    rooms = Object.keys(editDATA);
    roomsAndNames = [];
    rooms.forEach((room) => {
        if (room.length === 3) room2 = room + "X";
        else room2 = room;
        roomsAndNames.push([room2, editDATA[room]]);
    });
    roomsAndNames = sort2DArrayAlphabetically(roomsAndNames);

    //show list
    html = "<table id='editlist'>";
    html += "<tr><th>ROOM</th><th>RESIDENT</th><th>ACTION</tr>";
    for (let index = 0; index < roomsAndNames.length; index++) {
        const person = roomsAndNames[index];
        key = person[0];
        if (key.charAt(3) === "X") key = key.substring(0, 3);

        btn1 =
            "<button onclick=\"deleteRes('" +
            key +
            '\')"  class="edit-btn">REMOVE</button>';
        btn2 =
            "<button onclick=\"changeRes('" +
            key +
            '\')" class="edit-btn">CHANGE</button>';
        btn3 =
            "<button id='conf-btn" +
            key +
            "' onclick=\"confirm('" +
            key +
            '\')" class="edit-btn">CONFIRM</button>';

        html +=
            "<tr id='conf-row" +
            key +
            "'><td>" +
            key +
            "</td><td>" +
            person[1] +
            "</td><td>" +
            btn1 +
            btn2 +
            btn3 +
            "</tr>";
    }
    html += "</table>";
    document.getElementById("edit-page").innerHTML = html;
    //options: add, delete, change

    //clear log entries - double check with alert()

    //add:
}
function downloadPDF(content) {
    const element = document.getElementById("content");
    html2pdf()
        .from(content)
        .save("Cadbury" + new Date().toLocaleDateString() + ".pdf");
}
function seeLog() {
    //sorts so most recent is first:
    d = data2["all"].sort(function (a, b) {
        return new Date(b.dateObject) - new Date(a.dateObject);
    });
    const today = new Date();
    const dateOnly = today.toISOString().slice(0, 10);
    //Table heading:
    document.getElementById("heading").innerHTML =
        "<a href='#' onclick='adminPage()'>RETURN TO ADMIN PAGE</a><Br> " +
        // '<input onclick="seeLog()" type="button" class="visit-type-button" value="SEE LOG">' +
        // ' <input onclick="editList()" type="button" class="visit-type-button" value="EDIT RESIDENCE LIST">' +
        "<BR><center><span id='print-menu'><b>PRINTABLE VERSION/Email PDF:</b> " +
        "Start Date: <input type='date' id='start-date' value='" +
        dateOnly +
        "'>&nbsp;&nbsp;" +
        "End Date: <input type='date' id='end-date' value='" +
        dateOnly +
        "'>&nbsp;&nbsp;" +
        "<a href='#' onclick='printVersion()'>MAKE PRINTABLE VERSION</a></span></center><br>";

    display =
        "<table id='logtable'>" +
        "<tr>" +
        "<th>Visitor</th>" +
        "<th>Resident</th>" +
        "<th>Room</th>" +
        "<th>Type</th>" +
        "<th>Agency</th>" +
        "<th>Going</th>" +
        "<th>Hrs</th>" +
        "<th>ARRIVED</th>" +
        "<th>DEPARTED</th>" +
        "<th>Resp.Party</th>" +
        "</tr>";
    display2 = "";
    //build table of info:
    d.forEach((logEntry) => {
        t = logEntry.timestamp;
        display += "<tr><td>" + logEntry.vName + "</td>";
        display += "<td>" + logEntry.rName + "</td>";
        display += "<td>" + logEntry.room + "</td>";
        display += "<td>" + logEntry.personType + "</td>";
        display += "<td>" + logEntry.agencyNm + "</td>";
        display += "<td>" + logEntry.whereGo + "</td>";
        display += "<td>" + logEntry.howLong + "</td>";
        display += "<td>" + logEntry.timeIn + "</td>";
        display += "<td>" + logEntry.timeOut + "</td>";
        display += "<td>" + logEntry.responsible + "</td>" + "</tr>";
    });
    show("main");

    document.getElementById("main").innerHTML =
        "<div id='email'></div>" + display + "</table></span>";
}
/**
 * used for hiding password characters
 */
function pwd() {
    var x = document.getElementById("pwdInput");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
/**
 * called from admin button - asks for password and calls admin
 */
function admin() {
    userP = getEntry("pwdInput");
    storedP = localStorage.getItem("p"); //unrailfance the cipher pwd
    // console.log(hash(userP)+ ", " + storedP);
    if (hash(userP) === storedP || "" + userP === "458829546") { //includes backup pwd
        //true || for testing
        var DATA = JSON.parse(localStorage.getItem("log_data"));
        data2 = DATA;

        adminPage();
    } else alert("Denied Access: INCORRECT PASSWORD");
}
/**
 * starts time and displays time
 */
function showTime() {
    displayTime = document.querySelector(".display-time");
    let time = new Date();
    if (displayTime != null)
        displayTime.innerHTML = time.toLocaleTimeString("en-US");
    setTimeout(showTime, 1000);
}

function reset() {
    window.location.reload();
}
/**
 * called onload - starts timer and updates display
 */
function start() {
    //FOR FIRST TIME RUNNING ON GIVEN DEVICE:
    //if no residents in local storage, take them from the .js file:
    if (localStorage.getItem("residents") === null)
        localStorage.setItem("residents", JSON.stringify(residents));

    //if no log data yet, set up the array:
    if (localStorage.getItem("log_data") === null) {
        defaultData = { all: [] };
        localStorage.setItem("log_data", JSON.stringify(defaultData));
    }

    hide("auto-room-input");
    //GET ALL RESIDENT NAMES FROM LOCAL STORAGE:
    var DATA = JSON.parse(localStorage.getItem("residents"));

    allData = [];
    for (i in DATA) {
        allData.push(DATA[i]);
    }

    autocomplete(document.getElementById("auto-name-input"), allData, true);
    autocomplete(document.getElementById("auto-name-input2"), allData, true);

    allAgencies = [];
    var DATA2 = JSON.parse(localStorage.getItem("log_data"));
    allData = DATA2["all"];
    for (let index = 0; index < allData.length; index++) {
        const element = allData[index];
        anm = element.agencyNm;
        if (typeof anm !== "undefined") allAgencies.push(anm);
    }
    autocomplete(document.getElementById("aname"), allAgencies, true);

    autocomplete(
        document.getElementById("auto-room-input"),
        cadburyRooms,
        false
    );
    autocomplete(
        document.getElementById("auto-room-input2"),
        cadburyRooms,
        false
    );
    showTime();
    updateDateTime();
    const inputField = document.getElementById("name");

    inputField.addEventListener("input", function (event) {
        const currentInput = event.target.value;
        submitName();
        // Perform actions based on the current input value
    });
}

/**
 * Checks if there is a value in the Entry and sets red if not
 */
function setStatus(thing, id) {
    if (thing === "") {
        document.getElementById(id).style.borderColor = "red";
        return false;
    }
    document.getElementById(id).style.borderColor = "black";

    return true;
}

/**
 * Called when submit button clicked
 * Gets all values from form and loads to local stoarge
 */
function submit() {
    if (isvisitor || isagency) {
        //check for existence visitor first and last and resident visiting:
        visitorName = getEntry("name");
        hasnm = setStatus(visitorName, "name");
        residentName = getEntry("auto-name-input2");
        hasresnm = setStatus(residentName, "auto-name-input2");
        agencyName = getEntry("aname");
        hasanm = setStatus(agencyName, "aname");
        if (
            (signingIn && !isagency && hasnm && hasresnm) ||
            (signingIn && isagency && hasnm && hasresnm && hasanm) ||
            (!signingIn && hasnm)
        ) {
            foundNm = checkAndSave(residentName, visitorName);
            //TODO: SAVE and check that name is right!!!!!!!!!!!
            if (foundNm) done();
        }
    } else {
        //RESIDENT
        residentName = getEntry("auto-name-input");
        hasresnm = setStatus(residentName, "auto-name-input");
        //TODO: SAVE (don't check name - okay if spell diff)
        if (hasresnm) {
            foundNm = checkAndSave(residentName, "");
            if (foundNm) done();
        }
    }
}
function done() {
    m = document.getElementById("msg");
    m.innerHTML = "THANK YOU!";
    fade(m);
}
function checkAndSave(residentName, visitorName) {
    residentName = residentName.trim().toUpperCase();
    visitorName = visitorName.trim().toUpperCase();

    if (isresident) personType = "Resident";
    else if (isvisitor) personType = "Visitor";
    else personType = "Agency";
    //visitor signing in OR resident signing out:
    if ((signingIn && !isresident) || (!signingIn && isresident)) {
        today = new Date();
        //format the date:
        const formattedDate = today.toLocaleDateString();
        const formattedTime = today.toLocaleTimeString();

        date = formattedDate + " " + formattedTime;
        if (signingIn) {
            //visitor signing in
            tIn = date;
            tOut = "";
        } else {
            //resident signing out
            tOut = date;
            tIn = "";
        }
        //make login object to save to array
        login = {
            rName: residentName, //resident name
            vName: visitorName, //name of visitor or ""
            room: roomSaved,
            personType: personType,
            dateObject: today,
            timeIn: tIn,
            timeOut: tOut,
            agencyNm: agencyName,
            responsible: responsibleParty,
            howLong: howLongOut,
            whereGo: whereGoing,
        };
        console.log(login);
        //get array from local storage
        var DATA = JSON.parse(localStorage.getItem("log_data"));

        //first login, or data has been cleared:
        if (DATA === null) {
            allData = { all: [] }; //data to store back to local storage
            allData["all"].push(login);
            localStorage.setItem("log_data", JSON.stringify(allData));
        } else {
            //add new data, write back to local storage:
            DATA["all"].push(login);
            localStorage.setItem("log_data", JSON.stringify(DATA));
        }
        return true;
    } //resident siging back in or visitor signing out
    else {
        //get local storage data and sort:
        var DATA = JSON.parse(localStorage.getItem("log_data"));
        allData = DATA["all"];
        allData = allData.sort(function (a, b) {
            //sorts so most recent is first
            return new Date(b.dateObject) - new Date(a.dateObject);
        });
        today = new Date();

        const formattedDate = today.toLocaleDateString();
        const formattedTime = today.toLocaleTimeString();
        date = formattedDate + " " + formattedTime;
        found = false;
        alreadySignedInOrOut = false;
        //resident is returning - find their name:
        if (isresident)
            for (let index = 0; index < allData.length; index++) {
                const entry = allData[index];
                rNameEntry = entry.rName.trim().toUpperCase();
                //FOUND!
                if (
                    !found &&
                    rNameEntry == residentName &&
                    entry.personType === "Resident"
                ) {
                    found = true;
                    if (allData[index]["timeIn"] == "") {
                        //save time left before saving back to local storage:
                        allData[index]["timeIn"] =
                            formattedDate + " " + formattedTime;
                        localStorage.setItem(
                            "log_data",
                            JSON.stringify({ all: allData })
                        );
                    } else {
                        alreadySignedInOrOut = true;
                        alert("Name found, but already signed in!");
                    }
                }
            }
        //visitor is leaving - find their name
        else
            for (let index = 0; index < allData.length; index++) {
                const entry = allData[index];
                vNameEntry = entry.vName.trim().toUpperCase();
                //FOUND!
                if (!found && vNameEntry == visitorName) {
                    found = true;
                    if (allData[index]["timeOut"] == "") {
                        //haven't checked out yet
                        console.log(594);
                        //mhaven't yet asked if taking out:
                        if (!question) {
                            question = true; //so second time it will skip this
                            //are they siging someone out?
                            if (
                                morningsideRooms.includes(
                                    entry.room.toUpperCase()
                                )
                            )
                                show("morningside-out");
                            else show("traditional-out");
                            return false;
                        }
                        //morningside - have already asked if taking out
                        else if (question) {
                            if (checkingOut) {
                                //they said YES
                                allData[index]["timeOut"] =
                                    formattedDate + " " + formattedTime;
                                localStorage.setItem(
                                    "log_data",
                                    JSON.stringify({ all: allData })
                                );

                                //CREATE 2nd OBJECT for M-SIDE RESIDENT
                                login = {
                                    rName: entry.rName, //resident name
                                    vName: "", //name of visitor or ""
                                    room: entry.room,
                                    personType: "Resident",
                                    dateObject: today,
                                    timeIn: "",
                                    timeOut: date,
                                    agencyNm: agencyName,
                                    responsible: visitorName,
                                    howLong: howLongOut,
                                    whereGo: whereGoing,
                                };
                                //get array from local storage
                                var DATA = JSON.parse(
                                    localStorage.getItem("log_data")
                                );

                                //first login, or data has been cleared:
                                if (DATA === null) {
                                    allData = { all: [] }; //data to store back to local storage
                                    allData["all"].push(login);
                                    localStorage.setItem(
                                        "log_data",
                                        JSON.stringify(allData)
                                    );
                                } else {
                                    //add new data, write back to local storage:
                                    DATA["all"].push(login);
                                    localStorage.setItem(
                                        "log_data",
                                        JSON.stringify(DATA)
                                    );
                                }
                            } else {
                                //regular save/no morningside checkout:
                                allData[index]["timeOut"] =
                                    formattedDate + " " + formattedTime;
                                localStorage.setItem(
                                    "log_data",
                                    JSON.stringify({ all: allData })
                                );
                            }
                        }
                    } else {
                        //already checked out - don't want to go back to previous sign in
                        alreadySignedInOrOut = true;
                        alert(
                            "Name found, but already signed out - have reception record for you by hand..."
                        );
                    }
                }
            }

        if (!found) {
            //find closest with Levenshtein and suggest best name:
            allData = DATA["all"]; //start with oldest so that newer will replace

            closeness = 10;
            for (let index = 0; index < allData.length; index++) {
                const entry = allData[index];

                if (!isresident) {
                    vNameEntry2 = entry.vName.trim().toLowerCase();
                    //look for  name match:

                    nmCloseness = levenshteinDistance(vNameEntry2, visitorName);
                    if (nmCloseness < closeness) {
                        closeness = nmCloseness;
                        best = vNameEntry2.toUpperCase();
                        found = true;
                    }
                } else {
                    rNameEntry = entry.rName.trim().toLowerCase();
                    //look for  name match:

                    nmCloseness = levenshteinDistance(rNameEntry, residentName);
                    if (nmCloseness < closeness) {
                        closeness = nmCloseness;
                        best = rNameEntry.toUpperCase();
                        found = true;
                    }
                }
            }
            if (found) alert("Name not found\n\nDid you mean " + best + "?");
            if (!found) alert("Name not found - please check your spelling");
            return false; //allows them to try again
        }
        if (!alreadySignedInOrOut) return true; //found and no problem
        else return false; //found, but need to try again because already signed out
    }
}
