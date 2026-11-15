/* main.js - Game loop. Keep the animation loop alive and report runtime errors. */
let last=0;
function loop(ts){
 const dt=Math.min(.05,(ts-last)/1000||0);
 last=ts;
 try{update(dt);draw();}
 catch(error){console.error('Satellite Rescue runtime error:',error);}
 requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
