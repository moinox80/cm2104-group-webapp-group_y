# CM2104 Group Project Repository

[![Work in Repl.it](https://classroom.github.com/assets/work-in-replit-14baed9a392b3a25080506f3b7b6d57f295ec2978f6f33ec97e36a161684cbe9.svg)](https://classroom.github.com/online_ide?assignment_repo_id=306342&assignment_repo_type=GroupAssignmentRepo)


<h1>Contributors:</h1>
<ul>
  <li>ARTHUR SIDLE (1911859)</li>
  <li>BRADLEY TODD (2005704)</li>
  <li>ANDER MOINA URRUTIA (1900909)</li>
  <li>KAVEH NEJAD (1905933)</li>
</ul>

<h1>Roles:</h1>
<ul>
  <li>ARTHUR SIDLE - MyStalks</li>
  <li>BRADLEY TODD - Login & Account</li>
  <li>ANDER MOINA URRUTIA - About & Index</li>
  <li>KAVEH NEJAD - Map & Directions & Movie</li>
</ul>


#Info
Site Name : Film Stalker

Basic description : A site to track and mark movie filming locations, by displaying the filming locations of your favorite movies on a map, and allowing you to mark areas as visited.

##Stuff to show on map:
- Eveywhere every movie has been shot with a actor or director
- Everywhere a tvShow has been shot
- Everywhere a movie has been shot
- Combination of the above
- Change color depending on if visited or not

##User info to store
- Acount name
- Some form of login in credential, preferably 3rd party logins ie FB/Insta/IMDB
- Users movies/TVShows
- Where the user has been and when

##pages
- Login : Login details
- Map : The map
- Movie : Details of each movie
- Acount Details : Manage acount details
- My stalks : Manage all the movies/shows/people tracked
- Directions : Travel details directing you to the locations you have yet to see
- Contact us


#API's

##Movies
- IMDB API : https://rapidapi.com/apidojo/api/imdb8   a API to get movie and tv series information, will primeraly be used for filming locations. 500 per month
- OMDB API : http://www.omdbapi.com/   a API to get all the movie information


##travel/Travel
- MapQuest https://developer.mapquest.com/ used to make map on directions page and to get directions
- AeroData Box https://www.aerodatabox.com/  used to get locations of nearest airports
- leaflet.js     to make the map
- OpenCage Geocoding API     https://opencagedata.com/     to convert address to lat-lng


#Server stuff

##Database

- Process pages to be sent

###Stuff to store
- Login information
- Saved Movies
- Visited film locations
- Filming locations/info cache and date/time cached to minomize API requests   - possible feature

## partials
- Navigation bar
- Footer




#Possible features to add
- web3.js
