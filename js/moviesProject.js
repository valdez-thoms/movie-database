//*********** GLOBAL VARIABLES **************//
let glitchUrl = "https://zenith-mature-adapter.glitch.me/movies";
let get = {
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    },
};

getDatabase(glitchUrl, get);

//*********** GET TO LOAD FROM CURRENT DATABASE AND CALL DISPLAY**************//
function getDatabase(glitchUrl, get){
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
    for (movie of movieList) {
        let html = "";
        html = "<div id='" + movie.id + "' class='card d-flex flex-wrap col-4 my-2'>"
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
                .then( movieList => {
                    let sorted = movieList.sort((a, b) => (a.rating > b.rating) ? -1 : 1);
                    $(".load-movies").html("");
                    displayMovies(sorted);
                })
        })

    // let sorted = [];
    // sorted = movieList.sort((a, b) => (a.rating > b.rating) ? 1 : -1);
    // console.log(sorted);
    //
    // let post = {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(sorted)
    // };
    //
    // // sending the new movie to DB
    // fetch(glitchUrl, post)
    //     .then(response => {
    //         fetch(glitchUrl, get)
    //             .then(response => {
    //                 response.json()
    //                     .then(sortedMovies => {
    //                         $(".load-movies").html("");
    //                         displayMovies(sortedMovies)
    //                     })
    //             })
    //     })
})
$("#sortRatingLtoH").click(function () {
    fetch(glitchUrl, get)
        .then(response => {
            response.json()
                .then( movieList => {
                    let sorted = movieList.sort((a, b) => (a.rating > b.rating) ? 1 : -1);
                    $(".load-movies").html("");
                    displayMovies(sorted);
                })
        })
})

$("#sortTitleAtoZ").click(function (){
    console.log("sort title")
    fetch(glitchUrl, get)
        .then(response => {
            response.json()
                .then( movieList => {
                    console.log(movieList)
                    let sorted = movieList.sort((a, b) => (a.title > b.title) ? 1 : -1);
                    console.log(sorted)
                    $(".load-movies").html("");
                    displayMovies(sorted);
                })
        })

})
$("#sortTitleZtoA").click(function (){
    console.log("sort title")
    fetch(glitchUrl, get)
        .then(response => {
            response.json()
                .then( movieList => {
                    console.log(movieList)
                    let sorted = movieList.sort((a, b) => (a.title > b.title) ? -1 : 1);
                    console.log(sorted)
                    $(".load-movies").html("");
                    displayMovies(sorted);
                })
        })

})
$("#sortGenre").click(function (){

})
    // console.log(movieList)
    // let ratings = [];
    // $(".card-title").each(function (){
    //     ratings.push($(this).text());
    //
    // })
    // console.log(ratings);
    // console.log(ratings.sort());


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
        //********** GRABS OLD MOVIE AND UPDATES MOVIE FROM FROM PRE-POPULATED EDIT FIELDS AND SENDS TO DB
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



