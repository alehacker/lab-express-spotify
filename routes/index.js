var express = require('express');
var router = express.Router();

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));




/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(process.env.CLIENT_ID)
    res.render('index', { title: 'Express - Spotify' });

});

router.get('/artist-search', (req, res, next) => {
    spotifyApi.searchArtists(req.query.name)
    .then(data => {
        const result = data.body.artists.items
        console.log('The received data from the API: ', result[0]);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API' - 
      console.log(result[0].name)
      res.render('artist-search-results.hbs', {result})
       
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
    
})


router.get('/albums/:artistid', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getArtistAlbums(req.params.artistid)
    .then(data => {
        console.log(data.body.items)
       res.render('albums.hbs', {albums: data.body.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  });


  router.get('/tracks/:albumid',(req, res, next) => { 
    spotifyApi.getAlbumTracks(req.params.albumid)
    .then( data => {
        console.log(data.body.items)
        const inforesult = data.body
        res.render('tracks.hbs', inforesult)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

  })



module.exports = router;
