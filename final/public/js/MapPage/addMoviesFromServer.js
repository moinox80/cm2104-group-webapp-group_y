makeMoviesFromServerList();

function makeMoviesFromServerList(){
    if((typeof movieIDsFromServer == 'undefined') || movieIDsFromServer == null) return;
    if (movieIDsFromServer.length == 0)return;

    for (movieID of movieIDsFromServer){
        getResultsFromOMDBByID(movieID, makeMovie, true, []);
    }
}