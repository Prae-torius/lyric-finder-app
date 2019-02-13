'use strict'

// Youtube Data API
const apiKey = 'AIzaSyA4tjQOUCgtNTZUkMhEzIORxOikRpoejMc';
const videoSearchURL = 'https://www.googleapis.com/youtube/v3/search';
// lyrics.ovh API
const lyricSearchURL = 'https://api.lyrics.ovh/v1/';

function watchForm() {
// user searches for video
  $('form').submit(event => {
    event.preventDefault();
    const querySong = $('#query-song').val();
    const queryArtist = $('#query-artist').val();

    $('#search-results').remove();
    $('#player-section').remove();
    $('#lyrics-section').remove();

    // responsible for fetching and displaying search results and lyrics
    getVideosFromQuery(querySong, queryArtist);
    getLyrics(querySong, queryArtist);
    
    // hides the 'How to guide'
    $('#how-to').addClass('hidden');
  })
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getVideosFromQuery(querySong, queryArtist){
  const params = {
    key: apiKey,
    maxResults: '15',
    part: 'snippet',
    q: `${querySong} ${queryArtist}`,
    type: 'video',
    videoSyndicated: 'true',
    topicId: '/m/04rlf'
  };

  const queryString = formatQueryParams(params);
  const url = `${videoSearchURL}?${queryString}`

  fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error(response.statusText)
  })
  .then(responseJson => displaySearchResults(responseJson))
  .catch(err => {
    alert(`Unable to get search results: ${err.message}`);
  })
}

// function getVideoFromLink(){
// // with link (jump to 'change current video...')
// }

function displaySearchResults(responseJson) {
// display search results
  $('#how-to').after('<section id="search-results" class="results"><h3 class="result-title red-font">Video List</h3><p id="#search-error"></p><ul id="results-list"></ul></section>')
  for(let i = 0; i < responseJson.items.length; i++){
    $('#results-list').append(`<li id="${responseJson.items[i].id.videoId}"><a href="#player-section" class="list-item">${responseJson.items[i].snippet.title}</a></li>`);
  }
}

function displaySelectedResult() {
// select search results
// change current video of embedded player
  $('main').on('click', 'li', event =>{
    event.preventDefault();
    console.log('clicked');
    $('#player-section').remove();
    $('#search-results').after(`<section id="player-section" class="results"><h3 class="result-title red-font">Video</h3><iframe width="480" height="270" src="https://www.youtube.com/embed/${$(event.currentTarget).attr('id')}" frameborder="0" encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><p>Unfortunately, some songs on Youtube are not be allowed to be played in an embedded player and will be unavailable :(</p><a href="https://www.youtube.com/watch?v=${$(event.currentTarget).attr('id')}" target="_blank">Open video in new tab</a></section>`);
  })
}

function getLyrics(querySong, queryArtist) {
// display lyrics if matching song and artist is found
  const lyricsURL = `${lyricSearchURL}${queryArtist}/${querySong}`;

  fetch(lyricsURL)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
    })
  .then(responseJson => displayLyrics(responseJson))
  .catch(err => {
    alert(`Unable to get lyrics: ${err.message}`);
    displayLyricsError(err);
  })
}

function displayLyrics(responseJson) {
  const lyricString = responseJson.lyrics.replace(/\n/ig, '<br>');
  
  $('main').append(`<section id="lyrics-section" class="results"><h3 class="result-title red-font">Lyrics</h3><div id="lyrics-container" class="center"><p id="lyrics-error"></p></div></section>`)
  $('#lyrics-container').html(lyricString);
}

function displayLyricsError(err) {
  // genereates HTML for showing the user that an error has occured with getting lyrics
  $('main').append(`<section id="lyrics-section" class="results"><h3 class="result-title red-font">Lyrics</h3><p id="lyrics-error">${`<span class="red-font">Unable to get lyrics:</span> ${err.message}<br><br>You most likely didn't enter the correct <span class="red-font">SONG TITLE</span> or <span class="red-font">ARTIST NAME</span>`}</p></section>`)
}

// function displayHowTo() {
//   // Displays step-by-step how to use the app
//   $('header').append('<h2 id="how-to-toggle">How to</h2>');
// }

// function toggleHowTo() {
//   $('header').on('click', '#how-to-toggle', event => {
//     $('#how-to').toggleClass('hidden');
//     toggleResultsVisibility();
//   })
// }

// function toggleResultsVisibility() {
//   $('#search-results').toggleClass('results');
//   $('#player-section').toggleClass('results');
//   $('#lyrics-section').toggleClass('results');
//   $('#results-list').toggleClass('hidden');
//   $('#player-section').toggleClass('hidden');
//   $('#lyrics-section').toggleClass('hidden');
// }

function scrollToID() {
  $('body').on('click', 'li', event => {
    $("html, body").animate({ scrollTop: $("#player-section").offset().top }, 500);
  })
}

$(scrollToID);
$(watchForm);
$(displaySelectedResult);