
var manifestUri = '/midia/feelings_vp9-20130806-manifest.mpd';

function initApp() {
  shaka.polyfill.installAll();

  if (shaka.Player.isBrowserSupported()) {
    initPlayer();
  } else {
    console.error('Browser not supported!');
  }
}

function initPlayer() {
  var video = document.getElementById('video');
  var player = new shaka.Player(video);

  window.player = player;

  player.addEventListener('error', onErrorEvent);
  document.getElementById('videoTracks').addEventListener('change', onTrackSelected);

  player.load(manifestUri).then(function() {
    console.log('The video has now been loaded!');

    var tracks = player.getTracks();
    var lists = {
      video: document.getElementById('videoTracks'),
    }

    var formatters = {
      video: function(track) {
        return track.width + 'x' + track.height + ', ' +
           track.bandwidth + ' bits/s';
         },
       }

    tracks.forEach(function(track) {
      var list = lists[track.type];
      if (!list) return;
      var option = document.createElement('option');
      option.textContent = formatters[track.type](track);
      option.track = track;
      option.value = track.id;
      option.selected = track.active;
      list.appendChild(option);
    });
  }).catch(onError);

}

function onErrorEvent(event) {
  onError(event.detail);
}

function onError(error) {
  console.error('Error code', error.code, 'object', error);
}

function onTrackSelected(event) {
  var list = event.target;
  var option = list.options[list.selectedIndex];
  var track = option.track;
  var player = window.player;
  console.log('Track anterior: ', player.getStats().width, "x", player.getStats().height)
  player.selectTrack(track, true);
  console.log('Track atual: ', player.getStats().width, "x", player.getStats().height)
};

document.addEventListener('DOMContentLoaded', initApp);
