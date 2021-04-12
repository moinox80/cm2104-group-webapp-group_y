makeMoviesFromServerList();

function makeMoviesFromServerList(){
    if (typeof stalksFromServer == 'undefined' || stalksFromServer == null || stalksFromServer.length == 0) return;

    for (stalk of stalksFromServer){
        getResultsFromOMDBByID(stalk.imdbID, makeMovie, true, stalk.locationsVisited);
    }
}