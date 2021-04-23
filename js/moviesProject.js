//*********** GLOBAL VARIABLES **************//
let glitchUrl = "https://zenith-mature-adapter.glitch.me/movies";
let get = {
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    },
};
let genres = []
getDatabase(glitchUrl, get);

//*********** GET TO LOAD FROM CURRENT DATABASE AND CALL DISPLAY**************//
function getDatabase(glitchUrl, get) {
    fetch(glitchUrl, get)
        .then(response => {
            response.json()
                .then(movieList => {
                    $(".load-movies").html("");
                    displayMovies(movieList)
                })
        })
}

//*********** USES LIST TO  DISPLAY MOVIES ONTO HTML **************//
function displayMovies(movieList) {
    genres = [];
    for (movie of movieList) {
        genres.push(movie.genre);
        let html = "";
        // html = "<div class="genre"></div>"
        html += "<div id='" + movie.id + "' class='card d-flex flex-wrap col-4 my-2'>"
        html += "<div class='card-body'>"
        html += "<h5 class='card-title '><span>" + movie.title + "</span></h5>";
        html += "<h6 class='card-subtitle m-0'><ul class='p-0 row'>";
        html += "<li class='list-unstyled col-6'><span>Year:</span> " + movie.year + "</li>"
        html += "<li class='list-unstyled col-6'><span>Rating:</span> " + movie.rating + "/10</li></h6>"
        html += "<a class='image' href='#" + movie.id + "'><img class='imgMovie mb-1 w-100 position-relative' src='" + movie.poster + "'></a>";
        html += "<h6 class='hidden d-none list-unstyled'><span>Genres:</span> " + movie.genre + "</h6>"
        html += "<h6 class='hidden d-none'><span>Director:</span> " + movie.director + "</h6>";
        html += "<h6 class='hidden d-none'><span>Actors:</span> " + movie.actors + "</h6>"
        html += "<h6 class='hidden d-none'><span>Plot:</span> " + movie.plot + "</h6>";
        html += "</div></div>";
        $(".load-movies").append(html)
    }
    $("a").click(function () {
        $(this).parent().children().filter('.hidden').toggleClass('d-none');
    })
    generateSelectList(movieList);
}

$("#sortRatingHtoL").click(function () {
    fetch(glitchUrl, get)
        .then(response => {
            response.json()
                .then(movieList => {
                    let sorted = movieList.sort((a, b) => (a.rating > b.rating) ? -1 : 1);
                    $(".load-movies").html("");
                    displayMovies(sorted);
                })
        })
})
$("#sortRatingLtoH").click(function () {
    fetch(glitchUrl, get)
        .then(response => {
            response.json()
                .then(movieList => {
                    let sorted = movieList.sort((a, b) => (a.rating > b.rating) ? 1 : -1);
                    $(".load-movies").html("");
                    displayMovies(sorted);
                })
        })
})

$("#sortTitleAtoZ").click(function () {
    console.log("sort title")
    fetch(glitchUrl, get)
        .then(response => {
            response.json()
                .then(movieList => {
                    console.log(movieList)
                    let sorted = movieList.sort((a, b) => (a.title > b.title) ? 1 : -1);
                    console.log(sorted)
                    $(".load-movies").html("");
                    displayMovies(sorted);
                })
        })

})
$("#sortTitleZtoA").click(function () {
    console.log("sort title")
    fetch(glitchUrl, get)
        .then(response => {
            response.json()
                .then(movieList => {
                    console.log(movieList)
                    let sorted = movieList.sort((a, b) => (a.title > b.title) ? -1 : 1);
                    console.log(sorted)
                    $(".load-movies").html("");
                    displayMovies(sorted);
                })
        })

})
/// search submit button
// works but maybe use a modal to display the alert and confirmation
// $('#searchSubmit').click(function (e) {
//     e.preventDefault();
//     let searchValue = searchEntry.value.toLowerCase();
//     let movieCheck = false
//     $('.card-title').each(function() {
//         console.log($(this).text())
//         if ($(this).text().toLowerCase().includes(searchValue)) {
//             movieCheck = true
//         }
//     })
//     console.log(movieCheck)
//     if (movieCheck === false) {
//         searchValue = searchValue.replace(' ', "+");
//         fetch(movieURL + movieKey + searchValue, getMovie)
//             .then(response => response.json()
//                 .then(data => {
//                     // if (confirm(`Is ${data.Title} with a plot of "${data.Plot}", the movie you were looking for?`)) {
//                     //     if (confirm(`we havent added that movie yet!, would you like to add it now?`)) {
//                             $("#add").modal('show')
//                             $("#titleAdd").val(data.Title)
//                             $("#ratingAdd").val(data.imdbRating)
//                             $("#yearAdd").val(data.Year)
//                             $("#genreAdd").val(data.Genre)
//                             $("#directorAdd").val(data.Director)
//                             $("#plotAdd").val(data.Plot)
//                             $("#actorsAdd").val(data.Actors)
//                             $("#posterAdd").val(data.Poster)
//                     //     }
//                     // }
//                 }))
//     }
//
//
// })
//// search entry function
let searchEntry = document.querySelector('#searchBar')
$('#searchBar').on('input', function (e) {
    e.preventDefault();
    let searchValue = searchEntry.value.toUpperCase()
    let filteredMovies = [];
    fetch(glitchUrl, get).then(
        response => {
            response.json().then(
                movieList => {
                    for (movie of movieList) {
                        if (movie.rating.toUpperCase().includes(searchValue) || movie.genre.toUpperCase().includes(searchValue) || movie.title.toUpperCase().includes(searchValue)) {
                            filteredMovies.push(movie)
                        }
                    }
                    $(".load-movies").html("")
                    displayMovies(filteredMovies);
                })
        })
})
// ***** EVENT LISTENER GETS MOVIES FROM DB AND GENERATES THE MOVIES SORTED INTO GENRES ********//
$("#filterGenre").click(function () {
    fetch(glitchUrl, get)
        .then(response => {
            response.json()
                .then(movieList => {
                    genres = genres.join(',').replace(/\s+/g, '').split(',')
                    genres = genres.filter(genreList);
                    let genreArray = []
                    for (genre of genres) {
                        let genreObject = {
                            title: genre,
                            movies: []
                        }
                        for (movie of movieList) {
                            if (movie.genre.includes(genre)) {
                                genreObject.movies.push(movie)
                            }
                        }
                        genreArray.push(genreObject)
                        console.log(genreArray)
                    }
                    $(".load-movies").html("")
                    for (genre of genreArray) {
                        $(".load-movies").append(`<div id='${genre.title}' class="col-12 d-flex flex-wrap"><h1>${genre.title}</h1>`)
                        displayMovies(genre.movies)
                        $(".load-movies").append('</div>')
                    }
                })
        })
})

// function to grab unique list of genres
function genreList(value, index, self) {
    return self.indexOf(value) === index
};


//*********** GENERATES SELECT LIST ON EDIT MODAL **************//
function generateSelectList(movieList) {
    $("#editList").html("<option selected>Choose...</option>");
    for (movie of movieList) {
        let html = "";
        html = "<option value='" + movie.id + "'>" + movie.title + "</option>"
        $("#editList").append(html)
    }
}

//***** EVENT LISTENER GETS CURRENT DB MOVIE INFO TO POPULATE EDIT FIELDS FROM SELECT LIST SELECTION ********//
$("#editList").on("change", function () {
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

//***** BUTTON IN EDIT MODAL -  DISPLAY EDITED/DELETED MOVIES ********//
$('#editMovie').click(function () {
    if ($('#delete').prop('checked')) {
        fetch(glitchUrl + `/${$('#editList').val()}`, {method: "DELETE",})
            .then(response => {
                getDatabase(glitchUrl, get)
            })
    } else {
        //********** GRABS OLD MOVIE AND UPDATES MOVIE FROM PRE-POPULATED EDIT FIELDS AND SENDS TO DB
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
                                    let patch = {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(editMovie)
                                    }
                                    fetch(glitchUrl + `/${$('#editList').val()}`, patch).then(function (response) {
                                        getDatabase(glitchUrl, get)
                                        $("#title").val("");
                                        $("#rating").val("");
                                        $("#year").val("");
                                        $("#genre").val("");
                                        $("#director").val("");
                                        $("#plot").val("");
                                        $("#actors").val("");
                                        $("#poster").val("");
                                    })

                                }
                            }
                        })
                    })
            })
    }
})

//***** EVENT LISTENER IN MODAL FOR CLICK TO SAVE AND DISPLAY NEW MOVIE ********//
$('#saveNewMovie').click(function () {
    let newMovie = {
        title: $("#titleAdd").val(),
        rating: $("#ratingAdd").val(),
        year: $("#yearAdd").val(),
        genre: $("#genreAdd").val(),
        director: $("#directorAdd").val(),
        plot: $("#plotAdd").val(),
        actors: $("#actorsAdd").val(),
        poster: $("#posterAdd").val()
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
            getDatabase(glitchUrl, get)

        })
});



