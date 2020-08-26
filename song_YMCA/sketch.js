// tone-player

let player;
let isPlaying = false;

function setup() {
  // setup our player with an audio file
  player = new Tone.Player("YMCA.m4a").toDestination();
  player.loop = true;
  player.autostart = false;

  // start click hander
  document.getElementById("start-stop").onclick = () => {
    if (player && player.loaded) {
      if (isPlaying) {
        // we weren't playing, so we'll start
        isPlaying = !isPlaying;
        player.start();
        document.getElementById("start-stop").innerHTML = "STOP";
        document.getElementById("playingYMCA").style.display = "block";
      } else {
        // we were playing, so we'll stop
        isPlaying = !isPlaying;
        player.stop();
        document.getElementById("start-stop").innerHTML = "START";
        document.getElementById("playingYMCA").style.display = "none";
      }
    }
  };
}
