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
    const querySong = $('#js-query-song').val();
    const queryArtist = $('#js-query-artist').val();

    // responsible for fetching and displaying search results, lyrics and results heading
    displayResultsHeading();
    getVideosFromQuery(querySong, queryArtist);
    getLyrics(querySong, queryArtist);
   
    
    // hides the 'How to guide'
    $('.js-how-to').addClass('hidden');

    // reveals results sections
    $('.js-search-results').removeClass('hidden');
    $('.js-player-section').removeClass('hidden');
    $('.js-lyrics-section').removeClass('hidden')
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

function displaySearchResults(responseJson) {
// display search results
  $('.js-results-list').empty();
  for(let i = 0; i < responseJson.items.length; i++){
    $('.js-results-list').append(`<li id="${responseJson.items[i].id.videoId}"><a href=".player" class="list-item">${responseJson.items[i].snippet.title}</a></li>`);
  }
}

function displaySelectedResult() {
// select search results
// change current video of embedded player
  $('main').on('click', 'li', event =>{
    event.preventDefault();
    console.log('clicked');
    $('.js-player-container').html(`<iframe width="480" height="270" src="https://www.youtube.com/embed/${$(event.currentTarget).attr('id')}" frameborder="0" encrypted-media;></iframe><p>Unfortunately, some songs on Youtube are not be allowed to be played in an embedded player and will be unavailable. :(</p><a href="https://www.youtube.com/watch?v=${$(event.currentTarget).attr('id')}" target="_blank">Open video in new tab</a>`);
    $('.js-player-container').focus();
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
  $('.js-lyrics-container').html(lyricString);
}

function displayLyricsError(err) {
  // genereates HTML for showing the user that an error has occured with getting lyrics
  $('.js-lyrics-error').html(`${`<span class="red-font">Unable to get lyrics:</span> ${err.message}.<br><br>You most likely did not enter the correct <span class="red-font">SONG TITLE</span> or <span class="red-font">ARTIST NAME</span>.`}`)
}

function displayResultsHeading() {
  $('.js-main-header').html('<span class="red-font">Results</span>');
}

function scrollToID() {
  $('body').on('click', 'li', event => {
    $("html, body").animate({ scrollTop: $(".js-player-section").offset().top }, 500);
  })
}

$(scrollToID);
$(watchForm);
$(displaySelectedResult);