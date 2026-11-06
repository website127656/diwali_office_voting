/* Shared state engine. No network requests; clock injection supports deterministic checks. */
(function(root){
 'use strict';
 class DiwaliQuizState {
  constructor(config,snapshot={},clock=()=>Date.now()){
   this.config=config;this.clock=clock;this.duration=180000;
   this.answers={};this.deadlines={};this.index=Number.isInteger(snapshot.index)?Math.max(0,Math.min(config.awards.length-1,snapshot.index)):0;
   config.awards.forEach((q,j)=>{
    const d=snapshot.deadlines?.[q.id];if(Number.isFinite(d)&&d>0)this.deadlines[q.id]=d;
    const answer=snapshot.answers?.[q.id];if(this.options(j).includes(answer))this.answers[q.id]=answer;
   });
  }
  options(index){const names=this.config.employees;return Array.from({length:Math.min(4,names.length)},(_,k)=>names[(index*4+k)%names.length]);}
  open(index){if(!Number.isInteger(index)||index<0||index>=this.config.awards.length)return false;this.index=index;const id=this.config.awards[index].id;if(!this.deadlines[id])this.deadlines[id]=this.clock()+this.duration;return true;}
  remaining(index=this.index){const id=this.config.awards[index].id;return this.deadlines[id]?Math.max(0,this.deadlines[id]-this.clock()):this.duration;}
  expired(index=this.index){const id=this.config.awards[index].id;return !!this.deadlines[id]&&this.remaining(index)===0;}
  choose(name){const id=this.config.awards[this.index].id;if(!this.deadlines[id]||this.expired()||!this.options(this.index).includes(name))return false;this.answers[id]=name;return true;}
  done(index){return !!this.answers[this.config.awards[index].id]||this.expired(index);}
  complete(){return this.config.awards.every((_,j)=>this.done(j));}
  snapshot(){return {index:this.index,answers:{...this.answers},deadlines:{...this.deadlines}};}
 }
 root.DiwaliQuizState=DiwaliQuizState;
 if(typeof module!=='undefined'&&module.exports)module.exports=DiwaliQuizState;
})(typeof globalThis!=='undefined'?globalThis:this);
