// This block requires all of the neccesary modules 
require('dotenv').config()
let axios = require('axios');
let NSI = require('node-spotify-api');
let moment = require('moment');
let dotenv = require('dotenv');
let keys = require('./keys');
let fs = require('fs');
let spotify = new NSI(keys.spotify)

// Takes in the user's input of an operation and a search term
let command = process.argv[2].toLowerCase();
// Removes everyhting in the argument array before the search term, and joins the search term into a single string
let input = process.argv.slice(3).join(" ");

// Switch statement that determines the operation the user wants to run
switch (command) {

    // If the command is 'concert', and the user inputs a band name, the program will run concertSearch() with the input field as a parameter
    case "concert":
        if (!input) {
            return console.log("Please enter a band name for me to search.")
        };
        concertSearch(input);
        break;

    // If the command entered is 'spotify' the spotifySearch function will run with the input given. if an input
    // is not given, it will default to 'Feel Good Inc'
    case "spotify":
        if (!input) {
            input = "Feel Good Inc"
        };
        spotifySearch(input);
        break;

    // If the command entered is 'movie' the spotifySearch function will run with the input given. if an input
    // is not given, it will default to 'The Thing'
    case "movie":
        if (!input) {
            input = "The Thing"
        };
        movieSearch(input);
        break;
        
    // If the command enetered is 'default', the displayDefault() function is called.
    case "default":
        displayDefault();
        break;
};

// Function that calls the bandsintown API and returns concert data for a given band. If no results are found, an error message is logged.
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

// Function that calls the spotify API with the spotify node module. If songs are found, information about the first
// five songs will be logged to the console. If no songs are found, an error message will be logged.
function spotifySearch(song) {
    spotify.search({
        type: 'track',
        query: song
    }, function(err, data) {
        if (err) {
            return console.log("An error has occured: " + err)
        };

        if (data.tracks.items.length > 0) {
            for (let i = 0; i < 5; i++) {
                console.log("------------------------")
                console.log("Song name: " + data.tracks.items[i].name);
                console.log("Artist: " + data.tracks.items[i].artists[0].name)
                console.log("Album: " + data.tracks.items[i].album.name)
                console.log("Preview URL: " + data.tracks.items[i].preview_url)
            };
        } else {
            console.log("Sorry, I couldn't find any information about that song.")
        }
    })
};

function movieSearch(movie) {
    let queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"
    axios.get(queryUrl).then(
        function(response) {
            console.log(response.data.Response)
            if (response.data.Response == "True") {
                console.log("------------------------")
                // console.log(response)
                console.log("Movie Title: " + response.data.Title)
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                console.log("Year of release: " + response.data.Released);
                console.log("Country: " + response.data.Country);
                console.log("Language(s): " + response.data.Language);
                console.log("IMDB Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("------------------------");
            } else {
                console.log("Sorry, I couldn't find any information about that movie.")
            }
        }
    )
}

function displayDefault() {
    fs.readFile("./random.txt", "utf8", function(err, data) {
        if (err) {
            console.log(err)
        } else {
            let defaultArray = data.split(",");
            spotifySearch(defaultArray[1]);
        }
    })
}