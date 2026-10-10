import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getDatabase, ref, set, get, onValue, runTransaction, update } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';
import { firebaseConfig, isFirebaseConfigured } from './ludo-config.js';

const $ = id => document.getElementById(id);
const status = $('ludoStatus');
const roomInput = $('ludoRoomCode');
const createBtn = $('ludoCreate');
const joinBtn = $('ludoJoin');
const shareBtn = $('ludoCopyCode');
const rollBtn = $('ludoRoll');
const board = $('ludoBoard');
const dice = $('ludoDice');
const roomLine = $('ludoRoomLine');
const playerLine = $('ludoPlayerLine');
const log = $('ludoLog');
let db, auth, uid, roomCode = '', myColor = '', roomData = null, unsubscribe = null, busy = false;
const TRACK = [
 [1,6],[2,6],[3,6],[4,6],[5,6],[6,5],[6,4],[6,3],[6,2],[6,1],[6,0],[7,0],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],[14,7],[14,8],[13,8],[12,8],[11,8],[10,8],[9,8],[8,9],[8,10],[8,11],[8,12],[8,13],[8,14],[7,14],[6,14],[6,13],[6,12],[6,11],[6,10],[6,9],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8],[0,7],[0,6]
];
const START = {red:0, blue:26};
function say(message, error=false){ status.textContent=message; status.classList.toggle('is-error',error); }
function addLog(message){ log.textContent=message; }
function ready(){ return isFirebaseConfigured(); }
function cleanCode(s){ return String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6); }
function randomCode(){ const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; return Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join(''); }
async function connect(){
  if(!ready()) throw new Error('لسه محتاج تضيف إعدادات Firebase في ملف ludo-config.js الأول.');
  if(!db){ const app=initializeApp(firebaseConfig); auth=getAuth(app); db=getDatabase(app); }
  if(!auth.currentUser) await signInAnonymously(auth);
  uid=auth.currentUser.uid;
}
function newState(hostUid){return {hostUid,guestUid:'',status:'waiting',turn:'red',dice:0,rolled:false,tokens:{red:[-1,-1,-1,-1],blue:[-1,-1,-1,-1]},winner:'',updatedAt:Date.now()};}
async function createRoom(){
  if(busy)return; busy=true; createBtn.disabled=true;
  try{ await connect(); let code, snap; do{code=randomCode();snap=await get(ref(db,`ludoRooms/${code}`));}while(snap.exists());
    await set(ref(db,`ludoRooms/${code}`),newState(uid)); roomCode=code;myColor='red';listenRoom();say('الغرفة اتعملت! ابعت الكود لصاحبك عشان يدخل.');
  }catch(e){say(e.message||'حصل خطأ في إنشاء الغرفة.',true);}finally{busy=false;createBtn.disabled=false;}
}
async function joinRoom(){
 if(busy)return; const code=cleanCode(roomInput.value); if(code.length!==6){say('اكتب كود الغرفة المكوّن من 6 حروف أو أرقام.',true);return;}
 busy=true;joinBtn.disabled=true;
 try{await connect();const roomRef=ref(db,`ludoRooms/${code}`);let result;
   await runTransaction(roomRef,current=>{if(!current||current.status!=='waiting'||current.hostUid===uid||current.guestUid)return;current.guestUid=uid;current.status='playing';current.updatedAt=Date.now();result='joined';return current;});
   const snap=await get(roomRef);if(!snap.exists())throw new Error('الغرفة مش موجودة. راجع الكود.');const r=snap.val();
   if(r.hostUid===uid){roomCode=code;myColor='red';}else if(r.guestUid===uid){roomCode=code;myColor='blue';}else throw new Error(r.status==='playing'?'الغرفة مليانة بالفعل.':'مش قادر تدخل الغرفة.');
   listenRoom();say('دخلت الغرفة بنجاح. استنى دورك!');
 }catch(e){say(e.message||'فشل الدخول للغرفة.',true);}finally{busy=false;joinBtn.disabled=false;}
}
function listenRoom(){if(unsubscribe)unsubscribe();unsubscribe=onValue(ref(db,`ludoRooms/${roomCode}`),snap=>{if(!snap.exists()){say('الغرفة اتمسحت.');return;}roomData=snap.val();render();});}
function render(){
 if(!roomData)return;roomLine.hidden=false;roomLine.innerHTML=`كود الغرفة: <strong>${roomCode}</strong> · ${roomData.status==='waiting'?'في انتظار اللاعب الثاني':'مباراة مباشرة'}`;
 playerLine.hidden=false;playerLine.textContent=`إنت اللاعب ${myColor==='red'?'الأحمر 🔴':'الأزرق 🔵'} · الدور الحالي: ${roomData.turn==='red'?'الأحمر 🔴':'الأزرق 🔵'}`;
 rollBtn.disabled=roomData.status!=='playing'||roomData.turn!==myColor||roomData.rolled;rollBtn.textContent=roomData.rolled?'اختار قطعة لتحريكها':'🎲 ارمي النرد';dice.textContent=roomData.dice||'—';shareBtn.hidden=false;board.hidden=roomData.status==='waiting';
 if(roomData.status==='waiting')say('مستنيين اللاعب التاني يدخل بالكود.');else if(roomData.winner)say(`🏆 اللاعب ${roomData.winner==='red'?'الأحمر':'الأزرق'} كسب!`);else if(roomData.turn===myColor)say(roomData.rolled?'دورك! اختار قطعة صالحة للتحريك.':'دورك، ارمي النرد.');else say('دور صاحبك…');
 drawBoard();
}
function drawBoard(){
 board.innerHTML='';const cell=document.createElement('div');cell.className='ludo-track';
 const cells=new Map();TRACK.forEach((p,i)=>cells.set(p.join(','),i));
 for(let y=0;y<15;y++)for(let x=0;x<15;x++){
  const el=document.createElement('div');el.className='ludo-cell';let idx=cells.get(`${x},${y}`);
  if(idx!==undefined){el.classList.add('track-cell');if(idx===START.red)el.classList.add('red-start');if(idx===START.blue)el.classList.add('blue-start');el.dataset.index=idx;}
  if(x>=1&&x<=5&&y>=1&&y<=5)el.classList.add('home-red');if(x>=9&&x<=13&&y>=9&&y<=13)el.classList.add('home-blue');
  if((x===7&&y>=1&&y<=5)||(y===7&&x>=1&&x<=5))el.classList.add('red-lane');if((x===7&&y>=9&&y<=13)||(y===7&&x>=9&&x<=13))el.classList.add('blue-lane');
  board.appendChild(el);
 }
 for(const color of ['red','blue'])roomData.tokens[color].forEach((pos,i)=>{
   const piece=document.createElement('button');piece.type='button';piece.className=`ludo-piece ${color}`;piece.textContent=String(i+1);piece.setAttribute('aria-label',`قطعة ${color==='red'?'حمراء':'زرقاء'} ${i+1}`);
   let coord;if(pos===-1){coord=color==='red'?[[2,2],[4,2],[2,4],[4,4]][i]:[[10,10],[12,10],[10,12],[12,12]][i];}else if(pos>=52){coord=color==='red'?[[6,6],[7,6],[6,7],[7,7]][i]:[[8,8],[7,8],[8,7],[7,7]][i];}else{const index=(START[color]+pos)%52;coord=TRACK[index];}
   piece.style.gridColumn=coord[0]+1;piece.style.gridRow=coord[1]+1;if(roomData.turn===color&&roomData.rolled&&color===myColor&&isMovable(color,pos,roomData.dice))piece.classList.add('can-move');
   piece.addEventListener('click',()=>movePiece(color,i));board.appendChild(piece);
 });
}
function isMovable(color,pos,d){if(pos>=57||!d)return false;if(pos===-1)return d===6;return pos+d<=57;}
async function rollDice(){if(!roomData||roomData.turn!==myColor||roomData.rolled||roomData.status!=='playing')return;const value=1+Math.floor(Math.random()*6);try{await update(ref(db,`ludoRooms/${roomCode}`),{dice:value,rolled:true,updatedAt:Date.now()});addLog(`طلعلك ${value} 🎲`);}catch(e){say('مش قادرين نحدّث المباراة.',true);}}
async function movePiece(color,index){if(!roomData||color!==myColor||roomData.turn!==myColor||!roomData.rolled)return;const d=roomData.dice;const pos=roomData.tokens[color][index];if(!isMovable(color,pos,d)){say('القطعة دي مش متاحة للحركة بالنرد الحالي.',true);return;}
 const next=pos===-1?0:pos+d;const newTokens=JSON.parse(JSON.stringify(roomData.tokens));newTokens[color][index]=next;
 // Capture opponents on shared track (safe squares excluded).
 if(next<52){const trackIndex=(START[color]+next)%52;const safe=[0,8,13,21,26,34,39,47];if(!safe.includes(trackIndex)){const other=color==='red'?'blue':'red';newTokens[other]=newTokens[other].map(p=>p>=0&&p<52&&(START[other]+p)%52===trackIndex?-1:p);}}
 const winner=newTokens[color].every(p=>p>=57);const turn=d===6?color:(color==='red'?'blue':'red');
 try{await runTransaction(ref(db,`ludoRooms/${roomCode}`),current=>{if(!current||current.turn!==myColor||!current.rolled||current.dice!==d||current.tokens[color][index]!==pos)return;current.tokens=newTokens;current.turn=winner?color:turn;current.rolled=false;current.dice=0;current.winner=winner?color:'';current.status=winner?'finished':'playing';current.updatedAt=Date.now();return current;});}catch(e){say('تعذر حفظ الحركة.',true);}
}
createBtn.addEventListener('click',createRoom);joinBtn.addEventListener('click',joinRoom);rollBtn.addEventListener('click',rollDice);
shareBtn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(roomCode);say('اتنسخ كود الغرفة! ابعته لصاحبك.');}catch{roomInput.value=roomCode;roomInput.select();say('الكود ظاهر في خانة الغرفة، انسخه وابعته لصاحبك.');}});
$('ludoLeave').addEventListener('click',()=>{if(unsubscribe)unsubscribe();unsubscribe=null;roomCode='';myColor='';roomData=null;board.hidden=true;roomLine.hidden=true;playerLine.hidden=true;shareBtn.hidden=true;rollBtn.disabled=true;dice.textContent='—';say('خرجت من الغرفة. تقدر تنشئ غرفة جديدة أو تدخل بكود.');});
if(!ready()){say('اللعبة جاهزة كواجهة، لكن الأونلاين محتاج إعداد Firebase (شوف README-FIREBASE.txt).',true);createBtn.disabled=true;joinBtn.disabled=true;}
