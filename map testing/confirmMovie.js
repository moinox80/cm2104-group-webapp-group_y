var movies_dict = {};

function confirmMovie(movies){
    createMovieSelectDiv()
    addAllMoviesToOptionsListAndDict(movies)
    $("#submitMovie").click(onMovieChossen);
}

function onMovieChossen(){
    var selectedMovie = $(movieSelect).val();
    var movie = movies_dict[selectedMovie];
    makeMovie(movie);
    deleteOldMovieSelectDiv();
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

function deleteOldMovieSelectDiv(){
    $("#movieSelectDiv").remove();
}

function createMovieSelectDiv(){
    deleteOldMovieSelectDiv()
    $('<div id="movieSelectDiv"> <select id="movieSelect"></select> <button id="submitMovie"> submit </button> </div>').appendTo('body');
}