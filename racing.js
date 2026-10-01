(() => {
  const HORSE_NAMES=[
    'Georgia Belle','Red Lantern','King Cotton','Sweet Magnolia','Black Creek','Old Thunder',
    'Pine Runner','Savannah Star','Blue Heron','Copper Jack','River Queen','Magnolia Fire',
    'Lowcountry Lad','Peachtree Pride','Tallulah','Macon Moon','Golden Cane','Cedar Smoke',
    'Dogwood Rose','Ocmulgee','Foxfire','Silver Pine','Chattahoochee','Moonlit Cane',
    'Atlanta Rose','Cypress King','Red Clay','Magnolia Queen','Savannah Smoke','Piedmont Star'
  ];
  const JOCKEYS=['E. Turner','J. Bell','S. Carter','W. Hale','T. Brooks','R. Dean','M. Cole','A. Price','H. Webb','C. Grant'];
  const SURFACES=['Firm','Dry','Muddy','Heavy'];
  const DISTANCES=[['6 furlongs','sprint'],['1 mile','mile'],['1¼ miles','route']];
  const history=[];
  const turnLimits={quick:4,main:1};
  let turnUsage={quick:0,main:0};
  let lastTurnKey='';
  let mode='quick';
  let field=[];
  let running=false;
  let raceTimer=null;
  let roster=[];
  let seasonYear=state.year;

  const els=()=>({
    meta:document.getElementById('raceMeta'),field:document.getElementById('raceField'),horse:document.getElementById('raceHorseSelect'),
    bet:document.getElementById('raceBetType'),wager:document.getElementById('raceWager'),newField:document.getElementById('newRaceField'),
    start:document.getElementById('startHorseRace'),status:document.getElementById('raceStatus'),bars:document.getElementById('raceBars'),hist:document.getElementById('raceHistory')
  });

  const rand=(a,b)=>a+Math.random()*(b-a);
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
  const ordinal=n=>{const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])};

  function makeHorse(name,id){
    const age=2+Math.floor(rand(0,5));
    const speed=rand(50,91),stamina=rand(48,93),consistency=rand(45,92),kick=rand(43,95),start=rand(44,93),jockeySkill=rand(48,91);
    return {id,name,age,sex:Math.random()<.52?'Mare':'Horse',jockey:pick(JOCKEYS),speed,stamina,consistency,kick,start,jockeySkill,
      preference:pick(SURFACES),distancePref:pick(['sprint','mile','route']),fitness:rand(78,100),fatigue:rand(0,12),confidence:rand(45,70),
      health:100,injury:null,starts:0,wins:0,places:0,shows:0,earnings:0,form:[],careerPeak:0,progress:0,finished:false};
  }
  function initRoster(){roster=HORSE_NAMES.map((n,i)=>makeHorse(n,i+1));roster.forEach(h=>h.careerPeak=baseTalent(h))}
  function baseTalent(h){return h.speed*.29+h.stamina*.2+h.consistency*.16+h.kick*.12+h.start*.09+h.jockeySkill*.14}
  function conditionLabel(h){if(h.injury)return h.injury;if(h.fatigue>68)return 'Spent';if(h.fatigue>45)return 'Tired';if(h.fitness>92&&h.health>95)return 'Excellent';if(h.fitness>78)return 'Good';return 'Fair'}
  function recentFormScore(h){if(!h.form.length)return 0;return avg(h.form.slice(-5).map(p=>7-p))*1.5}
  function effectiveRating(h,surface,dist){
    let r=baseTalent(h)+recentFormScore(h)+(h.confidence-50)*.08+(h.fitness-80)*.1-h.fatigue*.16-(100-h.health)*.3;
    if(h.preference===surface)r+=5;if(h.distancePref===dist)r+=5;if(h.injury)r-=12;
    return clamp(r,20,110);
  }
  function fractionalFromDecimal(d){
    const f=Math.max(.2,d-1);
    if(f<1)return `${Math.max(1,Math.round(f*4))}:4`;
    return `${Math.max(1,Math.round(f))}:1`;
  }
  function calculateOdds(horses,surface,dist){
    const ratings=horses.map(h=>effectiveRating(h,surface,dist));
    const weights=ratings.map(r=>Math.exp((r-avg(ratings))/12));
    const sum=weights.reduce((a,b)=>a+b,0);
    horses.forEach((h,i)=>{
      const fair=weights[i]/sum;
      const publicNoise=rand(.93,1.07);
      const marketProb=clamp(fair*publicNoise,.035,.58);
      const decimal=clamp(.90/marketProb,1.35,24);
      h.raceRating=ratings[i];h.marketProb=marketProb;h.odds={decimal,display:fractionalFromDecimal(decimal)};
    });
  }
  function formString(h){return h.form.length?h.form.slice(-5).join(' · '):'—'}

  function syncTurn(){
    const key=currentDate();
    if(lastTurnKey===key)return;
    const first=lastTurnKey==='';lastTurnKey=key;
    if(!first){
      turnUsage={quick:0,main:0};
      roster.forEach(h=>{
        h.fatigue=clamp(h.fatigue-rand(14,26),0,100);
        h.fitness=clamp(h.fitness+rand(2,7),0,100);
        h.health=clamp(h.health+rand(1,5),0,100);
        if(h.injury&&Math.random()<.34&&h.health>82)h.injury=null;
      });
    }
    if(state.year!==seasonYear){
      const years=state.year-seasonYear;seasonYear=state.year;
      roster.forEach(h=>{h.age+=Math.max(0,years);applyAgeCurve(h)});
    }
    if(mode==='main'&&turnUsage.quick<turnLimits.quick)mode='quick';
    updateModeButtons();
  }
  function applyAgeCurve(h){
    if(h.age<=3){h.speed=clamp(h.speed+rand(-.2,1.2),30,99);h.stamina=clamp(h.stamina+rand(0,1.1),30,99)}
    else if(h.age<=5){h.consistency=clamp(h.consistency+rand(0,.8),30,99)}
    else if(h.age>=7){h.speed=clamp(h.speed-rand(.4,1.5),30,99);h.stamina=clamp(h.stamina-rand(.2,1.1),30,99);h.fitness=clamp(h.fitness-rand(1,5),20,100)}
  }
  function updateModeButtons(){
    const mainUnlocked=turnUsage.quick>=turnLimits.quick&&turnUsage.main<turnLimits.main;
    document.querySelectorAll('[data-race-mode]').forEach(b=>{
      const m=b.dataset.raceMode;
      const exhausted=m==='quick'?turnUsage.quick>=turnLimits.quick:turnUsage.main>=turnLimits.main;
      const locked=m==='main'&&!mainUnlocked;
      b.disabled=running||exhausted||locked;
      b.classList.toggle('active',m===mode);
      const span=b.querySelector('span');
      if(span){
        if(m==='quick')span.textContent=`≈ 30 seconds • ${turnUsage.quick}/${turnLimits.quick} run this turn`;
        else span.textContent=locked&&turnUsage.quick<4?`Locked • complete ${4-turnUsage.quick} more Quick Race${4-turnUsage.quick===1?'':'s'}`:`≈ 60 seconds • ${turnUsage.main}/${turnLimits.main} run this turn`;
      }
    });
  }
  function eligibleRoster(){return roster.filter(h=>!h.injury&&h.health>55&&h.fatigue<82)}
  function selectField(){
    let pool=eligibleRoster();if(pool.length<6)pool=roster.filter(h=>h.health>40);
    if(mode==='main')pool=[...pool].sort((a,b)=>(recentFormScore(b)+baseTalent(b)-b.fatigue*.12)-(recentFormScore(a)+baseTalent(a)-a.fatigue*.12)).slice(0,14);
    else pool=[...pool].sort(()=>Math.random()-.5).slice(0,16);
    return [...pool].sort(()=>Math.random()-.5).slice(0,6);
  }

  function generateField(){
    syncTurn();if(running)return;
    if(mode==='quick'&&turnUsage.quick>=4)return showLocked('All four Quick Races for this turn are complete.');
    if(mode==='main'&&turnUsage.quick<4)return showLocked('Main Event locked until four Quick Races are complete.');
    if(mode==='main'&&turnUsage.main>=1)return showLocked('The Main Event has already been run this turn.');
    field=selectField();
    field.forEach((h,i)=>{h.post=i+1;h.progress=0;h.finished=false});
    const surface=pick(SURFACES),distance=pick(DISTANCES);field.surface=surface;field.distance=distance;calculateOdds(field,surface,distance[1]);
    const e=els();
    e.meta.innerHTML=`<span class="race-chip">${mode==='quick'?'Quick Race':'Main Event'}</span><span class="race-chip">Track: ${surface}</span><span class="race-chip">Distance: ${distance[0]}</span><span class="race-chip">Quick: ${turnUsage.quick}/4</span><span class="race-chip">Main: ${turnUsage.main}/1</span>`;
    e.field.innerHTML=`<div class="race-field-row head"><span>#</span><span>Horse / Form</span><span>Odds</span><span class="hide-small">Condition</span><span class="hide-mid">Best Track</span><span class="hide-mid">Jockey</span></div>`+field.map(h=>`<div class="race-field-row"><span class="horse-num">${h.post}</span><span class="horse-name"><b>${h.name}</b><small>Age ${h.age} • Last 5: ${formString(h)} • ${Math.round(h.fatigue)}% fatigue</small></span><span class="race-odds">${h.odds.display}<small style="display:block;color:var(--muted)">${Math.round(h.marketProb*100)}%</small></span><span class="hide-small">${conditionLabel(h)}</span><span class="hide-mid">${h.preference}</span><span class="hide-mid">${h.jockey}</span></div>`).join('');
    e.horse.innerHTML=field.map((h,i)=>`<option value="${i}">${h.name} (${h.odds.display})</option>`).join('');e.bars.innerHTML='';
    e.status.textContent=mode==='main'?'The Main Event field is set. This is your one featured race for the turn.':'Study the field. Each horse is persistent and its form, fatigue and odds can change after racing.';
    e.start.disabled=false;e.newField.disabled=false;renderHistory();updateModeButtons();
  }
  function showLocked(msg){const e=els();e.status.textContent=msg;e.start.disabled=true;e.newField.disabled=true;updateModeButtons()}

  function payoutFor(horse,type,wager,place){if(type==='win')return place===1?Math.round(wager*horse.odds.decimal):0;if(type==='place')return place<=2?Math.round(wager*(1+(horse.odds.decimal-1)*.52)):0;return place<=3?Math.round(wager*(1+(horse.odds.decimal-1)*.31)):0}

  function startRace(){
    syncTurn();if(running)return;
    if(mode==='quick'&&turnUsage.quick>=4)return toast('No Quick Races remain this turn.');
    if(mode==='main'&&turnUsage.quick<4)return toast('Complete four Quick Races to unlock the Main Event.');
    if(mode==='main'&&turnUsage.main>=1)return toast('The Main Event has already been run this turn.');
    const e=els(),wager=Math.max(1,Math.floor(Number(e.wager.value)||0)),max=mode==='quick'?500:5000;
    if(wager>max)return toast(`Maximum ${mode==='quick'?'Quick Race':'Main Event'} wager is ${money(max)}.`);if(state.cash<wager)return toast('Not enough cash for that wager.');
    const chosen=field[Number(e.horse.value)],type=e.bet.value;state.cash-=wager;render();running=true;e.start.disabled=true;e.newField.disabled=true;updateModeButtons();
    field.forEach(h=>{h.progress=rand(0,1.8)*(h.start/100);h.finished=false});
    e.bars.innerHTML=field.map((h,i)=>`<div class="race-runner" data-runner="${i}"><span class="race-runner-name">${h.name}</span><div class="race-progress-track"><div class="race-progress-fill" id="raceFill${i}"></div></div><span class="race-percent" id="racePct${i}">0%</span></div>`).join('');
    e.status.textContent=`They're off! ${chosen.name} • ${type.toUpperCase()} • ${money(wager)}`;
    const duration=mode==='quick'?30000:60000,interval=250,totalTicks=duration/interval;let tick=0;const finishOrder=[];
    raceTimer=setInterval(()=>{
      tick++;const surface=field.surface,distType=field.distance[1];
      field.forEach(h=>{if(h.finished)return;const stage=tick/totalTicks,surfaceBonus=h.preference===surface?1.08:1,distanceBonus=h.distancePref===distType?1.08:1;
        const fatiguePenalty=1-h.fatigue/260,fitnessBonus=.88+h.fitness/820,late=stage>.7?(.83+h.kick/520):1,startBoost=stage<.18?(.82+h.start/480):1;
        const stamina=stage>.62?(.72+h.stamina/360):1,variance=rand(.72,1.26)*(h.consistency/100*.28+.78),base=(100/totalTicks)*(0.67+h.raceRating/138);
        h.progress+=base*surfaceBonus*distanceBonus*fatiguePenalty*fitnessBonus*late*startBoost*stamina*variance;
        if(Math.random()<.008)h.progress+=rand(1.5,4.5);if(Math.random()<.004)h.progress=Math.max(0,h.progress-rand(.8,2.2));
        if(h.progress>=100){h.progress=100;h.finished=true;finishOrder.push(h)}});
      const leader=Math.max(...field.map(h=>h.progress));field.forEach((h,i)=>{const fill=document.getElementById(`raceFill${i}`),pct=document.getElementById(`racePct${i}`);if(fill){fill.style.width=`${Math.min(100,h.progress)}%`;fill.classList.toggle('leader',h.progress===leader&&!h.finished)}if(pct)pct.textContent=h.finished?'FIN':`${Math.floor(h.progress)}%`});
      if(finishOrder.length===field.length||tick>totalTicks*1.35)finishRace(finishOrder,chosen,type,wager);
    },interval);
  }

  function updateHorseAfterRace(h,place){
    h.starts++;if(place===1)h.wins++;if(place<=2)h.places++;if(place<=3)h.shows++;h.form.push(place);if(h.form.length>12)h.form.shift();
    h.fatigue=clamp(h.fatigue+rand(mode==='main'?18:10,mode==='main'?30:20),0,100);h.fitness=clamp(h.fitness-rand(1,4),35,100);
    h.confidence=clamp(h.confidence+(place===1?rand(2,5):place<=3?rand(.5,2):-rand(.5,2.5)),20,95);
    const development=h.age<=4?rand(-.15,.55):h.age<=6?rand(-.3,.25):-rand(.15,.7);
    h.speed=clamp(h.speed+development,30,99);h.stamina=clamp(h.stamina+development*.75,30,99);h.consistency=clamp(h.consistency+rand(-.2,.35),30,99);
    if(Math.random()<(mode==='main'?.018:.009)+(h.fatigue/100)*.015){h.injury=pick(['Minor strain','Hoof soreness','Leg soreness']);h.health=clamp(h.health-rand(8,20),35,100)}
    h.careerPeak=Math.max(h.careerPeak,baseTalent(h));
  }

  function finishRace(order,chosen,type,wager){
    clearInterval(raceTimer);raceTimer=null;const rest=field.filter(h=>!order.includes(h)).sort((a,b)=>b.progress-a.progress),final=[...order,...rest];
    const place=final.indexOf(chosen)+1,payout=payoutFor(chosen,type,wager,place),net=payout-wager;if(payout>0)state.cash+=payout;
    final.forEach((h,i)=>{updateHorseAfterRace(h,i+1);if(i===0)h.earnings+=Math.round(mode==='main'?450:120)});
    if(mode==='quick')turnUsage.quick++;else turnUsage.main++;
    state.events.unshift({date:currentDate(),text:`Horse racing: ${chosen.name} finished ${ordinal(place)}. ${net>=0?'Won':'Lost'} ${money(Math.abs(net))} net.`});if(net>0)state.relations.townspeople=clamp(state.relations.townspeople+1,0,100);
    history.unshift({date:currentDate(),mode,horse:chosen.name,type,wager,place,payout,net,winner:final[0].name});if(history.length>24)history.pop();
    const e=els();e.status.innerHTML=`Winner: <b>${final[0].name}</b>. Your horse <b>${chosen.name}</b> finished <b>${ordinal(place)}</b>. <span class="${net>=0?'race-result-win':'race-result-loss'}">${net>=0?`Profit ${money(net)}`:`Loss ${money(-net)}`}</span>`;
    e.bars.querySelectorAll('.race-runner').forEach((row,i)=>{const h=field[i],pos=final.indexOf(h)+1;row.querySelector('.race-percent').textContent=ordinal(pos);if(pos===1)row.classList.add('race-finish')});
    running=false;renderHistory();render();updateModeButtons();
    setTimeout(()=>{if(mode==='quick'&&turnUsage.quick<4)generateField();else if(turnUsage.quick>=4&&turnUsage.main<1){mode='main';updateModeButtons();generateField()}else showLocked('This turn’s race meeting is complete. Advance the turn for a new meeting.')},700);
  }

  function renderHistory(){const e=els();if(!e.hist)return;e.hist.innerHTML=history.length?history.slice(0,10).map(h=>`<div class="race-history-item"><b>${h.horse}</b> ${h.type.toUpperCase()} • ${money(h.wager)} • ${ordinal(h.place)}<small>${h.mode==='quick'?'Quick Race':'Main Event'} • winner ${h.winner} • ${h.net>=0?`+${money(h.net)}`:`-${money(-h.net)}`}</small></div>`).join(''):'<p class="muted">No races run yet.</p>'}

  function init(){
    if(!document.getElementById('horseRacingModule'))return;initRoster();syncTurn();
    document.querySelectorAll('[data-race-mode]').forEach(b=>b.addEventListener('click',()=>{if(running||b.disabled)return;mode=b.dataset.raceMode;els().wager.value=mode==='quick'?25:100;generateField()}));
    els().newField.addEventListener('click',generateField);els().start.addEventListener('click',startRace);
    document.getElementById('advanceTurn')?.addEventListener('click',()=>setTimeout(()=>{syncTurn();mode='quick';generateField()},0));
    generateField();
  }
  init();
})();
