/**
 * confirm movie
 * user confirms movie from imdbs most relevant based on innitial user input
 * displays a selection box on the page for the user to choose from
 */
var moviesDict = {};

function selectMovieFromOptions(movies){
    moviesDict = {};
    createMovieSelectionDiv();
    addAllMoviesToOptionsListAndDict(movies);
    $("#submitMovie").click(onMovieChossen);
    $("#cancelMovieSelect").click(removeMovieSelectionDiv)
}

function onMovieChossen(){
    var selectedMovie = $(movieSelect).val();
    var movie = moviesDict[selectedMovie];
    makeMovie(movie);
    removeMovieSelectionDiv();
}

function addMovieToOptionsListAndDict(movie){
    var movieNameAndDate = String(movie.Title) + " " + String(movie.Year);
    moviesDict[movieNameAndDate] = movie;
    $("<option>" + movieNameAndDate + "</option>").appendTo($("#movieSelect"));
}

function addAllMoviesToOptionsListAndDict(movies){
    moviesDict = {};
    movies.forEach(movie => {
        addMovieToOptionsListAndDict(movie)
    });
}

function removeMovieSelectionDiv(){
    $("#movieSelectDiv").remove();
}

function createMovieSelectionDiv(){
    removeMovieSelectionDiv();
    var newDiv = "";
    $('<div id="movieSelectDiv"></div>').appendTo('#add_movie_div');
    $("<select id='movieSelect'></select>").appendTo("#movieSelectDiv");
    $("<button id='submitMovie'> submit </button>").appendTo("#movieSelectDiv");
    $("<button id='cancelMovieSelect'> cancel </button>").appendTo("#movieSelectDiv");
}
