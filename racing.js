(() => {
  const horseNames = [
    'Georgia Belle','Red Lantern','King Cotton','Sweet Magnolia','Black Creek','Old Thunder',
    'Pine Runner','Savannah Star','Blue Heron','Copper Jack','River Queen','Magnolia Fire',
    'Lowcountry Lad','Peachtree Pride','Tallulah','Macon Moon','Golden Cane','Cedar Smoke'
  ];
  const jockeys=['E. Turner','J. Bell','S. Carter','W. Hale','T. Brooks','R. Dean','M. Cole','A. Price'];
  const surfaces=['Firm','Dry','Muddy','Heavy'];
  const distances=[['6 furlongs','sprint'],['1 mile','mile'],['1¼ miles','route']];
  const history=[];
  let mode='quick';
  let field=[];
  let running=false;
  let raceTimer=null;

  const els = () => ({
    meta:document.getElementById('raceMeta'),
    field:document.getElementById('raceField'),
    horse:document.getElementById('raceHorseSelect'),
    bet:document.getElementById('raceBetType'),
    wager:document.getElementById('raceWager'),
    newField:document.getElementById('newRaceField'),
    start:document.getElementById('startHorseRace'),
    status:document.getElementById('raceStatus'),
    bars:document.getElementById('raceBars'),
    hist:document.getElementById('raceHistory')
  });

  function rand(a,b){return a+Math.random()*(b-a)}
  function pick(a){return a[Math.floor(Math.random()*a.length)]}
  function formString(){
    return Array.from({length:5},()=>Math.ceil(rand(1,6))).join(' · ');
  }
  function oddsFromRating(rating){
    const decimal=clamp(7.8-(rating-50)*.075,1.7,14);
    const n=Math.max(1,Math.round(decimal-1));
    return {display:`${n}:1`,decimal:n+1};
  }
  function makeHorse(i){
    const speed=rand(48,92), stamina=rand(45,94), consistency=rand(45,93), kick=rand(40,96), start=rand(45,94), jockey=rand(48,92);
    const condition=pick(['Excellent','Good','Good','Fair']);
    const preference=pick(surfaces);
    const distancePref=pick(['sprint','mile','route']);
    const rating=(speed*.28+stamina*.2+consistency*.16+kick*.12+start*.1+jockey*.14)+(condition==='Excellent'?4:condition==='Fair'?-3:0);
    const odds=oddsFromRating(rating);
    return {id:i+1,name:horseNames.splice(Math.floor(Math.random()*horseNames.length),1)[0],jockey:pick(jockeys),speed,stamina,consistency,kick,start,jockeySkill:jockey,condition,preference,distancePref,rating,odds,form:formString(),progress:0,finished:false,finishAt:null};
  }
  function generateField(){
    if(running)return;
    const namesBackup=[
      'Georgia Belle','Red Lantern','King Cotton','Sweet Magnolia','Black Creek','Old Thunder',
      'Pine Runner','Savannah Star','Blue Heron','Copper Jack','River Queen','Magnolia Fire',
      'Lowcountry Lad','Peachtree Pride','Tallulah','Macon Moon','Golden Cane','Cedar Smoke'
    ];
    horseNames.splice(0,horseNames.length,...namesBackup);
    field=Array.from({length:6},(_,i)=>makeHorse(i)).sort((a,b)=>b.rating-a.rating);
    field.forEach((h,i)=>h.post=i+1);
    const e=els();
    const surface=pick(surfaces); const distance=pick(distances);
    field.surface=surface; field.distance=distance;
    e.meta.innerHTML=`<span class="race-chip">${mode==='quick'?'Quick Race':'Main Event'}</span><span class="race-chip">Track: ${surface}</span><span class="race-chip">Distance: ${distance[0]}</span><span class="race-chip">Field: 6</span><span class="race-chip">Approx. ${mode==='quick'?30:60}s</span>`;
    e.field.innerHTML=`<div class="race-field-row head"><span>#</span><span>Horse / Form</span><span>Odds</span><span class="hide-small">Condition</span><span class="hide-mid">Best Track</span><span class="hide-mid">Jockey</span></div>`+field.map(h=>`<div class="race-field-row"><span class="horse-num">${h.post}</span><span class="horse-name"><b>${h.name}</b><small>Last 5: ${h.form}</small></span><span class="race-odds">${h.odds.display}</span><span class="hide-small">${h.condition}</span><span class="hide-mid">${h.preference}</span><span class="hide-mid">${h.jockey}</span></div>`).join('');
    e.horse.innerHTML=field.map((h,i)=>`<option value="${i}">${h.name} (${h.odds.display})</option>`).join('');
    e.bars.innerHTML='';
    e.status.textContent='Study the form, track condition, distance and odds, then place a wager.';
    renderHistory();
  }

  function payoutFor(horse,type,wager,place){
    if(type==='win') return place===1?Math.round(wager*horse.odds.decimal):0;
    if(type==='place') return place<=2?Math.round(wager*(1+(horse.odds.decimal-1)*.52)):0;
    return place<=3?Math.round(wager*(1+(horse.odds.decimal-1)*.31)):0;
  }

  function startRace(){
    if(running)return;
    const e=els();
    const wager=Math.max(1,Math.floor(Number(e.wager.value)||0));
    const max=mode==='quick'?500:5000;
    if(wager>max){toast(`Maximum ${mode==='quick'?'Quick Race':'Main Event'} wager is ${money(max)}.`);return}
    if(state.cash<wager){toast('Not enough cash for that wager.');return}
    const chosenIndex=Number(e.horse.value), type=e.bet.value, chosen=field[chosenIndex];
    state.cash-=wager; render();
    running=true;e.start.disabled=true;e.newField.disabled=true;document.querySelectorAll('[data-race-mode]').forEach(b=>b.disabled=true);
    field.forEach(h=>{h.progress=rand(0,1.8)*(h.start/100);h.finished=false;h.finishAt=null});
    e.bars.innerHTML=field.map((h,i)=>`<div class="race-runner" data-runner="${i}"><span class="race-runner-name">${h.name}</span><div class="race-progress-track"><div class="race-progress-fill" id="raceFill${i}"></div></div><span class="race-percent" id="racePct${i}">0%</span></div>`).join('');
    e.status.textContent=`They're off! ${chosen.name} • ${type.toUpperCase()} • ${money(wager)}`;
    const duration=mode==='quick'?30000:60000;
    const interval=250;
    const totalTicks=duration/interval;
    let tick=0; const finishOrder=[];
    raceTimer=setInterval(()=>{
      tick++;
      const surface=field.surface, distType=field.distance[1];
      field.forEach(h=>{
        if(h.finished)return;
        const stage=tick/totalTicks;
        const surfaceBonus=h.preference===surface?1.08:1;
        const distanceBonus=h.distancePref===distType?1.08:1;
        const fatigue=stage>.62?(.72+h.stamina/360):1;
        const late=stage>.7?(.83+h.kick/520):1;
        const startBoost=stage<.18?(.82+h.start/480):1;
        const variance=rand(.72,1.26)*(h.consistency/100*.28+.78);
        const base=(100/totalTicks)*(0.68+h.rating/135);
        h.progress+=base*surfaceBonus*distanceBonus*fatigue*late*startBoost*variance;
        if(Math.random()<.008)h.progress+=rand(1.5,4.5); // burst
        if(Math.random()<.004)h.progress=Math.max(0,h.progress-rand(.8,2.2)); // stumble / checked stride
        if(h.progress>=100){h.progress=100;h.finished=true;h.finishAt=performance.now();finishOrder.push(h)}
      });
      const leader=Math.max(...field.map(h=>h.progress));
      field.forEach((h,i)=>{
        const fill=document.getElementById(`raceFill${i}`), pct=document.getElementById(`racePct${i}`);
        if(fill){fill.style.width=`${Math.min(100,h.progress)}%`;fill.classList.toggle('leader',h.progress===leader&&!h.finished)}
        if(pct)pct.textContent=h.finished?'FIN':`${Math.floor(h.progress)}%`;
      });
      if(finishOrder.length===field.length||tick>totalTicks*1.35)finishRace(finishOrder,chosen,type,wager);
    },interval);
  }

  function finishRace(order,chosen,type,wager){
    clearInterval(raceTimer); raceTimer=null;
    const rest=field.filter(h=>!order.includes(h)).sort((a,b)=>b.progress-a.progress); const final=[...order,...rest];
    const place=final.indexOf(chosen)+1; const payout=payoutFor(chosen,type,wager,place); const net=payout-wager;
    if(payout>0)state.cash+=payout;
    state.events.unshift({date:currentDate(),text:`Horse racing: ${chosen.name} finished ${ordinal(place)}. ${net>=0?'Won':'Lost'} ${money(Math.abs(net))} net.`});
    if(net>0)state.relations.townspeople=clamp(state.relations.townspeople+1,0,100);
    history.unshift({date:currentDate(),mode,horse:chosen.name,type,wager,place,payout,net,winner:final[0].name});
    if(history.length>20)history.pop();
    const e=els();
    e.status.innerHTML=`Winner: <b>${final[0].name}</b>. Your horse <b>${chosen.name}</b> finished <b>${ordinal(place)}</b>. <span class="${net>=0?'race-result-win':'race-result-loss'}">${net>=0?`Profit ${money(net)}`:`Loss ${money(-net)}`}</span>`;
    e.bars.querySelectorAll('.race-runner').forEach((row,i)=>{const h=field[i]; const pos=final.indexOf(h)+1; row.querySelector('.race-percent').textContent=ordinal(pos); if(pos===1)row.classList.add('race-finish')});
    running=false;e.start.disabled=false;e.newField.disabled=false;document.querySelectorAll('[data-race-mode]').forEach(b=>b.disabled=false);renderHistory();render();
  }

  function ordinal(n){const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])}
  function renderHistory(){
    const e=els(); if(!e.hist)return;
    e.hist.innerHTML=history.length?history.slice(0,8).map(h=>`<div class="race-history-item"><b>${h.horse}</b> ${h.type.toUpperCase()} • ${money(h.wager)} • ${ordinal(h.place)}<small>${h.mode==='quick'?'Quick Race':'Main Event'} • winner ${h.winner} • ${h.net>=0?`+${money(h.net)}`:`-${money(-h.net)}`}</small></div>`).join(''):'<p class="muted">No races run yet.</p>';
  }

  function init(){
    if(!document.getElementById('horseRacingModule'))return;
    document.querySelectorAll('[data-race-mode]').forEach(b=>b.addEventListener('click',()=>{
      if(running)return; mode=b.dataset.raceMode;document.querySelectorAll('[data-race-mode]').forEach(x=>x.classList.toggle('active',x===b));
      els().wager.value=mode==='quick'?25:100;generateField();
    }));
    els().newField.addEventListener('click',generateField); els().start.addEventListener('click',startRace);
    generateField();
  }
  init();
})();
