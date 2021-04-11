# Final

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
--update add to my stalkes button if movie is already in my stalkes of database
--get and display mystalks and locations from databse
--404 page
--make movies in myStalks colapsable


-Possible stuff to add
--check that JS is enabled
