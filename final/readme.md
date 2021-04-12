# Final

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

-----front end-----

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


---- back end ------

-Code features
--XSS validation
--Email validation
--Ensures there cant be multiple users with same name/email
--stores password as hashed and salted
--can reset password using reset key and email(sendgrid) email usually goes to trach, and sometimes the handler ignores it completely so you might have to resend. in other words, no one trusts my email.


-Site Usage
--Users can see where their favorite movies where filmed by searching with imdbid or movie name
--Users can add movies to their myStalks
--Users can toggle visited on the movie locations (click on marker)
--Users can get directions to location, either by google or by filmStalker (click on marker)
--Users can toggle if a film is visible on the map (useful for when there are many films)


-NPM node modules
--bcrypt to hash and salt passwords
--mongodb to store information about the user
--express to help with the server
--express-session to store loged in information
--xss to validate user iput before storing
--email-validator to validate user email is in correct formate
--web3-to allow the connection between the ethereum mainnet and metamask


-To Do
--make movies in myStalks colapsable


-Possible stuff to add
--check that JS is enabled


-Extra info
--the my stalks page may take a while to load since all the api calls are being done server side
--the directions page is located by clicking on a link in the marker banner
