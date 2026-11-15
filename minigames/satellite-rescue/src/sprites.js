/* sprites.js - All pixel-art sprites (astronaut, aliens per environment, satellite, items) built from text maps */
function spr(rows,pal,s){const c=document.createElement('canvas');c.width=rows[0].length*s;c.height=rows.length*s;const g=c.getContext('2d');rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(pal[ch]){g.fillStyle=pal[ch];g.fillRect(x*s,y*s,s,s)}}));return c}
function flip(c){const d=document.createElement('canvas');d.width=c.width;d.height=c.height;const g=d.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(c,0,0);return d}
const astro=spr(["...wwww...","..wyyyyw..","..wyoyyw..","..wwwwww..",".wwwbbwww.","wwwwbbwwww","ww.wwww.ww","ww.wwww.ww","...ww.ww..","...gg.gg.."],{w:'#f0f0ff',y:'#ffd23f',o:'#ff8a1f',b:'#8fa0d8',g:'#9aa0c0'},2),astroL=flip(astro);
const ITN=['WRENCH','CIRCUIT BOARD','BATTERY CELL','SOLAR PATCH'];
const IMG=[
spr(["..gg.gg.",".gg..gg.",".gggggg.","..gggg..","...yy...","...yy...","...yy...","...yy..."],{g:'#b8bcd0',y:'#ffd23f'},2),
spr(["s.s.s.s.","gggggggg","gddddddg","gdgddgdg","gddddddg","gggggggg","s.s.s.s.","........"],{g:'#2ecc71',d:'#14703a',s:'#d8d8e8'},2),
spr(["..wwww..",".dddddd.",".drrrrd.",".drwwrd.",".drrwrd.",".drwwrd.",".drrrrd.",".dddddd."],{r:'#e63946',w:'#f0f0ff',d:'#8a1c25'},2),
spr(["dddddddd","dbbdbbbd","dbbdbbbd","dddddddd","dbbdbbbd","dbbdbbbd","dddddddd","...ll..."],{b:'#3a7bff',l:'#9cc0ff',d:'#1f3f99'},2)];
const satRows=["pppp......pppp","pbpb..gg..pbpb","pppp.gddg.pppp","pbpbggddggpbpb","pppp.gddg.pppp","pbpb..gg..pbpb","pppp..rr..pppp"];
const satPal={p:'#3a6fd4',b:'#8fb4ff',g:'#9aa0b8',d:'#5a6080'};
const satBad=spr(satRows,{...satPal,r:'#e63946'},4),satOk=spr(satRows,{...satPal,r:'#2ecc71'},4);
function mkAst(sd){const c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d');for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-7.5),n=Math.sin(x*1.7+sd)*Math.cos(y*2.3+sd*2)*1.3;if(d+n<7){g.fillStyle=Math.sin(x*3+y*2+sd)>.55?'#74747e':(x+y<13?'#a2a2a8':'#8c8c92');g.fillRect(x*2,y*2,2,2)}}return c}
const AST=[1,4,9].map(mkAst);
const ALR=[".a......a.","..a....a..","..gggggg..",".gggggggg.",".gwwggwwg.",".gwkggkwg.",".gggggggg.","..g.gg.g..",".g..gg..g."];
const alien=spr(ALR,{a:'#ff4fd8',g:'#7bdc5a',w:'#f0f0ff',k:'#14122a'},2),alienS=spr(ALR,{a:'#9aa0c0',g:'#5f78d8',w:'#c8d4ff',k:'#14122a'},2);
const AB=["...wwww...","..wyyyyw..","..wyoyyw..","..wwwwww..",".wwwbbwww.","wwwwbbwwww","ww.wwww.ww","ww.wwww.ww"],AG=[["...ww.ww..","...gg.gg.."],["..ww...ww.","..gg...gg."],[".ww...ww..",".gg...gg.."]],AP={w:'#f0f0ff',y:'#ffd23f',o:'#ff8a1f',b:(()=>{try{const p=JSON.parse(localStorage.getItem('beyondEarthProfile')||'{}');return ({blue:'#3988ff',pink:'#ff78bd',purple:'#ad82ff',teal:'#49d8d0',gold:'#f2bd42',green:'#72d99a'})[p.helmetColor]||(p.gender==='girl'?'#ff78bd':'#3988ff')}catch(_){return '#8fa0d8'}})(),g:'#9aa0c0'},AF=AG.map(l=>spr([...AB,...l],AP,2)),AFL=AF.map(flip);
const MAL=[0,1].map(z=>[["d.d.dd.d.d",".d..dd..d."],[".d.d..d.d.","d..d..d..d"]].map(l=>spr(["..a....a..",".dddddddd.","dddwddwddd","dddkddkddd",".dddddddd.",...l],{a:'#ff4fd8',d:z?'#5f78d8':'#d9622b',w:'#f0f0ff',k:'#14122a'},2)));
const SA=[["c....a.a....c","cc..ggggg..cc",".cc.gwgwg.cc.","..c.gkgkg.c..","....ggggg....",".....g.g.....","....g...g...."],["....a.a......","....ggggg....","cc..gwgwg..cc",".cc.gkgkg.cc.","..c.ggggg.c..",".....g.g.....","....g...g...."]],NJ=[["...ppppp...","..ppppppp..",".pppwppwpp.",".pppkppkpp.","..ppppppp..",".t.t.t.t.t.","t..t.t.t..t"],["...ppppp...","..ppppppp..",".pppwppwpp.",".pppkppkpp.","..ppppppp..","..t.t.t.t..",".t..t.t..t."]];
const mk=(Rw,a,b)=>[a,b].map(pl=>Rw.map(r=>spr(r,pl,2)));
const ALS={space:mk(SA,{c:'#7fe8ff',a:'#ff4fd8',g:'#7bdc5a',w:'#f0f0ff',k:'#14122a'},{c:'#9aa0c0',a:'#9aa0c0',g:'#5f78d8',w:'#c8d4ff',k:'#14122a'}),mars:MAL,nebula:mk(NJ,{p:'#b45cff',w:'#f0f0ff',k:'#14122a',t:'#ff4fd8'},{p:'#5f78d8',w:'#c8d4ff',k:'#14122a',t:'#7f8fd0'})};
const alImg=a=>ALS[LV[lv].env][a.st>0?1:0][Math.floor(tk*8+a.x*.05)%2];
const stars=Array.from({length:300},()=>[Math.random()*WW|0,Math.random()*WH|0,Math.random()<.2?2:1]);
const dspr=k=>k==0?AF[0]:ALS[['space','mars','nebula'][k-1]][0][Math.floor(tk*4)%2];
