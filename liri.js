require('dotenv').config()
let axios = require('axios');
let NSI = require('node-spotify-api');
let moment = require('moment');
let dotenv = require('dotenv');
let keys = require('./keys');
let spotify = new NSI(keys.spotify)

let command = process.argv[2].toLowerCase();
let input = process.argv[3]

switch (command) {
    case "concert":
        if (process.argv.length < 4) {
            return console.log("Please enter a band name for me to search.")
        };
        concertSearch(input);
        break;

    case "spotify":
        if (process.argv.length < 4) {
            input = "Feel Good Inc"
        };
        spotifySearch(input);
        break;

    case "movie":
        if (process.argv.lengh < 4) {
            input = "The Thing"
        };
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