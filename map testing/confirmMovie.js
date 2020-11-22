var movies_dict = {};

function selectMovieFromOptions(movies){
    createMovieSelectionDiv()
    addAllMoviesToOptionsListAndDict(movies)
    $("#submitMovie").click(onMovieChossen);
}

function onMovieChossen(){
    var selectedMovie = $(movieSelect).val();
    var movie = movies_dict[selectedMovie];
    makeMovie(movie);
    removeMovieSelectionDiv();
}

function addMovieToOptionsListAndDict(movie){
    var movieNameAndDate = String(movie.Title) + " " + String(movie.Year);
    movies_dict[movieNameAndDate] = movie;
    $("<option>" + movieNameAndDate + "</option>").appendTo($("#movieSelect"));
}

function addAllMoviesToOptionsListAndDict(movies){
    movies_dict = {};
    movies.forEach(movie => {
        addMovieToOptionsListAndDict(movie)
    });
}

function removeMovieSelectionDiv(){
    $("#movieSelectDiv").remove();
}

function createMovieSelectionDiv(){
    removeMovieSelectionDiv()
    $('<div id="movieSelectDiv"> <select id="movieSelect"></select> <button id="submitMovie"> submit </button> </div>').appendTo('body');
}