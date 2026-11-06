
const $=s=>document.querySelector(s);let i=0,answers={},config=null,submitted=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('#mq').textContent=('🪔 Shubh Deepawali ✨ Happy Diwali 🎆 Apne colleagues ko vote do 🪔 ').repeat(10);
function options(index){const people=config.employees;return Array.from({length:Math.min(4,people.length)},(_,k)=>people[(index*4+k)%people.length]);}
function show(){const w=$('#qw');if(!config){w.innerHTML='<h2>Sawaal load ho rahe hain…</h2>';return;}
 const q=config.awards[i];$('#pb').style.width=((i+1)/config.awards.length*100)+'%';$('#cnt').textContent='Sawaal '+(i+1)+' / '+config.awards.length;
 w.className='qwrap inn';w.innerHTML='<h2>'+esc(q.question)+'</h2>'+options(i).map((name,k)=>'<button class="opt '+(answers[q.id]===name?'selected':'')+'" data-k="'+k+'" aria-pressed="'+(answers[q.id]===name)+'"><span>'+esc(name)+'</span></button>').join('')+'<div class="row"><button class="cta ghost" id="prev" '+(i===0?'disabled':'')+'>← Pichhla</button><button class="cta" id="next" '+(!answers[q.id]?'disabled':'')+'>'+(i===config.awards.length-1?'Answers check karo':'Agla sawaal →')+'</button></div>';
 w.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{answers[q.id]=options(i)[Number(b.dataset.k)];const r=b.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,22);show();});
 $('#prev').onclick=()=>{if(i>0){i--;show();}};$('#next').onclick=()=>{if(!answers[q.id])return;if(i===config.awards.length-1){review();location.hash='review';}else{i++;show();}};
}
function review(){$('#answers').innerHTML=config.awards.map((q,j)=>'<div class="answer"><div><p>'+esc(q.question)+'</p><strong>'+esc(answers[q.id]||'Not selected')+'</strong></div><button class="edit" data-i="'+j+'">Edit</button></div>').join('');document.querySelectorAll('.edit').forEach(b=>b.onclick=()=>{i=Number(b.dataset.i);show();location.hash='quiz';});$('#status').textContent='Apne answers check karke save karein. Yeh browser-only design demo hai.';}
$('#back').onclick=()=>{i=config.awards.length-1;show();location.hash='quiz';};
const RECEIPT_KEY='diwali-vote-demo-2026-v1';
function previousSubmission(){try{return !!localStorage.getItem(RECEIPT_KEY);}catch{return false;}}
$('#submit').onclick=()=>{
 if(previousSubmission()){submitted=true;location.hash='result';route();return;}
 if(!config||Object.keys(answers).length!==config.awards.length){$('#status').textContent='Pehle sabhi sawaalon ka answer chunein.';return;}
 try{localStorage.setItem(RECEIPT_KEY,JSON.stringify({answers,savedAt:new Date().toISOString()}));}
 catch{$('#status').textContent='Browser storage unavailable. Answers save nahi hue. Browser storage enable karke try karein.';return;}
 submitted=true;answers={};location.hash='result';
 for(let n=0;n<5;n++)setTimeout(()=>burst(innerWidth/2,innerHeight/3,60),n*300);
};
function route(){let h=location.hash.slice(1)||'home';if(!['home','quiz','review','result'].includes(h))h='home';if(h==='result'&&!submitted)h='home';if(h==='review'&&(!config||Object.keys(answers).length!==config.awards.length))h='quiz';if(h==='quiz'){if(submitted){h='result';}else show();}if(h==='review')review();document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===h));document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===h));scrollTo(0,0);}
addEventListener('hashchange',route);route();
config={"employees": ["Rahul", "Anurag", "Harshit", "Akshit", "Ankur", "Abhay", "Ashok", "Priya", "Subhash", "Atul", "Gaurav", "Rajendra", "Shivang", "Sumaiyya"], "awards": [{"id": "1", "question": "Office mein sabse zyada gossip aur office updates kiske paas hote hain?"}, {"id": "2", "question": "Kaun sabse kam bolta hai lekin sab kuch observe karta hai?"}, {"id": "3", "question": "Kaun office mein sabko instructions dena pasand karta hai?"}, {"id": "4", "question": "Kaun har chhoti-badi activity par nazar rakhta hai?"}, {"id": "5", "question": "Office ki breaking news sabse pehle kaun lekar aata hai?"}, {"id": "6", "question": "Kaun apne kaam se kaam rakhta hai aur maximum focus ke saath kaam karta hai?"}, {"id": "7", "question": "Kaun har task ka follow-up lena kabhi nahi bhoolta?"}, {"id": "8", "question": "Kaun shaant rehkar office ki har situation samajh leta hai?"}, {"id": "9", "question": "Kaun har discussion aur office activity mein active rehta hai?"}, {"id": "10", "question": "Kaun har tarah ke kaam aur activities mein participate karta hai?"}, {"id": "11", "question": "Kaun kisi bhi baat par sabse late reaction deta hai?"}, {"id": "12", "question": "Kaun innocent dikhta hai lekin dimaag sabse tez chalata hai?"}], "open": false, "published": false, "ties": {}};show();
submitted=previousSubmission();route();
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
