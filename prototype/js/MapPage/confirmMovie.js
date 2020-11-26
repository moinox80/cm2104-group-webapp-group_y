var movies_dict = {};

function selectMovieFromOptions(movies){
    createMovieSelectionDiv()
    addAllMoviesToOptionsListAndDict(movies)
    $("#submitMovie").click(onMovieChossen);
    $("#cancelMovieSelect").click(removeMovieSelectionDiv)
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
    removeMovieSelectionDiv();
    var newDiv = "";
    $('<div id="movieSelectDiv"></div>').appendTo('#add_movie_div');
    $("<select id='movieSelect'></select>").appendTo("#movieSelectDiv");
    $("<button id='submitMovie'> submit </button>").appendTo("#movieSelectDiv");
    $("<button id='cancelMovieSelect'> cancel </button>").appendTo("#movieSelectDiv");
}