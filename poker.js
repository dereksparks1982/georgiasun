(() => {
  const RANKS=['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
  const SUITS=['♠','♥','♦','♣'];
  const BASE_OPPONENTS=[
    {id:'elias',name:'Elias Mercer',style:'Cautious',aggr:.28,bluff:.06,patience:.78},
    {id:'thomas',name:'Thomas Hale',style:'Aggressive',aggr:.70,bluff:.19,patience:.42},
    {id:'samuel',name:'Samuel Price',style:'Steady',aggr:.46,bluff:.10,patience:.61}
  ];
  const HAND_NAMES=['High Card','Pair','Two Pair','Three of a Kind','Straight','Flush','Full House','Four of a Kind','Straight Flush'];
  const SB=1,BB=2;
  let G=null;
  const el=id=>document.getElementById(id);
  const clampN=(n,a,b)=>Math.max(a,Math.min(b,n));

  function ensurePersistent(){
    state.pokerStats=state.pokerStats||{hands:0,wins:0,losses:0,playerActions:0,playerRaises:0,totalBuyins:0,totalCashouts:0,biggestPot:0,history:[]};
    state.pokerProfiles=state.pokerProfiles||{};
    for(const b of BASE_OPPONENTS){
      state.pokerProfiles[b.id]=state.pokerProfiles[b.id]||{...b,hands:0,wins:0,folds:0,raises:0,showdowns:0,moneyWon:0,moneyLost:0,lastResult:'No history yet'};
    }
  }
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function deck(){return shuffle(RANKS.flatMap((r,ri)=>SUITS.map(s=>({r,s,v:ri+2}))))}
  function cardHTML(c,down=false){if(down)return '<span class="playing-card back">?</span>';const red=c.s==='♥'||c.s==='♦';const face=c.r==='T'?'10':c.r;return `<span class="playing-card ${red?'red':''}">${face}${c.s}</span>`}
  function log(t){if(!G)return;G.log.unshift(t);G.log=G.log.slice(0,40)}

  function rank5(cards){
    const vals=cards.map(c=>c.v).sort((a,b)=>b-a),counts={};vals.forEach(v=>counts[v]=(counts[v]||0)+1);
    const flush=cards.every(c=>c.s===cards[0].s);let uniq=[...new Set(vals)];if(uniq[0]===14)uniq.push(1);
    let straightHigh=0;for(let i=0;i<=uniq.length-5;i++){if(uniq[i]-uniq[i+4]===4){straightHigh=uniq[i];break}}
    const groups=Object.entries(counts).map(([v,n])=>({v:+v,n})).sort((a,b)=>b.n-a.n||b.v-a.v);
    if(flush&&straightHigh)return [8,straightHigh];
    if(groups[0].n===4)return [7,groups[0].v,groups.find(g=>g.n===1).v];
    if(groups[0].n===3&&groups[1]?.n>=2)return [6,groups[0].v,groups[1].v];
    if(flush)return [5,...vals];if(straightHigh)return [4,straightHigh];
    if(groups[0].n===3)return [3,groups[0].v,...groups.filter(g=>g.n===1).map(g=>g.v)];
    if(groups[0].n===2&&groups[1]?.n===2){const ps=[groups[0].v,groups[1].v].sort((a,b)=>b-a);return [2,...ps,groups.find(g=>g.n===1).v]}
    if(groups[0].n===2)return [1,groups[0].v,...groups.filter(g=>g.n===1).map(g=>g.v)];
    return [0,...vals];
  }
  function combos(arr,k,start=0,p=[],out=[]){if(p.length===k){out.push(p.slice());return out}for(let i=start;i<arr.length;i++){p.push(arr[i]);combos(arr,k,i+1,p,out);p.pop()}return out}
  function cmp(a,b){for(let i=0;i<Math.max(a.length,b.length);i++){const d=(a[i]||0)-(b[i]||0);if(d)return d}return 0}
  function best7(cards){let best=null;for(const c of combos(cards,5)){const r=rank5(c);if(!best||cmp(r,best)>0)best=r}return best}
  function preflopScore(h){const cards=[...h].sort((x,y)=>y.v-x.v),a=cards[0],b=cards[1];let s=(a.v+b.v)/28;if(a.v===b.v)s+=.34;if(a.s===b.s)s+=.08;if(Math.abs(a.v-b.v)<=2)s+=.07;if(a.v>=13)s+=.08;return Math.min(1,s)}
  function strength(p){if(G.board.length<3)return preflopScore(p.hole);const r=best7([...p.hole,...G.board]);return Math.min(1,(r[0]/8)*.8+((r[1]||0)/14)*.2)}

  function nextSeat(from,predicate){for(let n=1;n<=G.players.length;n++){const i=(from+n)%G.players.length;if(predicate(G.players[i],i))return i}return -1}
  function livePlayers(){return G.players.filter(p=>!p.folded)}
  function canAct(p){return !p.folded&&!p.allIn&&p.chips>0}
  function needsAction(p){return canAct(p)&&(!p.acted||p.streetBet<G.currentBet)}
  function commit(p,amount){const paid=Math.max(0,Math.min(Math.floor(amount),p.chips));p.chips-=paid;p.streetBet+=paid;p.totalCommitted+=paid;G.pot+=paid;if(p.chips===0)p.allIn=true;return paid}
  function markRaise(raiser,newBet){G.currentBet=newBet;for(const p of G.players)if(p!==raiser&&canAct(p))p.acted=false;raiser.acted=true}

  function injectControls(){
    if(!el('pokerModule'))return;
    const buy=el('pokerBuyinPanel');
    if(buy&&!el('pokerAllCash')){const b=document.createElement('button');b.id='pokerAllCash';b.className='secondary-btn';b.textContent='Buy In With All Cash';buy.insertBefore(b,buy.querySelector('.muted'));}
    const acts=el('pokerActions');
    if(acts&&!el('pokerAllIn')){const b=document.createElement('button');b.id='pokerAllIn';b.className='secondary-btn danger-btn';b.textContent='All In';acts.appendChild(b);}
    if(!el('pokerStatsPanel')){const d=document.createElement('div');d.id='pokerStatsPanel';d.className='poker-meta-panel';el('pokerModule').appendChild(d);}
    if(!el('pokerProfilesPanel')){const d=document.createElement('div');d.id='pokerProfilesPanel';d.className='poker-meta-panel';el('pokerModule').appendChild(d);}
  }

  function startTable(){
    ensurePersistent();
    const requested=Math.max(50,Math.floor(Number(el('pokerBuyIn').value)||100));
    if(requested>state.cash)return toast('Not enough estate cash for that buy-in. Borrow against the estate first if you want to risk more.');
    state.cash-=requested;state.pokerStats.totalBuyins+=requested;
    const profiles=BASE_OPPONENTS.map(b=>state.pokerProfiles[b.id]);
    G={deck:[],board:[],pot:0,currentBet:0,minRaise:BB,phase:'waiting',dealer:-1,actionIndex:-1,hand:0,log:[],finished:true,sessionBuyin:requested,showdown:false,
      players:[{id:'you',name:'You',style:'Player',human:true,chips:requested,hole:[],streetBet:0,totalCommitted:0,folded:false,allIn:false,acted:false},
        ...profiles.map(p=>({...p,human:false,chips:requested,hole:[],streetBet:0,totalCommitted:0,folded:false,allIn:false,acted:false}))]};
    el('pokerBuyinPanel').classList.add('hidden');el('pokerGame').classList.remove('hidden');dealHand();render();
  }

  function dealHand(){
    if(!G)return;
    const funded=G.players.filter(p=>p.chips>0);
    if(funded.length<2){log('The table breaks because fewer than two players have chips.');G.finished=true;renderPoker();return}
    G.hand++;G.deck=deck();G.board=[];G.pot=0;G.currentBet=0;G.minRaise=BB;G.phase='preflop';G.finished=false;G.showdown=false;
    G.players.forEach(p=>{p.hole=p.chips>0?[G.deck.pop(),G.deck.pop()]:[];p.streetBet=0;p.totalCommitted=0;p.folded=p.chips<=0;p.allIn=false;p.acted=false;p.winner=false});
    G.dealer=nextSeat(G.dealer,p=>p.chips>0);
    const sbIdx=nextSeat(G.dealer,p=>p.chips>0),bbIdx=nextSeat(sbIdx,p=>p.chips>0);
    G.sbIdx=sbIdx;G.bbIdx=bbIdx;
    const sb=G.players[sbIdx],bb=G.players[bbIdx];commit(sb,SB);commit(bb,BB);G.currentBet=Math.max(sb.streetBet,bb.streetBet);
    log(`Hand ${G.hand}: ${sb.name} posts ${money(SB)}, ${bb.name} posts ${money(BB)}.`);
    G.actionIndex=nextSeat(bbIdx,p=>needsAction(p));
    renderPoker();setTimeout(continueAction,350);
  }

  function playerAggression(){const s=state.pokerStats;return s.playerActions?clampN(s.playerRaises/s.playerActions,0,1):.2}
  function recordAction(p,kind){
    if(p.human){state.pokerStats.playerActions++;if(kind==='raise'||kind==='allin')state.pokerStats.playerRaises++;return}
    const pr=state.pokerProfiles[p.id];if(!pr)return;if(kind==='fold')pr.folds++;if(kind==='raise'||kind==='allin')pr.raises++;
  }

  function aiDecision(p){
    const call=Math.max(0,G.currentBet-p.streetBet),s=strength(p),potOdds=call?call/Math.max(1,G.pot+call):0;
    const observedAgg=playerAggression();
    const bluff=Math.random()<(p.bluff||.08)*(1+(1-observedAgg)*.35);
    const value=s+(p.aggr-.45)*.08;
    const foldThreshold=.22+potOdds*.55-(p.patience-.5)*.08-(observedAgg>.55?.035:0);
    if(call>0&&value<foldThreshold&&!bluff)return {kind:'fold'};
    const canRaise=p.chips>call&&livePlayers().length>1;
    if(canRaise&&(value>.61||bluff)&&Math.random()<(p.aggr||.45)){
      const baseRaise=Math.max(G.minRaise,Math.round(Math.max(BB,G.pot*.22)*(0.75+value)));
      const target=Math.min(p.streetBet+p.chips,G.currentBet+baseRaise);
      if(target>=p.streetBet+p.chips)return {kind:'allin'};
      return {kind:'raise',target};
    }
    if(call>=p.chips&&call>0)return {kind:'allin'};
    return {kind:'call'};
  }

  function applyAction(p,decision){
    const call=Math.max(0,G.currentBet-p.streetBet);
    if(decision.kind==='fold'){p.folded=true;p.acted=true;recordAction(p,'fold');log(`${p.name} folds.`);return}
    if(decision.kind==='call'){
      const paid=commit(p,call);p.acted=true;recordAction(p,'call');log(call?`${p.name} ${p.allIn?'calls all-in':'calls'} ${money(paid)}.`:`${p.name} checks.`);return;
    }
    if(decision.kind==='allin'){
      const before=p.streetBet;const paid=commit(p,p.chips);const target=p.streetBet;p.acted=true;recordAction(p,'allin');
      if(target>G.currentBet){const raiseBy=target-G.currentBet;if(raiseBy>=G.minRaise){G.minRaise=raiseBy;markRaise(p,target)}else G.currentBet=target;}
      log(`${p.name} moves all in for ${money(paid)}${target>before?` (to ${money(target)})`:''}.`);return;
    }
    if(decision.kind==='raise'){
      const maxTarget=p.streetBet+p.chips;let target=clampN(Math.floor(decision.target||0),G.currentBet+G.minRaise,maxTarget);
      if(maxTarget<=G.currentBet){return applyAction(p,{kind:'call'})}
      if(target>=maxTarget)return applyAction(p,{kind:'allin'});
      const old=G.currentBet,paid=commit(p,target-p.streetBet);const raiseBy=p.streetBet-old;G.minRaise=Math.max(G.minRaise,raiseBy);markRaise(p,p.streetBet);recordAction(p,'raise');log(`${p.name} raises to ${money(p.streetBet)}.`);return;
    }
  }

  function continueAction(){
    if(!G||G.finished)return;
    const live=livePlayers();
    if(live.length===1){awardUncontested(live[0]);return}
    const actionable=G.players.filter(canAct);
    if(actionable.length===0){runoutAndShowdown();return}
    if(!G.players.some(needsAction)){advanceStreet();return}
    if(G.actionIndex<0||!needsAction(G.players[G.actionIndex]))G.actionIndex=nextSeat(G.actionIndex<0?G.dealer:G.actionIndex,p=>needsAction(p));
    if(G.actionIndex<0){advanceStreet();return}
    const p=G.players[G.actionIndex];renderPoker();
    if(p.human)return;
    const d=aiDecision(p);applyAction(p,d);G.actionIndex=nextSeat(G.actionIndex,p=>needsAction(p));renderPoker();setTimeout(continueAction,420);
  }

  function playerAction(kind){
    if(!G||G.finished||G.actionIndex!==0||!needsAction(G.players[0]))return;
    const p=G.players[0],call=Math.max(0,G.currentBet-p.streetBet);let d={kind};
    if(kind==='raise'){
      const target=Math.floor(Number(el('pokerRaise').value)||0),max=p.streetBet+p.chips;
      if(max<=G.currentBet)return toast('You do not have enough chips to raise.');
      const min=Math.min(max,G.currentBet+G.minRaise);
      if(target<min)return toast(`Minimum raise is to ${money(min)}.`);
      d={kind:'raise',target};
    }
    if(kind==='call'&&call>=p.chips&&call>0)d={kind:'allin'};
    applyAction(p,d);G.actionIndex=nextSeat(0,x=>needsAction(x));renderPoker();setTimeout(continueAction,250);
  }

  function resetStreet(){G.currentBet=0;G.minRaise=BB;G.players.forEach(p=>{p.streetBet=0;p.acted=!canAct(p)});G.actionIndex=nextSeat(G.dealer,p=>needsAction(p))}
  function advanceStreet(){
    if(G.phase==='preflop'){G.board.push(G.deck.pop(),G.deck.pop(),G.deck.pop());G.phase='flop';log('Flop dealt.');resetStreet();}
    else if(G.phase==='flop'){G.board.push(G.deck.pop());G.phase='turn';log('Turn dealt.');resetStreet();}
    else if(G.phase==='turn'){G.board.push(G.deck.pop());G.phase='river';log('River dealt.');resetStreet();}
    else {showdown();return}
    renderPoker();setTimeout(continueAction,350);
  }
  function runoutAndShowdown(){while(G.board.length<5)G.board.push(G.deck.pop());G.phase='river';log('All remaining players are all-in. The board runs out.');showdown()}

  function sidePots(){
    const levels=[...new Set(G.players.map(p=>p.totalCommitted).filter(v=>v>0))].sort((a,b)=>a-b);let prev=0;const pots=[];
    for(const level of levels){const contributors=G.players.filter(p=>p.totalCommitted>=level);const amount=(level-prev)*contributors.length;const eligible=contributors.filter(p=>!p.folded);if(amount>0)pots.push({amount,eligible,level});prev=level}
    return pots;
  }
  function distributePot(){
    const pots=sidePots(),awards=new Map(),summary=[];
    for(const pot of pots){if(!pot.eligible.length)continue;
      if(pot.eligible.length===1){const w=pot.eligible[0];awards.set(w,(awards.get(w)||0)+pot.amount);summary.push(`${w.name} takes ${money(pot.amount)} uncontested`);continue}
      const scored=pot.eligible.map(p=>({p,r:best7([...p.hole,...G.board])}));let top=scored[0].r;for(const x of scored)if(cmp(x.r,top)>0)top=x.r;
      const winners=scored.filter(x=>cmp(x.r,top)===0).map(x=>x.p),share=Math.floor(pot.amount/winners.length),rem=pot.amount-share*winners.length;
      winners.forEach((w,i)=>awards.set(w,(awards.get(w)||0)+share+(i===0?rem:0)));summary.push(`${winners.map(w=>w.name).join(' & ')} win ${money(pot.amount)} with ${HAND_NAMES[top[0]]}`);
    }
    for(const [p,amt] of awards){p.chips+=amt;p.winner=true}
    return {awards,summary};
  }
  function showdown(){
    while(G.board.length<5)G.board.push(G.deck.pop());G.showdown=true;G.phase='showdown';
    const {awards,summary}=distributePot();const winners=[...awards.keys()];finishHand(winners,summary,true);
  }
  function awardUncontested(winner){winner.chips+=G.pot;winner.winner=true;finishHand([winner],[`${winner.name} wins ${money(G.pot)} after everyone else folds.`],false)}

  function finishHand(winners,summary,showdownFlag){
    const potSize=G.pot;G.finished=true;G.phase='done';G.showdown=showdownFlag;G.pot=0;summary.forEach(log);
    ensurePersistent();const s=state.pokerStats;s.hands++;s.biggestPot=Math.max(s.biggestPot,potSize);const humanWon=winners.some(p=>p.human);humanWon?s.wins++:s.losses++;
    for(const p of G.players.filter(p=>!p.human)){
      const pr=state.pokerProfiles[p.id];if(!pr)continue;pr.hands++;if(showdownFlag&&!p.folded)pr.showdowns++;if(winners.includes(p)){pr.wins++;pr.moneyWon+=potSize;pr.lastResult=`Won hand ${G.hand}`}else{pr.moneyLost+=p.totalCommitted;pr.lastResult=`Lost/folded hand ${G.hand}`}
    }
    s.history.unshift({hand:G.hand,date:typeof currentDate==='function'?currentDate():'',pot:potSize,winners:winners.map(w=>w.name),result:humanWon?'Win':'Loss'});s.history=s.history.slice(0,30);
    renderPoker();renderPersistentPanels();
  }

  function nextHand(){if(!G||!G.finished)return;G.players.forEach(p=>p.winner=false);dealHand()}
  function cashOut(){
    if(!G)return;if(!G.finished)return toast('Finish or fold the current hand before leaving the table.');
    const p=G.players[0],amount=p.chips;state.cash+=amount;state.pokerStats.totalCashouts+=amount;state.events.unshift({date:currentDate(),text:`Poker table cashed out for ${money(amount)} after ${G.hand} hands.`});
    G=null;el('pokerGame').classList.add('hidden');el('pokerBuyinPanel').classList.remove('hidden');render();renderPersistentPanels();
  }

  function renderPoker(){
    if(!G)return;
    el('pokerPhase').textContent=`Hand ${G.hand} • ${G.phase.toUpperCase()}`;el('pokerPot').textContent=`Pot: ${money(G.pot)}`;
    el('pokerBoard').innerHTML=G.board.map(c=>cardHTML(c)).join('')||'<span class="muted">No community cards yet</span>';
    el('pokerSeats').innerHTML=G.players.map((p,i)=>`<div class="poker-seat ${p.folded?'folded':''} ${p.allIn?'all-in':''} ${G.actionIndex===i&&!G.finished?'active':''} ${p.winner?'winner':''}"><div class="name">${p.name} <small>${p.style||''}</small></div><div>${money(p.chips)} chips • street ${money(p.streetBet)} • committed ${money(p.totalCommitted)}</div><div class="seat-flags">${i===G.dealer?'D ':''}${i===G.sbIdx?'SB ':''}${i===G.bbIdx?'BB ':''}${p.allIn?'ALL IN':''}</div><div class="poker-cards">${p.hole.map(c=>cardHTML(c,!p.human&&!G.showdown)).join('')}</div></div>`).join('');
    const human=G.players[0],call=Math.max(0,G.currentBet-human.streetBet),yourTurn=!G.finished&&G.actionIndex===0&&needsAction(human);
    el('pokerCall').textContent=call?`Call ${money(Math.min(call,human.chips))}`:'Check';
    el('pokerActions').classList.toggle('hidden',!yourTurn);el('pokerNext').classList.toggle('hidden',!G.finished);
    if(el('pokerAllIn'))el('pokerAllIn').disabled=!yourTurn||human.chips<=0;
    el('pokerCashOut').disabled=!G.finished;
    const minRaise=Math.min(human.streetBet+human.chips,G.currentBet+G.minRaise),maxRaise=human.streetBet+human.chips;
    if(el('pokerRaise')){el('pokerRaise').min=Math.max(0,minRaise);el('pokerRaise').max=Math.max(0,maxRaise);if(Number(el('pokerRaise').value)<minRaise||Number(el('pokerRaise').value)>maxRaise)el('pokerRaise').value=minRaise;}
    el('pokerLog').innerHTML=G.log.map(x=>`<div>${x}</div>`).join('');
    el('pokerStatus').textContent=G.finished?'Hand complete. Deal again or cash out.':yourTurn?`Your turn. ${call?`${money(call)} to call.`:'You may check.'} Minimum full raise: ${money(minRaise)}.`:`Waiting on ${G.players[G.actionIndex]?.name||'the table'}…`;
    renderPersistentPanels();
  }

  function renderPersistentPanels(){
    if(!el('pokerStatsPanel'))return;ensurePersistent();const s=state.pokerStats,net=s.totalCashouts-s.totalBuyins;
    el('pokerStatsPanel').innerHTML=`<div class="poker-mini-grid"><div><span>Career hands</span><b>${s.hands}</b></div><div><span>Wins</span><b>${s.wins}</b></div><div><span>Biggest pot</span><b>${money(s.biggestPot)}</b></div><div><span>Table cash flow</span><b class="${net>=0?'good-text':'bad-text'}">${net>=0?'+':''}${money(net)}</b></div></div><div class="poker-history">${s.history.slice(0,6).map(h=>`<span>Hand ${h.hand}: ${h.result} • ${money(h.pot)} • ${h.winners.join(', ')}</span>`).join('')}</div>`;
    el('pokerProfilesPanel').innerHTML=`<div class="section-head compact"><h4>Opponent Memory</h4><span class="badge">Persists through this save</span></div><div class="poker-profile-grid">${BASE_OPPONENTS.map(b=>{const p=state.pokerProfiles[b.id];const foldRate=p.hands?Math.round(p.folds/Math.max(1,p.hands)*100):0;return `<div class="poker-profile"><b>${p.name}</b><small>${p.style} • ${p.hands} hands • ${p.wins} wins • ${foldRate}% recorded folds<br>${p.lastResult}</small></div>`}).join('')}</div>`;
  }

  function init(){
    if(!el('pokerModule'))return;ensurePersistent();injectControls();renderPersistentPanels();
    el('startPoker').onclick=startTable;el('pokerFold').onclick=()=>playerAction('fold');el('pokerCall').onclick=()=>playerAction('call');el('pokerRaiseBtn').onclick=()=>playerAction('raise');el('pokerNext').onclick=nextHand;el('pokerCashOut').onclick=cashOut;
    el('pokerAllIn').onclick=()=>playerAction('allin');el('pokerAllCash').onclick=()=>{el('pokerBuyIn').value=Math.max(50,Math.floor(state.cash))};
  }
  init();
})();

const estateModule=document.createElement('script');
estateModule.src='estate.js';
estateModule.onload=()=>{
  const version=document.querySelector('.sidebar-footer span:first-child');if(version)version.textContent='Prototype v0.7-dev';
  const advance=document.getElementById('advanceTurn');
  if(advance){const estateAdvance=advance.onclick;advance.onclick=()=>{const modal=document.getElementById('decisionModal');if(modal&&!modal.classList.contains('hidden'))return toast('Resolve the pending decision first.');estateAdvance();}}
  const operatingModule=document.createElement('script');operatingModule.src='operating.js';document.body.appendChild(operatingModule);
};
document.body.appendChild(estateModule);