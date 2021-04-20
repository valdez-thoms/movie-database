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

// initial fetch on page load
fetch(glitchUrl, options)
    .then(response => {
        response.json()
            .then(movieList => {
                $(".load-movies").html("");
                displayMovies(movieList)
            })
    })

// function to add each movie from promise to index.html
function displayMovies(movieList) {
    for (movie of movieList) {
        if (movie.title !== undefined && movie.rating !== undefined) {
            let html = "";
            html = "<div class='card'>"
            html += "<div className='card-body'>"
            html += "<h5 class='card-title '>" + movie.title + "</h5>";
            html += "<h6 class='card-subtitle'><ul>";
            html += "<li class='list-unstyled'>" + movie.rating + "</li>"
            html += "<li class='list-unstyled'>" + movie.year + "</li>"
            html += "<li class='list-unstyled'>" + movie.genre +"</li></h6>"
            html += "<img src='" + movie.poster + "'>";
            html += "<h6>" + movie.director + "</h6>";
            html += "<h6>" + movie.plot + "</h6>";
            html += "<h6>" + movie.actors + "</h6>"
            html +=   "</div></div>";
            $(".load-movies").append(html)
        }
    }
}
// $('#addMovie').on('shown.bs.modal', function () {
//     $('#myInput').trigger('focus')
// })
// $("#addMovie").click(function(){
//
// })