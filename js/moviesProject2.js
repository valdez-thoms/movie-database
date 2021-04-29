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
let deleteValue = "number";
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

// FILTER FOR UNIQUE GENRE LIST
function genreList(value, index, self) {
    return self.indexOf(value) === index
};

// GENERATES UNIQUE GENRE LIST
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

// FILLS GENRE LIST WITH MOVIES THAT INCLUDE THAT GENRE
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
                        searchValue = matchingMovies;
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
$("#searchSubmit").click(function (e) {
    e.preventDefault();
    let searchValue = searchEntry.value.toUpperCase();
    console.log(searchValue)
    let movieCheck = false;
    $('.movie-card img').each(function () {
        if ($(this).attr("id").toUpperCase().includes(searchValue)) {
            movieCheck = true
        }
    })
    if (movieCheck === false) {
        searchValue = searchValue.replace(' ', "+");
        fetch(omdbUrl + `${omdbKey}&t=${searchValue}`)
            .then(response => {
                response.json()
                    .then(omdbMovie => {
                        let {Actors, Director, Genre, Plot, Year, Poster, Title, imdbRating} = omdbMovie;
                        omdbMovie = {};
                        omdbMovie = {
                            title: Title,
                            year: Year,
                            rating: imdbRating,
                            genre: Genre,
                            director: Director,
                            actors: Actors,
                            plot: Plot,
                            poster: Poster,
                        }
                        let glitchPost = {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(omdbMovie)
                        };
                        // sending the new movie to DB
                        fetch(glitchUrl, glitchPost)
                            .then(response => {
                                getDatabase(glitchUrl, glitchGet)

                            })
                    })
            })
    }
})

// GRABS UNIQUE MOVIE VALUES FROM SEARCH
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
            movieHTML += `<div  class="movie-card card m-1">
                         <a id="${movie.id}"class="image card-image" href="#${movie.title}">
                         <img id="${movie.title}" class="imgMovie position-relative" src="${movie.poster}"  />
                         </a>
                         </div>`
        }
        html += movieHTML;
        html += `</div></div>`
        $(".load-movies").append(html)
    }
    // ***** EVENT LISTENER FOR POSTER CLICK ********//
// ***** DRAWS UP MODAL WITH TRAILER AND REST OF INFORMATION ********//
    $("main a").click(function () {

        fetch(glitchUrl + `/${$(this).attr("id")}`, glitchGet).then(response => {
            response.json().then(movie => {
                $("#movieModal .delete").val(`${movie.id}`)
                $("#movieModal .video").html(`<iframe src="https://www.youtube.com/embed/1x0GpEZnwa8?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
                $("#movieModal .title").text(`${movie.title}`)
                $("#movieModal .plot").text(`${movie.plot}`)
                $("#movieModal .year").text(`Year: ${movie.year}`)
                $("#movieModal .genre").text(`Genre: ${movie.genre}`)
                $("#movieModal .actors").text(`Actors: ${movie.actors}`)
                $("#movieModal .director").text(`Director: ${movie.director}`)
                $("#movieModal .rating").text(`Rating: ${movie.rating}`)
                $("#movieModal").modal('show')
                let hold = ""
                let trailerID = movie.title
                fetch(omdbUrl + `${omdbKey}&t=${trailerID}`)
                    .then(response => {
                        response.json()
                            .then(omdb => {
                                fetch(`https://imdb-api.com/en/API/YouTubeTrailer/${imdbAPIKey}/${omdb.imdbID}`).then(response => {
                                    response.json().then(link => {
                                        hold = "https://www.youtube.com/oembed?url=" + link.videoUrl + "&format=json"
                                        fetch(hold)
                                            .then(data => {
                                                data.json().then(dataResponse => {
                                                    console.log(dataResponse)
                                                    let html4Iframe = dataResponse.html;
                                                    html4Iframe = html4Iframe.slice(38, 94);
                                                    console.log(html4Iframe)
                                                    $("#movieModal iframe").attr("src", `${html4Iframe}`)
                                                    console.log($("#movieModal iframe").attr("src"))
                                                })
                                            })
                                    })
                                })
                            })
                    })

            })
        })
    })
}

$("#movieModal").on('hidden.bs.modal', function (e) {
    $("#movieModal iframe").attr("src", $("#movieModal iframe").attr("src"));
});

//*********** SORTING EVENTS **************//
//* ALL SORTS CAN BE USED DURING SEARCH TO MAINTAIN RESULTS *//

// RATING HI TO LO SORT
$("#sort10-1").click(function () {
    let sortSearchValue = searchEntry.value.toUpperCase();
    if (sortSearchValue === "") {
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
    } else {
        for (let genre of filteredMoviesToBeDisplayed) {
            genre.movies.sort((a, b) => (a.rating > b.rating ? -1 : 1))
        }
        $(".load-movies").html("");
        displayMovies(filteredMoviesToBeDisplayed);
    }
})

// RATING LO TO HI SORT
$("#sort1-10").click(function () {
    let sortSearchValue = searchEntry.value.toUpperCase();
    if (sortSearchValue === "") {
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
    } else {
        for (let genre of filteredMoviesToBeDisplayed) {
            genre.movies.sort((a, b) => (a.rating > b.rating ? 1 : -1))
        }
        $(".load-movies").html("");
        displayMovies(filteredMoviesToBeDisplayed);
    }
})

// ALPHABETIC SORT
$("#sortA-Z").click(function () {
    let sortSearchValue = searchEntry.value.toUpperCase();
    if (sortSearchValue === "") {
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
    } else {
        for (let genre of filteredMoviesToBeDisplayed) {
            genre.movies.sort((a, b) => (a.title > b.title ? 1 : -1))
        }
        $(".load-movies").html("");
        displayMovies(filteredMoviesToBeDisplayed);
    }
})

// REVERSE ALPHABETIC SORT
$("#sortZ-A").click(function () {
    let sortSearchValue = searchEntry.value.toUpperCase();
    if (sortSearchValue === "") {
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
    } else {
        for (let genre of filteredMoviesToBeDisplayed) {
            genre.movies.sort((a, b) => (a.title > b.title ? -1 : 1))
        }
        $(".load-movies").html("");
        displayMovies(filteredMoviesToBeDisplayed);
    }
})

// ***** EVENT LISTENER IN MODAL FOR CLICK TO SAVE AND DISPLAY NEW MOVIE ********//

$('#formAdd').submit(function () {
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

// DELETE MOVIE EVENT TRIGGERS CONFIRMATION MODAL WITH TWO EVENTS TO IT
$("#movieModal .delete").click(function (e) {
    e.preventDefault();
    deleteValue = "number"
    deleteValue = $("#movieModal .delete").val()
    $("#confirmationModla").modal("show")
    let deleteModal = `<div class="modal" id="confirm-delete-modal" data-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">${$("#movieModalTitle").text()}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                </div>
                <div class="container"></div>
                <div class="modal-body">
                    Are you sure you want to delete this movie?
                </div>
                <div class="modal-footer">
                    <button id="cancel" data-dismiss="modal" class="btn btn-primary">Cancel</button>
                    <button value="${$("#movieModal .delete").val()}" id="confirm-delete" data-dismiss="modal" class="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>`
    $(".confirmationModal").html(deleteModal);
    $("#confirm-delete-modal").modal("show");

//    ON DISMISSAL OTHER THAN THE BUTTONS CLOSE BOTH MODALS
    $(".confirmationModal").on("hidden.bs.modal",function (){
        $("#movieModal").modal("hide");
    } )

// CANCEL BUTTON EVENT FOR CONFIRMATION MODAL
    $("#cancel").click(function (e) {
        $("#confirm-delete-modal").modal('hide');
    })

// CONFIRM DELETE EVENT FOR CONFIRMATION MODAL
    $("#confirm-delete").click(function () {
        $("#confirm-delete-modal").modal('hide');
        $("#movieModal").modal("hide");
        console.log("deleting")
        fetch(glitchUrl + `/${deleteValue}`, {method: "DELETE",})
            .then(response => {
                console.log("deleted")
                getDatabase(glitchUrl, glitchGet)
            })
    })


});

// EDIT BUTTON EVENT FOR MOVIE MODAL
$("#movieModal .editMovie").click(function (e) {
    e.preventDefault();
    fetch(glitchUrl + `/${$("#movieModal .delete").val()}`, glitchGet).then(response => {
        response.json().then(movie => {
            $("#movieModal").modal("hide");
            $("#add").modal("show");
            $("#addModalCenterTitle").text("Edit Movie")
            $("#saveNewMovie").toggleClass("d-none")
            $("#editedMovie").toggleClass("d-flex")
            $("#titleAdd").val(movie.title)
            $("#ratingAdd").val(movie.rating)
            $("#yearAdd").val(movie.year)
            $("#genreAdd").val(movie.genre)
            $("#directorAdd").val(movie.director)
            $("#plotAdd").val(movie.plot)
            $("#actorsAdd").val(movie.actors)
            $("#posterAdd").val(movie.poster)
        })
    })
})
$("#editedMovie").click(function () {
    let movieToBeEdited = {
        title: $("#titleAdd").val(),
        rating: $("#ratingAdd").val(),
        year: $("#yearAdd").val(),
        genre: $("#genreAdd").val(),
        director: $("#directorAdd").val(),
        plot: $("#plotAdd").val(),
        actors: $("#actorsAdd").val(),
        poster: $("#posterAdd").val()
    }
    let glitchPatch = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(movieToBeEdited)
    }
    $("#add").modal("hide")
    $("#formAdd").trigger("reset")
    fetch(glitchUrl + `/${$("#movieModal .delete").val()}`, glitchPatch).then(response => {
        response.json().then(response => {
            getDatabase(glitchUrl, glitchGet)
            $("#addModalCenterTitle").text("Add Movie")
            $("#saveNewMovie").toggleClass("d-none")
            $("#editedMovie").toggleClass("d-flex")
        })
    })
})

$('#add').on('hidden.bs.modal', function (e) {
    $("#formAdd").trigger("reset")
})

// $(".trailer").click(function () {
//     let hold = ""
//     let trailerID = $("#movieModal .title").text()
//     fetch(omdbUrl + `${omdbKey}&t=${trailerID}`)
//         .then(response => {
//             response.json()
//                 .then(omdb => {
//                     fetch(`https://imdb-api.com/en/API/YouTubeTrailer/${imdbAPIKey}/${omdb.imdbID}`).then(response => {
//                         response.json().then(movie => {
//                             hold = "https://www.youtube.com/oembed?url=" + movie.videoUrl + "&format=json"
//                             console.log(hold)
//                             fetch(hold)
//                                 .then(data => {
//                                     data.json().then(dataResponse => {
//                                         console.log(dataResponse)
//                                         let html4Iframe = dataResponse.html;
//                                         html4Iframe = html4Iframe.slice(38, 94);
//                                         console.log(html4Iframe)
//                                         let trailerModalHTML = `<div class="modal" id="trailerModal" data-backdrop="static">
//         <div class="modal-dialog" role="document">
//             <div class="modal-content">
//                 <div class="modal-body">
//                 <iframe width="200" height="113" src="https://www.youtube.com/embed/2GfBkC3qs78?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
//                 </div>
//                 <div class="modal-footer d-flex justify-content-between">
//                         <button data-dismiss="modal" type="button" class="btn btn-primary ">Close</button>
//             </div>
//         </div>`
//                                         $(".trailerModal").html(trailerModalHTML);
// console.log(html4Iframe)
//                                         $(".trailerModal iframe").attr("src", `${html4Iframe}`)
//
//                                         $("#trailerModal").modal("show");
//                                         console.log($(".trailerModal iframe").attr("src"))
//                                         // $("#movieModal").modal("hide");
//                                     })
//                                 })
//                         })
//                     })
//                 })
//         })
//
// })


// GENRE CARD GENERATOR
//  BRING INITIAL MOVIE INFORMATION IN & STORE
// USE STORED INFORMATION TO GENERATE THE MOVIE GENRE LIST
// USE MOVIE GENRE LIST TO GENERATE GENRE CARDS FOR HTML
// DISPLAY CARDS TO HTML