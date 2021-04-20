// parameters neccessary for fetch stored in variables glitchURL and movies
let glitchUrl = "https://zenith-mature-adapter.glitch.me/movies";
// let movies = "/db.json"
let options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
        // body: JSON.stringify(movies)
    }
;
fetch(glitchUrl, options)
    .then(response => {
        response.json()
        .then(movieList =>{
            $(".load-movies").html("");
            displayMovies(movieList)
    })
})

function displayMovies(movieList){
    // console.log(movieList[0].title);

    for (movie of movieList) {
        if (movie.title !== undefined && movie.rating !== undefined) {
        let html = "";
        html = "<h6>" + movie.title + "</h6>";
        html += "<h6>" + movie.rating + "</h6>";
        html += "<img src='" + movie.poster + "'>";
        html += "<h6>" + movie.year + "</h6>";
        html += "<h6>" + movie.genre + "</h6>";
        html += "<h6>" + movie.director + "</h6>";
        html += "<h6>" + movie.plot + "</h6>";
        html += "<h6>" + movie.actors + "</h6>";
        $(".load-movies").append(html)
    }

}




}