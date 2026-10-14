import {FaceLandmarkerResult, NormalizedLandmark} from "@mediapipe/tasks-vision";

export function processResults(results:FaceLandmarkerResult): NormalizedLandmark[] 
    {
        if(results.faceLandmarks.length > 0)
        {
            const landmarks = results.faceLandmarks[0];
            const nose = landmarks[1];
            const leftJaw = landmarks[93];
            const rightJaw = landmarks[323];
            const forehead = landmarks[10];
            const chin = landmarks[152];
            return [nose, leftJaw, rightJaw, forehead, chin];
        }

        return [];
    }

