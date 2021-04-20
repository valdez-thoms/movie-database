// parameters neccessary for fetch stored in variables glitchURL and movies
let glitchUrl = "https://zenith-mature-adapter.glitch.me/movies";
let movies = "db.json"
let options = {
  method: 'GET',
  headers: {
    "Content-Type": "application/json" 
  },
  body: JSON.stringify(movies)
}

fetch(glitchUrl, options).then(response => console.log(response)).catch(error => console.error(error));