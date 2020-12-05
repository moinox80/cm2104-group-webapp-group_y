function addLocationsToCard($card, json) {
    for (var i = 0; i < json.locations.length; i++) {
        addLocationToList($card.find(".card-body").find(".collapse"), json.locations[i].location);
    }
}

function addLocationToList($list, location, proximity) {
    var appendString =
    `<div class="row">
        <div class="col-lg-8">
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input" value="">${location}
            </label>
        </div>
        <div class="col-lg-2">
            Proximity: ${proximity} miles
        </div>
        <div class="col-lg-2">
            See on map >
        </div>
    </div>`;

    $list.append(appendString);
}

$(function(){
    /*var url = "https://imdb8.p.rapidapi.com/title/get-filming-locations?tconst=tt0087332&rapidapi-key=a9eb244cd4msh1023a1ad25868ebp174b04jsn1fa8197ee780";
    $.getJSON(url, function(data) {
        addLocationsToCard(data, $(".card"));
    });*/

    addLocationsToCard($(".card"), {"@type":"imdb.api.title.filminglocations","base":{"id":"/title/tt0087332/","image":{"height":1426,"id":"/title/tt0087332/images/rm1280169216","url":"https://m.media-amazon.com/images/M/MV5BMTkxMjYyNzgwMl5BMl5BanBnXkFtZTgwMTE3MjYyMTE@._V1_.jpg","width":928},"runningTimeInMinutes":105,"title":"Ghostbusters","titleType":"movie","year":1984},"id":"/title/tt0087332/","locations":[{"extras":["interiors: Ghostbusters headquarters"],"id":"/title/tt0087332/filminglocations/lc0127277","interestingVotes":{"up":27},"location":"Fire Station 23 - 225 E. 5th Street, Los Angeles, California, USA"},{"attributes":["exterior"],"extras":["Ghostbusters headquarters exteriors"],"id":"/title/tt0087332/filminglocations/lc0127278","interestingVotes":{"down":1,"up":21},"location":"Hook & Ladder Company #8 - 14 North Moore Street, Manhattan, New York City, New York, USA"},{"extras":["the restaurant where Louis tries to escape a ravening hellhound"],"id":"/title/tt0087332/filminglocations/lc0127285","interestingVotes":{"up":13},"location":"Tavern on the Green - Central Park at W. 67th Street, Central Park, Manhattan, New York City, New York, USA"},{"extras":["Sedgewick Hotel"],"id":"/title/tt0087332/filminglocations/lc0127275","interestingVotes":{"up":11},"location":"Biltmore Hotel - 506 S. Grand Avenue, Downtown, Los Angeles, California, USA"},{"extras":["Spook Central"],"id":"/title/tt0087332/filminglocations/lc0127274","interestingVotes":{"up":10},"location":"55 Central Park West, Manhattan, New York City, New York, USA"},{"attributes":["exterior"],"extras":["Library exterior and main floor"],"id":"/title/tt0087332/filminglocations/lc0127280","interestingVotes":{"up":10},"location":"New York Public Library - Fifth Avenue & 42nd Street, Manhattan, New York City, New York, USA"},{"extras":["Department of Parapsychology/Weaver Hall"],"id":"/title/tt0087332/filminglocations/lc0127276","interestingVotes":{"up":9},"location":"Columbia University - Broadway & 116th Street, Manhattan, New York City, New York, USA"},{"extras":["interiors: Library basement"],"id":"/title/tt0087332/filminglocations/lc0127279","interestingVotes":{"up":9},"location":"Los Angeles Central Library - 630 W. Fifth Street, Downtown, Los Angeles, California, USA"},{"extras":["Manhattan City Bank"],"id":"/title/tt0087332/filminglocations/lc0127273","interestingVotes":{"up":7},"location":"489 Fifth Avenue, Manhattan, New York City, New York, USA"},{"attributes":["studio"],"id":"/title/tt0087332/filminglocations/lc0127281","interestingVotes":{"up":5},"location":"Stage 12, Warner Brothers Burbank Studios - 4000 Warner Boulevard, Burbank, California, USA"},{"attributes":["studio"],"id":"/title/tt0087332/filminglocations/lc0127282","interestingVotes":{"up":4},"location":"Stage 15, Warner Brothers Burbank Studios - 4000 Warner Boulevard, Burbank, California, USA"},{"attributes":["studio"],"id":"/title/tt0087332/filminglocations/lc0127283","interestingVotes":{"up":4},"location":"Stage 16, Warner Brothers Burbank Studios - 4000 Warner Boulevard, Burbank, California, USA"},{"attributes":["studio"],"id":"/title/tt0087332/filminglocations/lc0127284","interestingVotes":{"up":4},"location":"Stage 18, Warner Brothers Burbank Studios - 4000 Warner Boulevard, Burbank, California, USA"},{"extras":["Town House"],"id":"/title/tt0087332/filminglocations/lc1504361","interestingVotes":{"up":3},"location":"420 East 78th Street, New York, USA"},{"extras":["location"],"id":"/title/tt0087332/filminglocations/lc1454958","interestingVotes":{"up":2},"location":"Lincoln Center, New York City, New York, USA"},{"id":"/title/tt0087332/filminglocations/lc1504362","interestingVotes":{"up":1},"location":"U.S. Customs House, New York City, New York, USA"}]});
});