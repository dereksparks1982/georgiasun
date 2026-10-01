(() => {
  const RANKS=['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
  const SUITS=['♠','♥','♦','♣'];
  const opponents=[
    {name:'Elias Mercer',style:'Cautious',aggr:.28,bluff:.08},
    {name:'Thomas Hale',style:'Aggressive',aggr:.68,bluff:.18},
    {name:'Samuel Price',style:'Steady',aggr:.45,bluff:.11}
  ];
  let G=null;

  const el=id=>document.getElementById(id);
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function deck(){return shuffle(RANKS.flatMap((r,ri)=>SUITS.map(s=>({r,s,v:ri+2}))))}
  function cardHTML(c,down=false){if(down)return '<span class="playing-card back">?</span>';const red=c.s==='♥'||c.s==='♦';return `<span class="playing-card ${red?'red':''}">${c.r}${c.s}</span>`}
  function choose(arr){return arr[Math.floor(Math.random()*arr.length)]}
  function log(t){if(!G)return;G.log.unshift(t);G.log=G.log.slice(0,30)}
  function rank5(cards){
    const vals=cards.map(c=>c.v).sort((a,b)=>b-a);const counts={};vals.forEach(v=>counts[v]=(counts[v]||0)+1);
    const flush=cards.every(c=>c.s===cards[0].s);let uniq=[...new Set(vals)];if(uniq[0]===14)uniq.push(1);
    let straightHigh=0;for(let i=0;i<=uniq.length-5;i++){if(uniq[i]-uniq[i+4]===4){straightHigh=uniq[i];break}}
    const groups=Object.entries(counts).map(([v,n])=>({v:+v,n})).sort((a,b)=>b.n-a.n||b.v-a.v);
    if(flush&&straightHigh)return [8,straightHigh];
    if(groups[0].n===4)return [7,groups[0].v,groups.find(g=>g.n===1).v];
    if(groups[0].n===3&&groups[1]?.n>=2)return [6,groups[0].v,groups[1].v];
    if(flush)return [5,...vals];
    if(straightHigh)return [4,straightHigh];
    if(groups[0].n===3)return [3,groups[0].v,...groups.filter(g=>g.n===1).map(g=>g.v)];
    if(groups[0].n===2&&groups[1]?.n===2){const ps=[groups[0].v,groups[1].v].sort((a,b)=>b-a);return [2,...ps,groups.find(g=>g.n===1).v]}
    if(groups[0].n===2)return [1,groups[0].v,...groups.filter(g=>g.n===1).map(g=>g.v)];
    return [0,...vals];
  }
  function combos(arr,k,start=0,p=[],out=[]){if(p.length===k){out.push(p.slice());return out}for(let i=start;i<arr.length;i++){p.push(arr[i]);combos(arr,k,i+1,p,out);p.pop()}return out}
  function best7(cards){let best=null;for(const c of combos(cards,5)){const r=rank5(c);if(!best||cmp(r,best)>0)best=r}return best}
  function cmp(a,b){for(let i=0;i<Math.max(a.length,b.length);i++){const d=(a[i]||0)-(b[i]||0);if(d)return d}return 0}
  const handNames=['High Card','Pair','Two Pair','Three of a Kind','Straight','Flush','Full House','Four of a Kind','Straight Flush'];
  function preflopScore(h){const [a,b]=h.sort((x,y)=>y.v-x.v);let s=(a.v+b.v)/28;if(a.v===b.v)s+=.34;if(a.s===b.s)s+=.08;if(Math.abs(a.v-b.v)<=2)s+=.07;if(a.v>=13)s+=.08;return Math.min(1,s)}
  function strength(p){if(G.board.length<3)return preflopScore(p.hole);const r=best7([...p.hole,...G.board]);return Math.min(1,(r[0]/8)*.78+((r[1]||0)/14)*.22)}
  function pay(p,amt){const x=Math.min(amt,p.chips);p.chips-=x;p.bet+=x;G.pot+=x;return x}
  function resetBets(){G.players.forEach(p=>p.bet=0);G.currentBet=0}
  function active(){return G.players.filter(p=>!p.folded&&p.chips>=0)}
  function startTable(){
    const buy=Math.max(50,Math.floor(Number(el('pokerBuyIn').value)||100));if(state.cash<buy)return toast('Not enough estate cash for that buy-in.');
    state.cash-=buy;
    G={deck:deck(),board:[],pot:0,currentBet:0,phase:'preflop',dealer:0,hand:1,log:[],finished:false,players:[{name:'You',style:'Player',human:true,chips:buy,hole:[],bet:0,folded:false},...opponents.map(o=>({...o,human:false,chips:buy,hole:[],bet:0,folded:false}))]};
    el('pokerBuyinPanel').classList.add('hidden');el('pokerGame').classList.remove('hidden');dealHand();renderPoker();render();
  }
  function dealHand(){
    G.deck=deck();G.board=[];G.pot=0;G.currentBet=0;G.finished=false;G.phase='preflop';G.players.forEach(p=>{p.hole=[G.deck.pop(),G.deck.pop()];p.bet=0;p.folded=p.chips<=0});
    G.dealer=(G.dealer+1)%G.players.length;const sb=G.players[(G.dealer+1)%G.players.length],bb=G.players[(G.dealer+2)%G.players.length];pay(sb,1);pay(bb,2);G.currentBet=2;log(`Hand ${G.hand}: blinds posted.`);renderPoker();
  }
  function aiAct(p){if(p.folded||p.chips<=0)return;const call=Math.max(0,G.currentBet-p.bet);const s=strength(p);const style=p.aggr||.4;const bluff=Math.random()<(p.bluff||.08);
    if(call>0&&s<.27&&!bluff){p.folded=true;log(`${p.name} folds.`);return}
    if(p.chips>call+2&&(s>.62||bluff)&&Math.random()<style){const raise=Math.min(p.chips,call+Math.max(2,Math.round((G.pot+4)*(s*.28))));const paid=pay(p,raise);G.currentBet=Math.max(G.currentBet,p.bet);log(`${p.name} raises ${paid}.`);return}
    if(call>0){const paid=pay(p,call);log(`${p.name} calls ${paid}.`)}else log(`${p.name} checks.`)
  }
  function playerAction(kind){if(!G||G.finished)return;const p=G.players[0],call=Math.max(0,G.currentBet-p.bet);
    if(kind==='fold'){p.folded=true;log('You fold.')}else if(kind==='call'){if(call>0){const x=pay(p,call);log(`You call ${x}.`)}else log('You check.')}else if(kind==='raise'){const target=Math.max(G.currentBet+2,Math.floor(Number(el('pokerRaise').value)||G.currentBet+2));const add=Math.max(0,target-p.bet);const x=pay(p,add);G.currentBet=Math.max(G.currentBet,p.bet);log(`You raise ${x}.`)}
    for(let i=1;i<G.players.length;i++)aiAct(G.players[i]);resolveStreet();renderPoker();
  }
  function resolveStreet(){const alive=active().filter(p=>!p.folded);if(alive.length===1){finish([alive[0]]);return}
    if(G.phase==='preflop'){G.board.push(G.deck.pop(),G.deck.pop(),G.deck.pop());G.phase='flop';resetBets();log('Flop dealt.');return}
    if(G.phase==='flop'){G.board.push(G.deck.pop());G.phase='turn';resetBets();log('Turn dealt.');return}
    if(G.phase==='turn'){G.board.push(G.deck.pop());G.phase='river';resetBets();log('River dealt.');return}
    showdown();
  }
  function showdown(){const alive=active().filter(p=>!p.folded);const scored=alive.map(p=>({p,r:best7([...p.hole,...G.board])})).sort((a,b)=>cmp(b.r,a.r));const top=scored[0].r;const winners=scored.filter(x=>cmp(x.r,top)===0).map(x=>x.p);finish(winners,handNames[top[0]])}
  function finish(winners,hand=''){const share=Math.floor(G.pot/winners.length);winners.forEach(w=>w.chips+=share);G.finished=true;G.phase='done';const names=winners.map(w=>w.name).join(' & ');log(`${names} win ${G.pot}${hand?` with ${hand}`:''}.`);G.pot=0;renderPoker()}
  function nextHand(){if(!G)return;G.hand++;dealHand()}
  function cashOut(){if(!G)return;const p=G.players[0];state.cash+=p.chips;state.events.unshift({date:currentDate(),text:`Poker table cashed out for ${money(p.chips)}.`});G=null;el('pokerGame').classList.add('hidden');el('pokerBuyinPanel').classList.remove('hidden');render();}
  function renderPoker(){if(!G)return;el('pokerPhase').textContent=`Hand ${G.hand} • ${G.phase.toUpperCase()}`;el('pokerPot').textContent=`Pot: ${money(G.pot)}`;
    el('pokerBoard').innerHTML=G.board.map(c=>cardHTML(c)).join('')||'<span class="muted">No community cards yet</span>';
    el('pokerSeats').innerHTML=G.players.map((p,i)=>`<div class="poker-seat ${p.folded?'folded':''}"><div class="name">${p.name} <small>${p.style||''}</small></div><div>${money(p.chips)} chips • bet ${money(p.bet)}</div><div class="poker-cards">${p.hole.map(c=>cardHTML(c,!p.human&&!G.finished)).join('')}</div></div>`).join('');
    const call=Math.max(0,G.currentBet-G.players[0].bet);el('pokerCall').textContent=call?`Call ${money(call)}`:'Check';el('pokerActions').classList.toggle('hidden',G.finished||G.players[0].folded);el('pokerNext').classList.toggle('hidden',!G.finished);el('pokerLog').innerHTML=G.log.map(x=>`<div>${x}</div>`).join('');
    el('pokerStatus').textContent=G.finished?'Hand complete. Deal the next hand or cash out.':`Your turn. Current bet: ${money(G.currentBet)}.`;
  }
  function init(){if(!el('pokerModule'))return;el('startPoker').onclick=startTable;el('pokerFold').onclick=()=>playerAction('fold');el('pokerCall').onclick=()=>playerAction('call');el('pokerRaiseBtn').onclick=()=>playerAction('raise');el('pokerNext').onclick=nextHand;el('pokerCashOut').onclick=cashOut}
  init();
})();
