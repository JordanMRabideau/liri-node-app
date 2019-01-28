require('dotenv').config()
let axios = require('axios');
let NSI = require('node-spotify-api');
let moment = require('moment');
let dotenv = require('dotenv');
let keys = require('./keys');
// let spotify = new spotify(keys.spotify)

let command = process.argv[2].toLowerCase();
let input = process.argv[3]

switch (command) {
    case "concert":
        concertSearch(input);
        break;
    case "spotify":
        spotifySearch(input);
        break;
    case "movie":
        movieSearch(input);
        break;
    case "default":
        displayDefault();
        break;
};

function concertSearch(artist) {
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function(response) {
            if (response.data.length > 0) {
                response.data.forEach(function(elem) {
                    console.log("Venue: " + elem.venue.name);
                    console.log("Location " + elem.venue.city + ", " + elem.venue.region + " " + elem.venue.country);
                    console.log("Date: " + moment(elem.datetime).format("MM/DD/YYYY"))
                    console.log("---------------------")
                });

            } else {
                console.log("Sorry, I couldn't find any information about that artist.");
            };
        }
    )
}