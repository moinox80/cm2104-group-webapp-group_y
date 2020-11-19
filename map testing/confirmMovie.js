function confirmMovie(movies){
    $("#movieSelectDiv").remove();
    div = $('<div id="movieSelectDiv"> <select id="movieSelect"></select> <button id="submitMovie"> submit </button> </div>').appendTo('body');

    var movies_dict = {};
    movies.forEach(movie => {
        var movieNameANdDate = String(movie.Title) + " " + String(movie.Year)
        movies_dict[movieNameANdDate] = movie;
        $("<option>" + movieNameANdDate + "</option>").appendTo($("#movieSelect"))
    });

    $("#submitMovie").click( function (){
        var movie = movies_dict[$(movieSelect).val()]
        makeMovie(movie)
        $("#movieSelectDiv").remove();
    });
}