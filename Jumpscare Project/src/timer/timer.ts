import {jumpScare} from "./jumpscare.js"

let timer: ReturnType<typeof setTimeout> | -1 = -1;
let jumpScareTriggered: boolean = false;

export function startTimer()
{   
    if (timer === -1 && jumpScareTriggered === false){
        timer = setTimeout(() => {
            jumpScareTriggered = true;
            timer = -1;
            jumpScare();
        }, 2500);
    }
}

export function stopTimer()
{
    clearTimeout(timer);
    timer = -1;
    jumpScareTriggered = false;
}