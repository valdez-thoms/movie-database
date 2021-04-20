// parameters neccessary for fetch stored in variables glitchURL and movies
let glitchUrl = "https://zenith-mature-adapter.glitch.me/movies";

// get for fetch
let get = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
    };


// initial fetch on page load
fetch(glitchUrl, get)
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
            html = "<div class='card col-4 my-2'>"
            html += "<div class='card-body'>"
            html += "<h5 class='card-title '>" + movie.title + "</h5>";
            html += "<h6 class='card-subtitle'><ul>";
            html += "<li class='list-unstyled'>Rating: " + movie.rating + "</li>"
            html += "<li class='list-unstyled'>Year: " + movie.year + "</li>"
            html += "<li class='list-unstyled'>Genres: " + movie.genre + "</li></h6>"
            html += "<img class='mb-1' src='" + movie.poster + "'>";
            html += "<h6>Director: " + movie.director + "</h6>";
            html += "<h6>Plot: " + movie.plot + "</h6>";
            html += "<h6> Actors: " + movie.actors + "</h6>"
            html += "</div></div>";
            $(".load-movies").append(html)
        }
    }
    displayEditMovies(movieList)
}
function displayEditMovies(movieList){
    for (movie of movieList) {
            let html = "";
            html = "<option value='" + movie.id + "'>"+movie.title+"</option>"
            $("#editList").append(html)
    }
}

$('#saveNewMovie').click(function () {
    let newMovie = {
        title: $("#title").val(),
        rating: $("#rating").val(),
        year: $("#year").val(),
        genre: $("#genre").val(),
        director: $("#director").val(),
        plot: $("#plot").val(),
        actors: $("#actors").val(),
        poster: $("#poster").val()
    }
    // post for fetch
    let post = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newMovie)
    };
    fetch(glitchUrl, post)
        .then(response => { console.log(response)
            fetch(glitchUrl, get)
            .then(response => {
                response.json()
                    .then(movieList => {
                        $(".load-movies").html("");
                        displayMovies(movieList)
                    })
            })
        })
});