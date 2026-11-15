/* core.js - Canvas, constants and math helpers */
const C=document.getElementById('c'),X=C.getContext('2d');X.imageSmoothingEnabled=false;
const W=480,H=270,WW=1280,WH=720,F='"Press Start 2P",monospace';
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const fmt=s=>{s=Math.floor(s);return String(s/60|0).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
