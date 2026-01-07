/**
 * autocompletest based on text typed in input box
 * @param {String} inp currently typed text
 * @param  {Array} arr possible text values
 * @param {Boolean} nameField true if processing name, false, if room
 **/
function autocomplete(inp, arr, nameField) {
    /* the autocomplete function takes two arguments,
            the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /* execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a,
            b,
            i,
            val = this.value;
        /* close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /* create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /* append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        count = 0;
        let lastOne = 0;
        /* for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /* check if the item starts with the same letters as the text field value:*/
            if (
                arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()
            ) {
                lastOne = i;
                count++;
                if (true || count != 1) {
                    /* create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    b.classList.add("name-in-list");
                    b.innerHTML =
                        "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    if(residents2[arr[i]] != undefined) 
                        b.innerHTML += "&nbsp;&nbsp;&nbsp;" + residents2[arr[i]];
                    /* insert an input field that will hold the current array item's value:*/
                    b.innerHTML +=
                        "<input type='hidden' value='" + arr[i] + "'>";

                    /* execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /* close the list of autocompleted values,
                            (or any other open lists of autocompleted values:*/
                        closeAllLists();
                        /** MY NEW CODE: */
                        if (
                            inp.id == "auto-room-input" ||
                            inp.id == "auto-room-input2" 
                        )
                            checkForName(inp.value);
                         if (
                            inp.id == "auto-name-input" ||
                            inp.id == "auto-name-input2" 
                        )
                            checkForRoom(inp.value);
                    });
                    a.appendChild(b);
                }
            }
        }
        //get rid of menu if down to one:
        //also, set name to last one (room is taken care of in listener)
        if (count == 1) {
            if (nameField) inp.value = arr[lastOne];
            a.remove();
        }
    });
    /* execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
                    increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) {
            //up
            /*If the arrow UP key is pressed,
                    decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
        //   if (!isresident && inp.id === "auto-room-input2")
        //     checkForName(document.getElementById("auto-room-input2").value);
    });

    /*** MY NEW CODE: */
    inp.addEventListener("keyup", function (e) {
        //visitor entering room number
        if (!isresident && inp.id === "auto-room-input2")
            checkForName(document.getElementById("auto-room-input2").value);
        if (isresident && inp.id === "auto-room-input")
            checkForName(document.getElementById("auto-room-input").value);
        
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
                except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
/**
 * returns the distance string s is from string t
 * @param {String} s first word
 * @param {String} t second weord
 * @returns
 */
const levenshteinDistance = (s, t) => {
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    const arr = [];
    for (let i = 0; i <= t.length; i++) {
        arr[i] = [i];
        for (let j = 1; j <= s.length; j++) {
            arr[i][j] =
                i === 0
                    ? j
                    : Math.min(
                          arr[i - 1][j] + 1,
                          arr[i][j - 1] + 1,
                          arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                      );
        }
    }
    return arr[t.length][s.length];
};

/**
 * disable buttons after user has selected choice
 * @param {Array} btnsIds
 */
function disableBtns(btnsIds) {
    btnsIds.forEach((element) => {
        document.getElementById(element).disabled = true;
    });
}
/**
 * Show button as selected and others as not selected
 * @param {String} id button to show as selected
 * @param {Array} others
 */
function selectedButton(id, others) {
    document.getElementById(id).style.color = "black";
    document.getElementById(id).style.borderWidth = "5px";

    others.forEach((element) => {
        document.getElementById(element).style.color = "white";
        document.getElementById(element).style.borderWidth = "1px";
    });
    //TODO: set others to regular
}
/**
 * Retursn value of the given id
 * @param {String} id
 * @returns
 */
function getEntry(id) {
    console.log(id)
    return document.getElementById(id).value;
}
/**
 * shows button with given id
 */
function show(id) {
        console.log("showing: " + id);

    document.getElementById(id).style.display = "block";
}

/**
 * hide given element
 */
function hide(id) {
    console.log("hiding: " + id)
    document.getElementById(id).style.display = "none";
}
/**
 * update current time and generate month and day names
 */
function updateDateTime() {
    today = new Date();

    let dayName = today.getDay(),
        dayNum = today.getDate(),
        month = today.getMonth(),
        year = today.getFullYear();

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const dayWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const IDCollection = ["day", "daynum", "month", "year"];

    const val = [dayWeek[dayName], months[month], dayNum, year];
    for (let i = 0; i < IDCollection.length; i++) {
        document.getElementById(IDCollection[i]).firstChild.nodeValue = val[i];
    }
}

function fade(element) {
    var op = 1; // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = "none";
        }
        element.style.opacity = op;
        element.style.filter = "alpha(opacity=" + op * 100 + ")";
        op -= op * 0.1;
    }, 200);
    setTimeout(function () {
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        };
   

        window.location.reload();
    }, 1700); // Reload after 1 second (matching transition duration)
}
function enc(text) {
    return text.substring(3) + text.substring(0, 3);
}

function decr(text) {
    return text.substring(text.length - 3) + text.substring(0, text.length - 3);
}
