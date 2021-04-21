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
            html += "<img class='mb-1 w-100 position-relative' src='" + movie.poster + "'>";
            html += "<h6>Director: " + movie.director + "</h6>";
            html += "<h6>Plot: " + movie.plot + "</h6>";
            html += "<h6> Actors: " + movie.actors + "</h6>"
            html += "</div></div>";
            $(".load-movies").append(html)
        }
    }
    displayEditMovies(movieList)
}

// generate options for edit movies dropdown based on DB entries
function displayEditMovies(movieList) {
    $("#editList").html("<option selected>Choose...</option>");
    for (movie of movieList) {
        let html = "";
        html = "<option value='" + movie.id + "'>" + movie.title + "</option>"
        $("#editList").append(html)
    }
}


$("#editList").on("change", function(){
    fetch(glitchUrl + `/${$('#editList').val()}`, get)
        .then(response => {
            response.json()
                .then(movie => {
                    $("#title").val(movie.title);
                    $("#rating").val(movie.rating);
                    $("#year").val(movie.year);
                    $("#genre").val(movie.genre);
                    $("#director").val(movie.director);
                    $("#plot").val(movie.plot);
                    $("#actors").val(movie.actors);
                    $("#poster").val(movie.poster);
            })
        })
})

// on save changes to edit movie change selected movie value and repopulate movie list with changes
$('#editMovie').click(function () {
    if ($('#delete').prop('checked')) {
        fetch(glitchUrl + `/${$('#editList').val()}`, {method: "DELETE",})
            .then(response => {
                fetch(glitchUrl, get)
                    .then(response => {
                        response.json()
                            .then(movieList => {
                                $(".load-movies").html("");
                                displayMovies(movieList)
                            })
                    })
            })
    } else {
        fetch(glitchUrl + `/${$('#editList').val()}`, get)
            .then(response => {
                response.json()
                    .then(movie => {
                        let editMovie = {};
                        $('.editElement').each(function () {
                            if ($(this).val().length !== 0) {
                                if (Object.keys(movie).includes($(this).attr('id'))) {
                                    let matchingKey = $(this).attr('id');
                                    editMovie[matchingKey] = $(this).val();
                                    let patch ={
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(editMovie)
                                    }
                                    fetch(glitchUrl + `/${$('#editList').val()}`, patch).then(function(response){
                                        console.log(response)
                                        fetch(glitchUrl, get)
                                            .then(response => {
                                                response.json()
                                                    .then(movieList => {
                                                        $(".load-movies").html("");
                                                        displayMovies(movieList)
                                                    })
                                            })
                                    })

                                }
                            }
                        })
                    })
            })
    }
})
// on save changes in add movie modal generate movieList with new entry
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

    // sending the new movie to DB
    fetch(glitchUrl, post)
        .then(response => {
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