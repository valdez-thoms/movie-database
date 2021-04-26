"use strict"

/*       FETCH RESPONSE VARIABLES GLITCH AND OMDB AND TRAILER ADDICT */
let omdbKey = ombdToken;
let omdbUrl = "http://www.omdbapi.com/?apikey="
let glitchUrl = "https://zenith-mature-adapter.glitch.me/movies";
let glitchGet = {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    },
};

let moviesToBeDisplayed = []
let genres = [];
let filteredMoviesToBeDisplayed = [];
getDatabase(glitchUrl, glitchGet);

//*********** GET TO LOAD FROM CURRENT DATABASE AND CALL DISPLAY**************//
function getDatabase(glitchUrl, get) {
    fetch(glitchUrl, get)
        .then(response => {
            response.json()
                .then(movieList => {
                    getUniqueGenres(movieList);
                    $(".load-movies").html("");
                    fillGenreWithMovies(movieList)
                    displayMovies(moviesToBeDisplayed)

                })
        })
}

// function to grab unique list of genres
function genreList(value, index, self) {
    return self.indexOf(value) === index
};

function getUniqueGenres(movieList) {
    genres = [];
    for (let movie of movieList) {
        genres.push(movie.genre);
    }
    genres = genres.join(',')
        .replace(/\s+/g, "")
        .split(",")
        .filter(genreList);
}

function fillGenreWithMovies(movieList) {
    let genreArray = [];
    moviesToBeDisplayed = [];
    for (let genre of genres) {
        let genreObject = {
            title: genre,
            movies: []
        }
        for (let movie of movieList) {
            if (movie.genre.includes(genre)) {
                genreObject.movies.push(movie)
            }
        }
        genreArray.push(genreObject);
    }
    moviesToBeDisplayed = genreArray;
}

//*********** SEARCHING EVENT **************//
let searchEntry = document.querySelector('#searchBar')
$('#searchBar').on('input', function (e) {
    e.preventDefault();
    let searchValue = searchEntry.value.toUpperCase()
    filteredMoviesToBeDisplayed = [];
    fetch(glitchUrl, glitchGet).then(
        response => {
            response.json().then(
                movieList => {
                    getUniqueGenres(movieList);
                    fillGenreWithMovies(movieList)
                    let matchingMovies = []
                    if (searchValue === "") {
                        $(".load-movies").html("");
                        displayMovies(moviesToBeDisplayed)
                    } else {
                        for (let genre of moviesToBeDisplayed) {
                            if (genre.title.toUpperCase().includes(searchValue)) {
                                filteredMoviesToBeDisplayed.push({
                                    title: genre.title,
                                    movies: genre.movies
                                })
                            }
                            for (let movie of genre.movies) {
                                if (movie.rating.toUpperCase().includes(searchValue) || movie.title.toUpperCase().includes(searchValue)) {
                                    matchingMovies.push(movie)
                                }
                            }
                            if (matchingMovies.length === 0) {
                                console.log("No Results")
                            }
                        }
                        matchingMovies = matchingMovies.filter(uniqueMovie)
                        filteredMoviesToBeDisplayed.unshift({
                            title: "Based on your search!",
                            movies: matchingMovies
                        })
                        console.log(filteredMoviesToBeDisplayed)
                        if (filteredMoviesToBeDisplayed[0].movies.length < 1) {
                            filteredMoviesToBeDisplayed.shift();
                        }
                        $(".load-movies").html("")
                        displayMovies(filteredMoviesToBeDisplayed);
                    }
                })
        })
})

// function to grab unique movie list from matchingMovies Variable
function uniqueMovie(value, index, self) {
    return self.indexOf(value) === index
};

//*********** USES LIST TO  DISPLAY MOVIES ONTO HTML **************//
function displayMovies(moviesToBeDisplayed) {
    for (let genre of moviesToBeDisplayed) {
        let movieHTML = ""
        let html;
        html = `<div class="${genre.title}-holder"><h1>${genre.title}</h1><div id="${genre.title}" class="genre-card row justify-content-start scrolling-wrapper d-flex flex-nowrap ">`
        for (let movie of genre.movies) {
            movieHTML += `<div id="${movie.id}" class="movie-card card m-1">
                         <a class="image card-image" href="#${genre.title}-${movie.title}">
                         <img class="imgMovie position-relative" src="${movie.poster}"  />
                         </a>
                         </div>`
        }
        html += movieHTML;
        html += `</div></div>`
        $(".load-movies").append(html)
    }
}

//*********** SORTING EVENTS **************//
//* ALL SORTS CAN BE USED DURING SEARCH TO MAINTAIN RESULTS *//

$("#sort10-1").click(function () {
    let sortSearchValue = searchEntry.value.toUpperCase();
    if (sortSearchValue === ""){
        fetch(glitchUrl, glitchGet)
            .then(response => {
                response.json()
                    .then(movieList => {
                        getUniqueGenres(movieList);
                        fillGenreWithMovies(movieList)
                        for (let genre of moviesToBeDisplayed) {
                            genre.movies.sort((a, b) => (a.rating > b.rating ? -1 : 1));
                        }
                        $(".load-movies").html("");
                        displayMovies(moviesToBeDisplayed);
                    })
            })
    }
    else {
        for (let genre of filteredMoviesToBeDisplayed){
            genre.movies.sort((a, b) => (a.rating > b.rating ? -1 : 1))
        }
        $(".load-movies").html("");
        displayMovies(filteredMoviesToBeDisplayed);
    }
})

$("#sort1-10").click(function () {
    let sortSearchValue = searchEntry.value.toUpperCase();
    if (sortSearchValue === ""){
        fetch(glitchUrl, glitchGet)
            .then(response => {
                response.json()
                    .then(movieList => {
                        getUniqueGenres(movieList);
                        fillGenreWithMovies(movieList)
                        for (let genre of moviesToBeDisplayed) {
                            genre.movies.sort((a, b) => (a.rating > b.rating ? 1 : -1));
                        }
                        $(".load-movies").html("");
                        displayMovies(moviesToBeDisplayed);
                    })
            })
    }
    else {
        for (let genre of filteredMoviesToBeDisplayed){
            genre.movies.sort((a, b) => (a.rating > b.rating ? 1 : -1))
        }
        $(".load-movies").html("");
        displayMovies(filteredMoviesToBeDisplayed);
    }
})

$("#sortA-Z").click(function () {
    let sortSearchValue = searchEntry.value.toUpperCase();
    if (sortSearchValue === ""){
        fetch(glitchUrl, glitchGet)
            .then(response => {
                response.json()
                    .then(movieList => {
                        getUniqueGenres(movieList);
                        fillGenreWithMovies(movieList)
                        for (let genre of moviesToBeDisplayed) {
                            genre.movies.sort((a, b) => (a.title > b.title ? 1 : -1));
                        }
                        $(".load-movies").html("");
                        displayMovies(moviesToBeDisplayed);
                    })
            })
    }
    else {
        for (let genre of filteredMoviesToBeDisplayed){
            genre.movies.sort((a, b) => (a.title > b.title ? 1 : -1))
        }
        $(".load-movies").html("");
        displayMovies(filteredMoviesToBeDisplayed);
    }
})

$("#sortZ-A").click(function () {
    let sortSearchValue = searchEntry.value.toUpperCase();
    if (sortSearchValue === ""){
        fetch(glitchUrl, glitchGet)
            .then(response => {
                response.json()
                    .then(movieList => {
                        getUniqueGenres(movieList);
                        fillGenreWithMovies(movieList)
                        for (let genre of moviesToBeDisplayed) {
                            genre.movies.sort((a, b) => (a.title > b.title ? -1 : 1));
                        }
                        $(".load-movies").html("");
                        displayMovies(moviesToBeDisplayed);
                    })
            })
    }
    else {
        for (let genre of filteredMoviesToBeDisplayed){
            genre.movies.sort((a, b) => (a.title > b.title ? -1 : 1))
        }
        $(".load-movies").html("");
        displayMovies(filteredMoviesToBeDisplayed);
    }
})

// ***** EVENT LISTENER IN MODAL FOR CLICK TO SAVE AND DISPLAY NEW MOVIE ********//

$('#formAdd').submit(function (e) {
    e.preventDefault();
    console.log("fuck you")
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
    console.log(newMovie)
        let glitchPost = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newMovie)
        };
        // sending the new movie to DB
        fetch(glitchUrl, glitchPost).then(
            response => {
                console.log(response)
                getDatabase(glitchUrl, glitchGet);
            });
        $("#add").modal('hide');

});






// GENRE CARD GENERATOR
//  BRING INITIAL MOVIE INFORMATION IN & STORE
// USE STORED INFORMATION TO GENERATE THE MOVIE GENRE LIST
// USE MOVIE GENRE LIST TO GENERATE GENRE CARDS FOR HTML
// DISPLAY CARDS TO HTML