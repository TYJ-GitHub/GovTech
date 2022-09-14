const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const fetch = require("node-fetch");
const cors = require("cors")
const axios = require("axios");
const cheerio = require("cheerio");
const jsdom = require("jsdom");
const path = require("path");
const {JSDOM} = jsdom;

// GLOBAL.document = new JSDOM("http://localhost:3000/").window.document;
app.use(cors())
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")


var str = ''
let reverseGeoCode = (lat, long) => {
  return new Promise((resolve, reject) => {
    const apiKey = '';
    let geo_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`

    https.get(geo_url, function(response) {
      // console.log(response.statusCode);

      let geodata = "";
      //https://nodejs.org/docs/latest/api/http.html#http_http_get_options_callback
      response.on("data", function(chunk) {
        geodata += chunk;
      }); //response on data and do callback function
      response.on("end", function() {
        var route, neighborhood, country = "";
        addressDict = {};
        try {
          const geo_Data = JSON.parse(geodata); //convert hexadecimal data to js obj
          for (let i = 0; i < geo_Data.results.length; i++) {
            let parts = geo_Data.results[i].address_components; //init ports as array element
            parts.forEach(part => {
              if (part.types.includes("route")) { //for each part find if it includes a certain keyword
                route = part.long_name //get route name
                if (route != "undefined"){
                  addressDict["route"] = route;
                }
              }
              if (Object.keys(addressDict).length == 3) {
                return false;
              }
              if (part.types.includes("neighborhood")) { //for each part find if it includes a certain keyword
                neighborhood = part.long_name // get neighborhood name
                if (neighborhood != "undefined"){
                  addressDict["neighborhood"] = neighborhood;
                }
              }
              if (Object.keys(addressDict).length == 3) {
                return false;
              }
              if (part.types.includes("country")) { //for each part find if it includes a certain keyword
                country = part.long_name // get country name
                if (country != "undefined"){
                  addressDict["country"] = country;
                }
              }
              if (Object.keys(addressDict).length == 3) {
                return false;
              }
            })

          }
        } catch (e) {
          console.error(`Got error: ${e.message}`);
        }
        let showAddress = `${route}, ${neighborhood}, ${country}` // get full address name
        showAddress = showAddress.replace(/\s/g, "");
        resolve(showAddress)
      })

    });
  });
}

async function geoFunction(latlongArray, imageArray, dict) {
  var addPair = function(myKey, myValue) {
    dict[myKey] = myValue;
  };
  var giveValue = function(myKey) {
    return dict[myKey];
  };

  for (let i = 0; i < latlongArray.length; i++) {
    locAddress = await reverseGeoCode(latlongArray[i][0], latlongArray[i][1])
    if (Object.keys(dict).includes(locAddress)) {
      // dict.locAddress.push(image);
      giveValue(locAddress).push(imageArray[i])
    } else { // is not inside the dict
      var arr = []
      arr.push(imageArray[i])
      // dict[locAddress] = imageArray;
      addPair(locAddress, arr)
    }
  }

  // var str = ""
  // for (const key in dict) {
  //   spaceKey = key.replace(/([A-Z])/g, ' $1').trim();
  //   str += "<option>" + spaceKey + "</option>";
  // }
  return dict
}


// extended: true => allow to post extended obj
// bodyParser => parse http req
// urlencoded => get access to data
app.use(bodyParser.urlencoded({
  extended: true
}));

// grab static js css and images files
app.use(express.static("public"));

// upon request, response by sending index.html to server
app.get('/', function(req, res) {
  let locImageArray = "";
  res.render(__dirname + "/views/index.ejs", locImageArray); //can only send once
});

app.post("/", function(req, res) {
  const date = req.body.selecteddate;
  const time = req.body.selectedtime;

  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  var weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  var d = new Date(date);

  var dnum = d.getDay(),
    yyyy = d.getFullYear(),
    mm = d.getMonth(),
    dd = d.getDate()

  const dateSpan= weeks[dnum] + ", " + months[mm] + " " + dd.toString().padStart(2, '0') + ", " + yyyy
  var t = new Date("2000-01-01" + "T" + time);
  var hh = t.getHours(),
    mimi = t.getMinutes(),
    pp = "AM"

    if (hh == 0) { // situation where 0000 == 12.00 AM
      hh = 12;
    }
    if (hh > 12) { // changing 24 hours format to 12 hours format
      hh = hh - 12;
      pp = "PM"
    }
  const timeSpan = hh.toString().padStart(2, '0') + ": " + mimi.toString().padStart(2, '0') + " " + pp

  const data = {
    timestamp: date + "T" + time + ":00"
  }

  const traffic_url = "https://api.data.gov.sg/v1/transport/traffic-images?date_time=" + date + "T" + time.slice(0, 2) + "%3A" + time.slice(3, 5) + "%3A00"

  https.get(traffic_url, function(response) { //get API url and do callback function
    // console.log(response.statusCode);

    let rawData = "";

    //https://nodejs.org/docs/latest/api/http.html#http_http_get_options_callback
    response.on("data", function(chunk) {
      rawData += chunk;
    }); //response on data and do callback function
    response.on("end", function() { //data events can be fired multiple times, so you have to collect all the data values and concatenate them together when the end event has fires
      try {
        var dict = {};
        var latlongArray = [];
        var imageArray = [];
        const trafficData = JSON.parse(rawData); //convert hexadecimal data to js obj
        const arrayLen = trafficData.items[0].cameras.length
        for (let i = 0; i < arrayLen; i++) {
          var latlong = [];
          latitude = trafficData.items[0].cameras[i].location.latitude;
          longtitude = trafficData.items[0].cameras[i].location.longitude;
          image = trafficData.items[0].cameras[i].image;
          latlong.push(latitude, longtitude)
          latlongArray.push(latlong)
          imageArray.push(image)
        }
        promise = geoFunction(latlongArray, imageArray, dict);
        promise.then(function(result) {
          arrayDict = [];
          keyArray = Object.keys(result)
          for (let i=0; i<Object.keys(result).length; i++){
            arrayDict.push({address: keyArray[i].replace(/([A-Z 0-9])/g, ' $1').trim(), imageArray: result[keyArray[i]]})
          }
          preRender = [{address: "Choose Location", imageArray: []}]
          res.render("index", {data: {date:date, time:time, datespan: dateSpan, timespan: timeSpan, locImageArray: arrayDict}})
        })

      } catch (e) {
        console.error(`Got error: ${e.message}`);
      }
    });
  });
});

app.listen(3000, function() {
  console.log("Server running on port 3000")
})
