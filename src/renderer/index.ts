import {FilesetResolver, FaceLandmarker, NormalizedLandmark} from "@mediapipe/tasks-vision";
import {processResults} from "../vision/process.js";
import {startTimer,stopTimer} from "../timer/timer.js"

console.log("RENDERER INDEX.JS IS RUNNING");
// Face landmarker setup stuff
const vision = await FilesetResolver.forVisionTasks(
  // path/to/wasm/root
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

const faceLandmarker = await FaceLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
      },
      runningMode: "VIDEO"
    });

// The webcam is video here
await faceLandmarker.setOptions({runningMode: "VIDEO" });

let lastVideoTime = -1;

const video = document.getElementById("video") as HTMLVideoElement;

export const canvas = document.getElementById("canvas") as HTMLCanvasElement

// When the webcam stream starts, configure the size of the canvas and start rendering the face
video.addEventListener("loadedmetadata", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(canvas.width, canvas.height)
  renderLoop();
});

// This should be constantly running as long as the webcam is on
function renderLoop(): void 
{
  // Not ready / same time, next frame
  if(video.readyState < 3 || video.currentTime === lastVideoTime){
    requestAnimationFrame(renderLoop);
    return;
  }

  // Process the data from the captured landmarks and create an array of the data we want to capture
  const faceLandmarkerResult = faceLandmarker.detectForVideo(video, performance.now());
  const landmarks: NormalizedLandmark[] = processResults(faceLandmarkerResult);    
  
  // No face is detected: the number of expected points catured is number of points in array is invalid
  if(landmarks.length < 5){
    startTimer();
    lastVideoTime = video.currentTime;
    requestAnimationFrame(renderLoop);
    return;
  }

  // Set up the canvas for drawing on
  // This will allow jumpscare to be used later
  const display = canvas.getContext("2d");

  // Only run when the canvas exists
  if(display){
    const noseX: number = landmarks[0].x * canvas.width;
    const noseY: number = landmarks[0].y * canvas.height;
    const leftJawX: number = landmarks[1].x * canvas.width;
    const rightJawX: number = landmarks[2].x * canvas.width;
    const forehead: number = landmarks[3].y * canvas.height;
    const chin: number = landmarks[4].y * canvas.height;

    const horizontalMidpoint: number = (rightJawX + leftJawX) / 2;
    const verticalMidpoint: number = (forehead + chin) / 2;
    const faceWidth: number = (rightJawX - leftJawX);
    const faceHeight: number = (forehead - chin);
    const xOffset: number = (noseX - horizontalMidpoint) / faceWidth;
    const yOffset: number = (noseY - verticalMidpoint) / faceHeight;

    console.log(yOffset);
    // Activate the timer when offset is outside this range
    // Otherwise, stop it to cancel the timer from running
    if (xOffset > 0.5 || xOffset < -0.5){
      startTimer();
    }
    else if (yOffset > 0.03 || yOffset < -0.1){
      startTimer();
    }
    else{
      stopTimer();
    }

  }
  
  lastVideoTime = video.currentTime;

  requestAnimationFrame(renderLoop);
}