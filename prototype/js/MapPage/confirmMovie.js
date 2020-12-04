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
    $("#submit-movie").click(onMovieChossen);
    $("#cancel-movie-select").click(removeMovieSelectionDiv)
}

function onMovieChossen(){
    var selectedMovie = $("#movie-select").val();
    var movie = moviesDict[selectedMovie];
    makeMovie(movie);
    removeMovieSelectionDiv();
}

function addMovieToOptionsListAndDict(movie){
    var movieNameAndDate = String(movie.Title) + " " + String(movie.Year);
    moviesDict[movieNameAndDate] = movie;
    $("<option>" + movieNameAndDate + "</option>").appendTo($("#movie-select"));
}

function addAllMoviesToOptionsListAndDict(movies){
    moviesDict = {};
    movies.forEach(movie => {
        addMovieToOptionsListAndDict(movie)
    });
}

function removeMovieSelectionDiv(){
    $("#movie-select-div").remove();
}

function createMovieSelectionDiv(){
    removeMovieSelectionDiv();
    var newDiv = "";
    $('<div id="movie-select-div"></div>').appendTo('#add-movie-div');
    $("<select id='movie-select'></select>").appendTo("#movie-select-div");
    $("<button id='submit-movie'> submit </button>").appendTo("#movie-select-div");
    $("<button id='cancel-movie-select'> cancel </button>").appendTo("#movie-select-div");
}
