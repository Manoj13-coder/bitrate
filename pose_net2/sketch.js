var width = 800;
var height = 800;
var videoSize = 800;

// the size of the neural network model to load. Must be 0.50, 0.75, 1.00, or 1.01
// The higher the number, the larger the model and the more accurate it is, but
// the slower the speed.
var modelSize = 0.75;
var posenetLoadParams = {
  //architecture: 'MobileNetV1',
  //outputStride: 16,
  //inputResolution: 513,
  multiplier: 0.75,
};

// A number between 0.2 and 1.0. How much posenet should scale the image by before feeding
// it through the network.  Set this number lower to scale down the image and increase
// the speed at the cost of accuracy.
var imageScaleFactor = 0.75;

// the minimum score of keypoints from posenet to show.
// Should be between 0.0 and 1.0. Use this to filter out
// lower accuracy parts
var minPartConfidence = 0.3;

// if the pose results should be flipped horizontally. Useful for webcam videos.
var flipHorizontal = false;

var categorizationResults = []
// var serverUrl = 'https://private-8f2aa8-bitrate.apiary-mock.com/poses'
var serverUrl = 'http://127.0.0.1:5000/poses'

var playing = false; 

var capture;
var net;

var keypoints = [];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function stopMusic(){
  playing = false; 
  console.log("Stop Playing");
}
function startMusic(){
  playing = true; 
  console.log("Start Playing");
}

function evaluateResults() {
  // Check the last 10 poses and return positive if 80% of them are positive.
  var countResults = categorizationResults.length
  if (countResults < 8) 
  {
    console.log("Sample too small");
    return false;
  }

  // count number of positives
  const positiveResults = categorizationResults.filter(category => category).length;
  
  // if more than 80% are positive, return. 
  var percentage = (positiveResults / countResults);
  var shouldPlay =  percentage > 0.8;
  console.log("countResults:" + countResults);
  console.log("Percentage:" + percentage);
  console.log("Should Play:" + shouldPlay);
  if (playing && !shouldPlay)
    stopMusic();
  else
    if (!playing && shouldPlay)
      startMusic();
}

function sendToServer(pose, callback){
  // Ajax request to receive either true or false
  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  poseJSON = JSON.stringify({
      value: pose
  });


  xhr.onload = function () {
    if (this.readyState === 4) 
      if (this.status === 200) {
          console.log("Server OK");
          callback.apply(xhr, pose);
          // we get the returned data
      }
      else {
        console.log("Server Error");
        console.log(xhr.statusText);
      }
  };
  xhr.responseType = 'json';

  xhr.send(poseJSON);
}

function updatePoseArray (keypoints) {
 
  console.log(this.response);
  categorizationResults.push(this.response.result);
  if (categorizationResults.length > 10)
  {
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

      // console.log("poseJSON: ", poseJSON);
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
      // all other parts are yello
      else fill(255, 255, 0);

      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    }
  }

  // get skeleton, filtering out parts wtihout
  // a high enough confidence level
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