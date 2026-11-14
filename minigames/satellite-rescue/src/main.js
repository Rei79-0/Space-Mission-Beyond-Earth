/* main.js - Game loop */
let last=0;function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;update(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);
