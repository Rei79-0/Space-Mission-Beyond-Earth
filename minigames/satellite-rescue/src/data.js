/* data.js - Static game data: levels (LV), quiz questions, puzzles, Mars bunker/easter eggs, drag-drop questions, keypad */
const COLS=['#ffd23f','#ff8a1f','#e63946','#3a7bff','#2ecc71','#c77dff'],TN=['BRONZE','SILVER','GOLD','PLATINUM'],TC=['#cd7f32','#c8d0e0','#ffd23f','#7fe8ff'];
const P1=[[0,0,1,2],[0,3,3,3],[1,0,2,1],[2,0,2,2]],P2=[[0,0,4,0],[0,1,1,4],[1,1,2,3],[2,1,4,2],[2,2,2,4]],P3=P2.map(p=>[4-p[0],4-p[1],4-p[2],4-p[3]]);
const P4=P2.map(p=>[p[1],p[0],p[3],p[2]]),P5=[[0,0,1,5],[1,0,5,2],[1,1,3,5],[2,1,4,3],[2,2,3,2],[3,4,5,3]];
const LV=[{name:'ORBIT ALPHA',sub:'EARTH ORBIT',env:'space',n:3,par:120,ast:6,al:1,pz:P1,g:4},{name:'MARS SURFACE',sub:'OPERATION RED BUNKER',env:'mars',mars:1,n:3,par:210,ast:0,al:2,pz:P1,g:4},{name:'NEBULA RIFT',sub:'DEEP SPACE',env:'nebula',n:5,par:230,ast:12,al:3,pz:P3,g:5}];
const QS=[['Who was the first human to travel into space?','Yuri Gagarin','Neil Armstrong','Alan Shepard','John Glenn'],
['Which mission first landed humans on the Moon?','Apollo 11','Apollo 13','Gemini 4','Apollo 8'],
['Which planet is known as the Red Planet?','Mars','Venus','Mercury','Jupiter'],
['About how high does the ISS orbit Earth?','400 km','40 km','4,000 km','40,000 km'],
['In what year was NASA founded?','1958','1947','1969','1975'],
['Which NASA rover landed on Mars in 2021?','Perseverance','Opportunity','Spirit','Sojourner'],
['Which space telescope launched in December 2021?','James Webb','Hubble','Kepler','Spitzer'],
['What does EVA stand for in spaceflight?','Extravehicular Activity','Extra Vehicle Access','External Vacuum Aid','Earth Visit Assembly'],
['What is weightlessness in orbit called?','Microgravity','Hypergravity','Antigravity','Zero mass'],
['Who was the first American in space?','Alan Shepard','Buzz Aldrin','Neil Armstrong','Gus Grissom'],
['Which planet has the most famous rings?','Saturn','Mars','Earth','Mercury'],
['Which Space Shuttle flew the first orbital mission?','Columbia','Atlantis','Discovery','Endeavour'],
['Which spacecraft is the farthest human-made object?','Voyager 1','Apollo 11','Hubble','Cassini'],
['Which was the last crewed Apollo Moon landing?','Apollo 17','Apollo 15','Apollo 13','Apollo 11'],
['Which is the largest planet in the Solar System?','Jupiter','Saturn','Neptune','Earth'],
['What force keeps satellites orbiting Earth?','Gravity','Friction','Magnetism','Wind'],
['Which planet has the Great Red Spot?','Jupiter','Mars','Saturn','Venus'],
['What is the only natural satellite of Earth?','The Moon','Phobos','Europa','Titan'],
['Which agency runs the Artemis program?','NASA','ESA','JAXA','Roscosmos'],
['What do astronauts need that space lacks?','Oxygen','Helium','Argon','Neon'],
['About how many sunrises does the ISS crew see per day?','16','2','4','1']];
const BUNK={x:640,y:360};
const EG=[{x:330,y:470,t:'INGENUITY',c:'#e8e8f0',m:'INGENUITY: FIRST FLIGHT ON MARS, 2021'},{x:980,y:600,t:'CURIOSITY',c:'#c8d0e0',m:'CURIOSITY LANDED BY SKY CRANE, 2012'},{x:930,y:170,t:'DARE MIGHTY THINGS',c:'#e63946',m:'PERSEVERANCE CHUTE CODE: DARE MIGHTY THINGS'},{x:400,y:170,t:'OPPORTUNITY',c:'#ffd23f',m:'OPPORTUNITY: 90-DAY MISSION LASTED 15 YEARS'}];
const MD=Array.from({length:70},()=>[Math.random()*WW,Math.random()*WH,rnd(6,26),Math.random()<.6]);
const NB=[[200,150,220,'#c77dff'],[800,200,260,'#ff4fd8'],[600,550,300,'#3a7bff'],[1100,600,200,'#2ecc71']];
const DQ=[['MATCH THE ROVER TO ITS LANDING YEAR',['SOJOURNER','CURIOSITY','PERSEVERANCE'],['1997','2012','2021']],['MATCH THE PLANET TO ITS FACT',['MARS','JUPITER','SATURN'],['THE RED PLANET','GREAT RED SPOT','FAMOUS RINGS']],['MATCH THE APOLLO MISSION',['APOLLO 11','APOLLO 13','APOLLO 17'],['FIRST MOON LANDING','OXYGEN TANK FAILURE','LAST MOON LANDING']],['MATCH THE SPACE AGENCY',['NASA','ESA','JAXA'],['UNITED STATES','EUROPE','JAPAN']]];
const KP=['1','2','3','4','5','6','7','8','9','C','0','OK'],kpR=i=>[186+(i%3)*38,104+Math.floor(i/3)*26,34,22];
