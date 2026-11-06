'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const config={"employees": ["Rahul", "Anurag", "Harshit", "Akshit", "Ankur", "Abhay", "Ashok", "Priya", "Subhash", "Atul", "Gaurav", "Rajendra", "Shivang", "Sumaiyya"], "awards": [{"id": "1", "question": "Office mein sabse zyada gossip aur office updates kiske paas hote hain?"}, {"id": "2", "question": "Kaun sabse kam bolta hai lekin sab kuch observe karta hai?"}, {"id": "3", "question": "Kaun office mein sabko instructions dena pasand karta hai?"}, {"id": "4", "question": "Kaun har chhoti-badi activity par nazar rakhta hai?"}, {"id": "5", "question": "Office ki breaking news sabse pehle kaun lekar aata hai?"}, {"id": "6", "question": "Kaun apne kaam se kaam rakhta hai aur maximum focus ke saath kaam karta hai?"}, {"id": "7", "question": "Kaun har task ka follow-up lena kabhi nahi bhoolta?"}, {"id": "8", "question": "Kaun shaant rehkar office ki har situation samajh leta hai?"}, {"id": "9", "question": "Kaun har discussion aur office activity mein active rehta hai?"}, {"id": "10", "question": "Kaun har tarah ke kaam aur activities mein participate karta hai?"}, {"id": "11", "question": "Kaun kisi bhi baat par sabse late reaction deta hai?"}, {"id": "12", "question": "Kaun innocent dikhta hai lekin dimaag sabse tez chalata hai?"}], "open": false, "published": false, "ties": {}};
const DRAFT_KEY='diwali-3min-draft-2026-v1',RECEIPT_KEY='diwali-vote-demo-2026-v1';
let storageAvailable=true,submitted=false,activeView='home',toastTimeout,reviewStamp='';
function read(key){try{return JSON.parse(localStorage.getItem(key)||'null');}catch{storageAvailable=false;return null;}}
submitted=!!read(RECEIPT_KEY);
const draft=read(DRAFT_KEY),state=new DiwaliQuizState(config,draft||{});
const expiredNotices=new Set();
function saveDraft(){if(submitted)return;try{localStorage.setItem(DRAFT_KEY,JSON.stringify(state.snapshot()));storageAvailable=true;}catch{storageAvailable=false;}$('#saved-note').textContent=storageAvailable?'✓ Answers auto-saved in this browser':'⚠ Browser storage unavailable — do not refresh';}
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('#toast').hidden=true,5000);}
$('#mq').textContent=('🪔 Shubh Deepawali ✨ Happy Diwali 🎆 Apne colleagues ko vote do 🪔 ').repeat(10);
function changeQuestion(index){if(submitted){navigate('result');return;}state.open(index);saveDraft();if(activeView!=='quiz')navigate('quiz');else renderQuestion();}
function navigate(view){if(location.hash==='#'+view)route();else location.hash=view;}
function renderNavigator(){
 $('#question-nav').innerHTML=config.awards.map((q,j)=>{const locked=state.expired(j),selected=!!state.answers[q.id],visited=!!state.deadlines[q.id];return '<button class="question-dot '+(j===state.index?'current ':'')+(locked?'locked ':selected?'answered ':visited?'visited ':'')+'" data-question="'+j+'" '+(!visited?'disabled ':'')+(j===state.index?'aria-current="step" ':'')+'aria-label="Question '+(j+1)+(selected?', answered':'')+(locked?', time expired':'')+'">'+(j+1)+'</button>';}).join('');
 document.querySelectorAll('[data-question]').forEach(b=>b.onclick=()=>changeQuestion(Number(b.dataset.question)));
}
function renderQuestion(){
 const j=state.index,q=config.awards[j],expired=state.expired(j),chosen=state.answers[q.id],w=$('#qw');
 $('#pb').style.width=((j+1)/config.awards.length*100)+'%';$('#cnt').textContent='Sawaal '+(j+1)+' / '+config.awards.length;
 w.className='qwrap inn';w.innerHTML='<h2 tabindex="-1">'+esc(q.question)+'</h2><div class="selection-note">'+(expired?'🔒 Time khatam. Is sawaal ka answer ab lock hai.':chosen?'✓ Selected: <strong>'+esc(chosen)+'</strong> · Doosra naam choose karke badal sakte hain.':'Chaar naamon mein se ek colleague chunein.')+'</div><div role="radiogroup" aria-label="Choose one colleague">'+state.options(j).map((name,k)=>'<button type="button" role="radio" aria-checked="'+(chosen===name)+'" class="opt '+(chosen===name?'selected':'')+'" data-option="'+k+'" '+(expired?'disabled':'')+'><span class="option-letter">'+String.fromCharCode(65+k)+'</span><span>'+esc(name)+'</span></button>').join('')+'</div><div class="row quiz-controls"><button class="cta ghost" id="prev" '+(j===0?'disabled':'')+'>← Pichhla</button><button class="cta" id="next" '+(!chosen&&!expired?'disabled':'')+'>'+(j===11?'Answers check karo':'Agla sawaal →')+'</button></div>'+(state.complete()?'<button class="review-shortcut" id="review-now">Sabhi answers review karein ↗</button>':'');
 w.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{const name=state.options(j)[Number(b.dataset.option)];if(!state.choose(name)){handleExpiry();return;}saveDraft();const r=b.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,18);renderQuestion();document.querySelector('[data-option="'+b.dataset.option+'"]').focus({preventScroll:true});});
 w.querySelectorAll('[role="radio"]').forEach((b,k)=>b.onkeydown=e=>{if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)||state.expired())return;e.preventDefault();const offset=['ArrowRight','ArrowDown'].includes(e.key)?1:-1;w.querySelectorAll('[role="radio"]')[(k+offset+4)%4].click();});
 $('#prev').onclick=()=>changeQuestion(j-1);$('#next').onclick=()=>{if(!state.done(j))return;j===11?navigate('review'):changeQuestion(j+1);};
 if($('#review-now'))$('#review-now').onclick=()=>navigate('review');renderNavigator();renderTimer();
}
function renderTimer(){const ms=state.remaining(),seconds=Math.ceil(ms/1000),time=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');$('#timer').textContent=time;$('#timer-box').classList.toggle('urgent',ms<=30000);$('#timer-box').classList.toggle('expired',ms===0);$('#timer-box').setAttribute('aria-label','Time remaining '+time);$('#timer-ring').style.strokeDashoffset=String(119.38*(1-ms/180000));}
function handleExpiry(){if(activeView!=='quiz'||submitted||!state.expired())return;const q=config.awards[state.index];if(expiredNotices.has(q.id))return;expiredNotices.add(q.id);saveDraft();toast('Sawaal '+(state.index+1)+' ka time khatam. '+(state.answers[q.id]?'Selected answer lock ho gaya.':'Koi naam select nahi hua.'));const next=config.awards.findIndex((_,j)=>j>state.index&&!state.expired(j));if(next>=0)changeQuestion(next);else if(state.complete())navigate('review');else renderQuestion();}
function renderReview(){
 reviewStamp=config.awards.map((_,j)=>state.expired(j)?1:0).join('');
 const selected=Object.keys(state.answers).length;$('#review-summary').innerHTML='<strong>'+selected+' / 12 answered</strong><span>'+(12-selected)+' without a selection</span><span>Time bacha hai to Edit se answer badlein.</span>';
 $('#answers').innerHTML=config.awards.map((q,j)=>{const locked=state.expired(j);return '<div class="answer"><span class="review-number">'+String(j+1).padStart(2,'0')+'</span><div><p>'+esc(q.question)+'</p><strong>'+esc(state.answers[q.id]||'Samay samapt — koi selection nahi')+'</strong><small class="answer-state">'+(locked?'🔒 Time expired · locked':'✦ Editable until this question’s timer ends')+'</small></div><button class="edit" data-edit="'+j+'">'+(locked?'View':'Edit')+'</button></div>';}).join('');
 document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>changeQuestion(Number(b.dataset.edit)));$('#status').textContent='Final save ke baad answers change nahi honge. Yeh browser-only design demo hai.';
}
$('#back').onclick=()=>changeQuestion(state.index);
$('#submit').onclick=()=>{
 if(read(RECEIPT_KEY)){submitted=true;navigate('result');return;}
 if(!state.complete()){$('#status').textContent='Sabhi sawaalon ko complete karein.';return;}
 const payload={answers:state.snapshot().answers,unanswered:config.awards.filter(q=>!state.answers[q.id]).map(q=>q.id),savedAt:new Date().toISOString()};
 try{localStorage.setItem(RECEIPT_KEY,JSON.stringify(payload));localStorage.removeItem(DRAFT_KEY);}catch{$('#status').textContent='Browser storage unavailable. Answers save nahi hue.';return;}
 submitted=true;navigate('result');for(let n=0;n<5;n++)setTimeout(()=>burst(innerWidth/2,innerHeight/3,60),n*300);
};
function route(){let h=location.hash.slice(1)||'home';if(!['home','quiz','review','result'].includes(h))h='home';if(submitted&&['quiz','review'].includes(h))h='result';if(h==='result'&&!submitted)h='home';if(h==='review'&&!state.complete())h='quiz';activeView=h;
 if(h==='quiz'){state.open(state.index);saveDraft();renderQuestion();}if(h==='review')renderReview();
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===h));document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===h));scrollTo(0,0);
 if(h==='quiz')handleExpiry();
}
addEventListener('hashchange',route);addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')tick();});
function tick(){if(submitted)return;if(activeView==='quiz'){renderTimer();handleExpiry();}else if(activeView==='review'&&reviewStamp!==config.awards.map((_,j)=>state.expired(j)?1:0).join(''))renderReview();}
if(submitted){$('#start-link').textContent='✓ Saved confirmation dekhein';$('#start-link').href='#result';}else if(draft){$('#start-link').textContent='🪔 Jahan chhoda, wahin se continue karein';}
if('scrollRestoration' in history)history.scrollRestoration='manual';
addEventListener('pageshow',()=>requestAnimationFrame(()=>scrollTo(0,0)));
setInterval(tick,500);route();
/* hover glow + card tilt */
addEventListener('pointermove',e=>{document.body.style.setProperty('--mx',e.clientX+'px');document.body.style.setProperty('--my',e.clientY+'px');
 const c=$('#card');if(c){const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`}});
/* particles: rising embers + fireworks */
const cv=$('#fx'),cx=cv.getContext('2d'),reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;let P=[];
function rs(){cv.width=innerWidth;cv.height=innerHeight}rs();addEventListener('resize',rs);
const COL=['#FFB43A','#E04A63','#B3203F','#FFFFFF','#D9D9DE'];
function burst(x,y,n){if(reducedMotion)return;P=P.slice(-350);for(let k=0;k<n;k++){const a=Math.random()*6.28,s=1+Math.random()*5;P.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,c:COL[k%5],g:.06,r:2})}}
function ember(){P.push({x:Math.random()*cv.width,y:cv.height+10,vx:(Math.random()-.5)*.6,vy:-(.5+Math.random()*1.4),l:1.6,c:'#FFB43A',g:0,r:1+Math.random()*2,e:1})}
(function loop(){if(reducedMotion)return;cx.clearRect(0,0,cv.width,cv.height);if(Math.random()<.35)ember();
 P=P.filter(p=>p.l>0);for(const p of P){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.l-=p.e?.004:.013;cx.globalAlpha=Math.max(0,Math.min(1,p.l))*(p.e?.7:1);cx.fillStyle=p.c;cx.shadowColor=p.c;cx.shadowBlur=8;cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.28);cx.fill()}
 requestAnimationFrame(loop)})();
addEventListener('click',e=>{if(e.target.closest('.opt'))return;burst(e.clientX,e.clientY,26)});
