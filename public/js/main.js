// Live Clock JS Section
function updateClock() {
  var now = new Date();
  var dname = now.getDay(), //Get the weekday as a number (0-6)
    mon = now.getMonth(), //Get the month as a number (0-11)
    date = now.getDate(), //Get the day as a number (1-31)
    year = now.getFullYear(), //Get the year as a four digit number (yyyy)
    hou = now.getHours(), //Get the hour (0-23)
    min = now.getMinutes(), //Get the minute (0-59)
    sec = now.getSeconds(), //Get the second (0-59)
    pe = "AM"

  // condition to change between AM and PM
  // .getHours() Get the hour (0-23)
  if (hou == 0) { // situation where 0000 == 12.00 AM
    hou = 12;
  }

  if (hou > 12) { // changing 24 hours format to 12 hours format
    hou = hou - 12;
    pe = "PM"
  }

  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  // first day of the week (0) means "Sunday"
  var weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  var ids = ["dayname", "month", "daynum", "year", "hour", "minutes", "seconds", "period"]
  // date | hh | min | sec => dataType = int, convert to string
  // padStart() method pads the current string with another string (multiple times, if needed) until the resulting string reaches the given length.
  var values = [weeks[dname], months[mon], date.toString().padStart(2, '0'), year, hou.toString().padStart(2, '0'), min.toString().padStart(2, '0'), sec.toString().padStart(2, '0'), pe]

  for (var i = 0; i < ids.length; i++) {
    document.getElementById(ids[i]).firstChild.nodeValue = values[i] // apply values to all the span in HTML
  }
}

function initClock() {
  updateClock();
  window.setInterval("updateClock()", 1) //every millisecond update clock
}

// Date Time Picker Section
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
// first day of the week (0) means "Sunday"
var weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

let pickedDate = document.getElementById('pickedDate')
let pickedTime = document.getElementById('pickedTime')
var today = new Date();
var todayDate = today.getFullYear().toString() + "-" + (today.getMonth() + 1).toString().padStart(2, '0') + "-" + today.getDate().toString().padStart(2, '0')
var currentHour = today.getHours();
var currentMinute = today.getMinutes();
var currentTime = currentHour.toString().padStart(2, '0') + ":" + currentMinute.toString().padStart(2, '0')
var currentTimeNum = Number(today.getHours().toString().padStart(2, '0') + today.getMinutes().toString().padStart(2, '0'));
document.getElementById("pickedDate").setAttribute("max", todayDate); //init maxDate to be today

// document.getElementById("pickedDate").value = todayDate
// document.getElementById("pickedTime").value = currentTime
//init pickedDate and pickedTime to be current

pickedDate.addEventListener('change', (e) => {
  var input1 = document.getElementById("pickedDate").value;
  var d = new Date(input1);
  var dnum = d.getDay(),
    yyyy = d.getFullYear(),
    mm = d.getMonth(),
    dd = d.getDate()
  let pickedDateVal = e.target.value
  document.getElementById('pickedDateSelected').innerText = weeks[dnum] + ", " + months[mm] + " " + dd.toString().padStart(2, '0') + ", " + yyyy
})

pickedTime.addEventListener('change', (f) => {
  var date = document.getElementById("pickedDate").value;
  var input2 = document.getElementById("pickedTime").value;
  // var today = new Date();
  // var todayDate = today.getFullYear().toString() + "-" + (today.getMonth() + 1).toString().padStart(2, '0') + "-" + today.getDate().toString().padStart(2, '0')
  var ytdDate = today.getFullYear().toString() + "-" + (today.getMonth() + 1).toString().padStart(2, '0') + "-" + (today.getDate() - 1).toString().padStart(2, '0')
  var currentHour = today.getHours();
  var currentMinute = today.getMinutes();
  var currentTime = currentHour.toString().padStart(2, '0') + ":" + currentMinute.toString().padStart(2, '0')
  var currentTimeNum = Number(today.getHours().toString().padStart(2, '0') + today.getMinutes().toString().padStart(2, '0'));

  document.getElementById("pickedDate").setAttribute("max", todayDate); //init maxDate to be today

  if (date == "") { //if time is being picked first
    var d = new Date("2000-01-01" + "T" + input2);
    var hh = d.getHours(),
      mimi = d.getMinutes(),
      pp = "AM"
    var inputTimeNum = Number(hh.toString().padStart(2, '0') + mimi.toString().padStart(2, '0'))

    if (inputTimeNum > currentTimeNum) { //if time exceeded current time
      if (hh == 0) { // situation where 0000 == 12.00 AM
        hh = 12;
      }
      if (hh > 12) { // changing 24 hours format to 12 hours format
        hh = hh - 12;
        pp = "PM"
      }
      document.getElementById("pickedDate").setAttribute("max", ytdDate); //maximum date will be yesterday's date
      document.getElementById('pickedTimeSelected').innerText = hh.toString().padStart(2, '0') + ": " + mimi.toString().padStart(2, '0') + " " + pp
    } else { // else if time is still before current time
      document.getElementById("pickedDate").setAttribute("max", todayDate); //maximum date will be today's date
      document.getElementById('pickedTimeSelected').innerText = hh.toString().padStart(2, '0') + ": " + mimi.toString().padStart(2, '0') + " " + pp
    }
  } else { //if date is being picked first
    var d = new Date(date + "T" + input2);
    var hh = d.getHours(),
      mimi = d.getMinutes(),
      pp = "AM"
    var inputTimeNum = Number(hh.toString().padStart(2, '0') + mimi.toString().padStart(2, '0'))
    if (inputTimeNum > currentTimeNum) {
      document.getElementById("pickedDate").setAttribute("max", ytdDate); //maximum date will be yesterday's date
      document.getElementById('pickedTimeSelected').innerText = hh.toString().padStart(2, '0') + ": " + mimi.toString().padStart(2, '0') + " " + pp
    } else {
      document.getElementById("pickedDate").setAttribute("max", todayDate);
    }
    if (hh == 0) { // situation where 0000 == 12.00 AM
      hh = 12;
    }
    if (hh > 12) { // changing 24 hours format to 12 hours format
      hh = hh - 12;
      pp = "PM"
    }
    document.getElementById('pickedTimeSelected').innerText = hh.toString().padStart(2, '0') + ": " + mimi.toString().padStart(2, '0') + " " + pp
  }

  if (date == todayDate) { //if today's date is picked
    timeNow = currentTime;
    if (inputTimeNum > currentTimeNum) {
      document.getElementById("pickedTime").setAttribute("max", timeNow);
      document.getElementById("pickedTime").value = timeNow;
      // condition to change between AM and PM
      // .getHours() Get the hour (0-23)
      if (currentHour == 0) { // situation where 0000 == 12.00 AM
        currentHour = 12;
      }
      if (currentHour > 12) { // changing 24 hours format to 12 hours format
        currentHour = currentHour - 12;
        pp = "PM"
      }
      document.getElementById('pickedTimeSelected').innerText = currentHour.toString().padStart(2, '0') + ": " + currentMinute.toString().padStart(2, '0') + " " + pp
    }
  } else {
    // condition to change between AM and PM
    // .getHours() Get the hour (0-23)
    if (hh == 0) { // situation where 0000 == 12.00 AM
      hh = 12;
    }
    if (hh > 12) { // changing 24 hours format to 12 hours format
      hh = hh - 12;
      pp = "PM"
    }

    let pickedTimeVal = f.target.value
    document.getElementById('pickedTimeSelected').innerText = hh.toString().padStart(2, '0') + ": " + mimi.toString().padStart(2, '0') + " " + pp
  }

})

const optionDisplay = document.getElementById("dropDownList")

// fetch("http://localhost:3000/.json")
// .then(response => response.json())
// .then(data => console.log(data))
