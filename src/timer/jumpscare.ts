import {canvas} from "../renderer/index.js"

let currentFrame: number = 0;
let frameCoutner: number = 0;
let isPlaying: boolean = false;

const img = new Image();
img.src = "../jumpscare/foxy.png";

let audio = new Audio("../jumpscare/Xscream3.wav");

export function jumpScare(){
    console.log("JUMPSCARE CALLED");
    const scale = Math.max(
    canvas.width / 512,
    canvas.height/ 384
    );
    
    const drawWidth: number = 512 * scale;
    const drawHeight: number = 385 * scale;

    const x: number = (canvas.width - drawWidth) / 2;
    const y: number = (canvas.height - drawHeight) / 2;
    
    if (isPlaying){
        return;
    }

    isPlaying = true;
    animateFoxy(x, y, drawWidth, drawHeight);
}

// Does the Foxy Jumpscare via canvas using the png as a sprite sheet
function animateFoxy(x: number, y:number, drawWidth:number, drawHeight: number){
    
    const display = canvas.getContext("2d");

    if (display){
        const column = currentFrame % 4;
        const row = Math.floor(currentFrame / 4);
        const sourceX: number = column * 512;
        const sourceY: number = row * 384;
        display.globalAlpha = 1.0

        if(currentFrame === 0){
            audio.play();
        }

        display.clearRect(0, 0, canvas.width, canvas.height);

        display.drawImage(
            img,
            sourceX, sourceY, 
            512, 384, 
            x, y, 
            drawWidth, drawHeight);

        requestAnimationFrame(() => {

            frameCoutner++;

            if(frameCoutner >= 4){
                frameCoutner = 0;
                currentFrame++;
            }

            if (currentFrame < 14){
                animateFoxy(x, y, drawWidth, drawHeight);
            }
            else{
                currentFrame = 0;
                frameCoutner = 0;
                setTimeout(() => {
                    audio.pause();
                    audio = new Audio("../jumpscare/stare.wav");
                    img.src = "../jumpscare/static.png";
                    animateStatic(display, x, y, drawWidth, drawHeight);        
                }, 350);
            }
        });
    }
}

// Does the static following the Jumpscare via canvas using a png as a sprite sheet again
// and slowly fades out
function animateStatic(display: CanvasRenderingContext2D, x: number, y:number, drawWidth:number, drawHeight: number){
    if(display){
        const row = currentFrame % 3;
        const sourceY: number = row * 384;
        
        if(currentFrame === 0){
            audio.play();
        }
        else{
            display.clearRect(0, 0, canvas.width, canvas.height);
        }            
        display.drawImage(
            img,
            0, sourceY, 
            512, 384, 
            x, y, 
            drawWidth, drawHeight);
            
        requestAnimationFrame(()=>{
            currentFrame++;
            display.globalAlpha -= 0.002;
            console.log(display.globalAlpha);
            if(display.globalAlpha <= 0.002){
                setTimeout(() => {
                    audio.pause();
                    currentFrame = 0;
                    frameCoutner = 0;
                    display.clearRect(0, 0, canvas.width, canvas.height);
                    audio = new Audio("../jumpscare/Xscream3.wav");
                    img.src = "../jumpscare/foxy.png";
                    isPlaying = false;  
                }, 350);
            }
            else{
                animateStatic(display, x, y, drawWidth, drawHeight);
            }
        })
    }
}