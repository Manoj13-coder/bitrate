var width = 800;
var height = 800;
var videoSize = 800;

var modelSize = 0.75;
var posenetLoadParams = {
  multiplier: 0.75,
};

var imageScaleFactor = 0.75;
var minPartConfidence = 0.3;
var flipHorizontal = false;

var categorizationResults = [];
// var serverUrl = 'https://private-8f2aa8-bitrate.apiary-mock.com/poses' // use this as a mock that always classifies as true.
var serverUrl = "http://127.0.0.1:5000/poses";

var player;
var playing = false;
var random_music = false;

var capture;
var net;

var keypoints = [];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function startRandomMusic() {
  if (playing) {
    player.stop();
    playing = false;
  }
  if (random_music) player2.stop();
  player2 = new Tone.Player("http://0.0.0.0:8081/music/generate?track_name=output.mp3").toDestination();
  player2.loop = true;
  player2.autostart = true;
  random_music = true;
  console.log("Start Random Music");
}
function startMusic() {
  playing = true;
  if (random_music) {
    player2.stop();
    random_music = false;
  }
  player.start();
  console.log("Start Playing");
}

function evaluateResults() {
  // Check the last 8 poses and return positive if 80% of them are positive.
  var countResults = categorizationResults.length;
  if (countResults < 8) {
    console.log("Sample too small");
    return false;
  }

  // count number of positives
  const positiveResults = categorizationResults.filter((category) => category)
    .length;

  // if more than 80% are positive, return.
  var percentage = positiveResults / countResults;
  var shouldPlay = percentage > 0.8;
  console.log("positiveResults:" + countResults);
  console.log("countResults:" + countResults);
  console.log("Percentage:" + percentage);
  console.log("Should Play:" + shouldPlay);
  console.log("Is playing:" + playing);
  if (!shouldPlay) startRandomMusic();
  if (!playing && shouldPlay) startMusic();
}

function sendToServer(pose, callback) {
  // Ajax request to receive either true or false
  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  poseJSON = JSON.stringify({
    value: pose,
  });

  xhr.onload = function () {
    if (this.readyState === 4)
      if (this.status === 200) {
        console.log("Server OK");
        callback.apply(xhr, pose);
        // we get the returned data
      } else {
        console.log("Server Error");
        console.log(xhr.statusText);
      }
  };
  xhr.responseType = "json";

  xhr.send(poseJSON);
}

function updatePoseArray(keypoints) {
  console.log(this.response);
  categorizationResults.push(this.response.result);
  if (categorizationResults.length > 10) {
    categorizationResults.shift();
    console.log("Trimming results");
  }

  evaluateResults();
}

function estimatePoses() {
  // call posenet to estimate a pose
  net
    .estimateSinglePose(capture.elt, imageScaleFactor, flipHorizontal)
    .then(async function (pose) {
      // store the keypoints from the pose to draw it below
      keypoints = pose.keypoints;
      sendToServer(keypoints, updatePoseArray);

      // console.log("poseJSON: ", poseJSON); // uncomment this if you want to see your pose value
      // next animation loop, call posenet again to estimate poses

      await delay(1000);

      requestAnimationFrame(function () {
        estimatePoses();
      });
    });
}

function setup() {
  createCanvas(600, 600);
  // create video capture.  For PoseNet, videos must be square
  capture = createCapture({
    video: {
      width: videoSize,
      height: videoSize,
    },
  });
  capture.size(videoSize, videoSize);
  capture.hide();

  capture.elt.onloadeddata = () => {
    // setup our player with an audio file
    player = new Tone.Player("https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview128/v4/0e/10/2d/0e102dc5-f22b-2dbb-c4a3-2690a559bd21/mzaf_6636550671412085201.plus.aac.p.m4a").toDestination();
    player.loop = true;
    player.autostart = false;

    // load posenet by downloading the weights for the model.
    posenet.load(posenetLoadParams).then(function (loadedNet) {
      net = loadedNet;
      // when it's loaded, start estimating poses
      requestAnimationFrame(function () {
        estimatePoses();
      });
    });
  };
}

function draw() {
  background(255);
  image(capture, 0, 0, videoSize, videoSize);

  noStroke();
  // draw keypoints
  for (var i = 0; i < keypoints.length; i++) {
    var keypoint = keypoints[i];
    // filter out keypoints that have a low confidence
    if (keypoint.score > minPartConfidence) {
      // for wrists, make the part red
      if (
        i == posenet.partIds["leftWrist"] ||
        i == posenet.partIds["rightWrist"]
      )
        fill(255, 0, 0);
      // all other parts are yellow
      else fill(255, 255, 0);

      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    }
  }

  // get skeleton, filtering out parts without a high enough confidence level
  if (keypoints.length > 0) {
    stroke(255, 255, 0);
    var skeleton = posenet.getAdjacentKeyPoints(keypoints, minPartConfidence);
    for (var i = 0; i < skeleton.length; i++) {
      // draw each line in the skeleton
      var segment = skeleton[i];
      line(
        segment[0].position.x,
        segment[0].position.y,
        segment[1].position.x,
        segment[1].position.y
      );
    }
  }
}
