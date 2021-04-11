makeMoviesFromServerList();

function makeMoviesFromServerList(){
    if((typeof movieIDsFromServer == 'undefined') || movieIDsFromServer == null) return;
    if (movieIDsFromServer.length == 0)return;

    console.log(movieIDsFromServer)
    for (movieID of movieIDsFromServer){
        getResultsFromOMDBByID(movieID, makeMovie);
    }
}