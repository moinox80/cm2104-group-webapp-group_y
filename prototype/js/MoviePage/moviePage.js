/** 
 * movie page
 * sets up the moie page with the given movie
*/
var fakeMovie = {
    Poster: "https://m.media-amazon.com/images/M/MV5BMTkxMjYyNzgwMl5BMl5BanBnXkFtZTgwMTE3MjYyMTE@._V1_SX300.jpg",
    Title: "Ghostbusters",
    Type: "movie",
    Year: "1984",
    imdbID: "tt0087332",
    filmingLocations: [
        ["Stage 16, Warner Brothers Burbank Studios - 4000 Warner Boulevard, Burbank, California, USA", [34.149695, -118.34172]],
        ["55 Central Park West, Manhattan, New York City, New York, USA", [40.7723089,-73.9790983]],
        ["New York Public Library - Fifth Avenue & 42nd Street, Manhattan, New York City, New York, USA", [40.76395,-73.974088]],
        ["Stage 15, Warner Brothers Burbank Studios - 4000 Warner Boulevard, Burbank, California, USA", [34.149695,-118.34172]],
        ["Tavern on the Green - Central Park at W. 67th Street, Central Park, Manhattan, New York City, New York, USA", [40.806335,-73.955869]],
        ["Stage 18, Warner Brothers Burbank Studios - 4000 Warner Boulevard, Burbank, California, USA", [34.149695,-118.34172]],
        ["Hook & Ladder Company #8 - 14 North Moore Street, Manhattan, New York City, New York, USA", [40.795256,-73.963954]],
        ["Biltmore Hotel - 506 S. Grand Avenue, Downtown, Los Angeles, California, USA", [35.307843,-120.002513]],
        ["Fire Station 23 - 225 E. 5th Street, Los Angeles, California, USA", [34.0458225,-118.2465861]],
        ["Columbia University - Broadway & 116th Street, Manhattan, New York City, New York, USA", [40.74303,-73.989155]],
        ["489 Fifth Avenue, Manhattan, New York City, New York, USA", [40.806416,-73.942262]],
        ["Stage 12, Warner Brothers Burbank Studios - 4000 Warner Boulevard, Burbank, California, USA", [34.149695,-118.34172]],
        ["Los Angeles Central Library - 630 W. Fifth Street, Downtown, Los Angeles, California, USA", [36.323395,-119.653807]],
        ["420 East 78th Street, New York, USA", [40.7710529,-73.9521582]],
        ["Lincoln Center, New York City, New York, USA", [40.7729407,-73.9825034]],
        ["U.S. Customs House, New York City, New York, USA", [40.702898,-74.010241]]
    ]
};

$(document).ready(function(){//onload set up movie with movie passed in url

    var queryString = window.location.search;
    queryString = queryString.substring(1)

    var movie = JSON.parse(sessionStorage.getItem(queryString));
    $("#TitleHeader").text(movie.name);
    $("#imdbID").text(movie.imdbID);
    $("#movieYear").append(movie.year);
    $("#PosterIMG").attr("src", movie.poster);
    
    movie.filmingLocationsMarkers.forEach(marker => {
        var locationTableLine = "<tr>";
        locationTableLine += ("<th>" + marker.name + "</th>");
        locationTableLine += ("<th>" + marker.location[0] + " - " + marker.location[1] + "</th>");
        locationTableLine += ("<th>" + marker.visited + "</th>")
        locationTableLine += "</tr>";
        $(locationTableLine).appendTo("#filmingLocationTable");
    })
})
