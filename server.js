/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");
const axios = require("axios");

var port = process.env.PORT || 4000;

/*
 |--------------------------------------
 | App
 |--------------------------------------
 */

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined")); // Log HTTP requests
app.use(methodOverride("X-HTTP-Method-Override"));

/*
 |--------------------------------------
 | Routes
 |--------------------------------------
 */

const darkskyKey = process.env.DARKSKYKEY;
const googleKey = process.env.GOOGLE_KEY;

app.get("/api/weather/city/:city", (req, res) => {
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        req.params.city
      )}&key=${googleKey}`
    )
    .then(response => {
      var cityData = response.data.results[0];
      if (
        response.data.results.length > 0 &&
        (cityData.formatted_address.indexOf(req.params.city) >= 0 ||
          cityData.plus_code.compound_code.indexOf(req.params.city) >= 0)
      ) {
        var lat = cityData.geometry.location.lat;
        var lng = cityData.geometry.location.lng;

        return axios.get(
          `https://api.darksky.net/forecast/${darkskyKey}/${lat},${lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`
        );
      } else throw "CITY NOT FOUND";
    })
    .then(response => {
      res.send(JSON.stringify(response.data.currently));
    })
    .catch(error => {
      console.log(error);
      res.status(500);
      res.send(error);
    });
});

// Pass routing to React app
if (process.env.NODE_ENV !== "dev") {
  app.use(express.static(path.join(__dirname, "front-end", "build")));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "front-end", "build", "index.html"));
  });
}

/*
 |--------------------------------------
 | Server
 |--------------------------------------
 */

app.listen(port, () => {
  // process.env.PORT assigned by Heroku
  console.log(`Listening on port ${port}`);
});
