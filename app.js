const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Math.round(n));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const phases=['Early','Mid','Late','Month End'];

const state={
  year:1836,month:2,phase:0,
  cash:8200,debt:6000,estateValue:39000,
  acres:900,cultivated:520,woods:260,
  crops:{cotton:220,cane:120,corn:110,rice:70},
  seedCost:{cotton:4.2,cane:5.4,corn:2.1,rice:3.6},
  prices:{cotton:31,cane:14,corn:7,rice:12,sugar:22,lumber:18,honey:26,wax:17,flour:11,bread:15},
  pricePrev:{cotton:30,cane:14,corn:7.3,rice:11.5,sugar:21,lumber:17,honey:25,wax:17,flour:10,bread:15},
  yield:{cotton:1.15,cane:2.1,corn:1.8,rice:1.5},
  conditions:{food:72,health:74,unrest:28,equipment:66,soil:71},
  weather:{forecast:'Hotter and drier than usual summer',confidence:58,actual:'unknown',heatRisk:72,rainRisk:38},
  gossip:'Most neighboring planters are increasing cotton acreage after a strong winter price run. A Savannah merchant says cane may outperform if the summer stays hot.',
  enslaved:84,hired:9,injured:3,rations:'standard',care:'standard',
  relations:{planters:61,merchants:66,officials:48,townspeople:57,enslavedTrust:31,enslavedFear:62,enslavedResentment:58},
  buildings:{warehouse:1,infirmary:0,sawmill:0,apiary:0,gristmill:0,bakery:0},
  millLevel:1,ships:1,hives:0,timberRate:0,
  inventory:{cotton:90,cane:40,corn:110,rice:55,sugar:35,lumber:0,honey:0,wax:0,flour:0,bread:0},
  missions:[],ledger:[],newspapers:[],
  events:[
    {date:'March • Early • 1836',text:'Spring planting has begun. Cotton prices are steady; sugar demand is rising.'},
    {date:'February • Month End • 1836',text:'A leaking sugar kettle was repaired before a major shutdown.'}
  ]
};

const cropData={
  cotton:{label:'Cotton',heat:.72,drought:.48,wet:.42},
  cane:{label:'Sugar Cane',heat:.90,drought:.34,wet:.72},
  corn:{label:'Corn',heat:.55,drought:.40,wet:.56},
  rice:{label:'Rice',heat:.70,drought:.12,wet:.96}
};

function currentDate(){return `${months[state.month]} • ${phases[state.phase]} • ${state.year}`}
function monthKey(){return `${months[state.month]} ${state.year}`}
function meter(label,value,type='normal'){return `<div class="meter"><label>${label}</label><div class="track"><div class="fill ${type}" style="width:${clamp(value,0,100)}%"></div></div><strong>${Math.round(value)}%</strong></div>`}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.remove('hidden');setTimeout(()=>e.classList.add('hidden'),2200)}
function setView(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===id));document.getElementById('viewTitle').textContent=document.querySelector(`.nav-btn[data-view="${id}"]`)?.textContent||'Overview'}
document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>setView(b.dataset.go));

function productionFactor(crop){
  let f=1; const w=state.weather.actual;
  if(w==='heatwave')f*=cropData[crop].heat;if(w==='drought')f*=cropData[crop].drought;if(w==='wet')f*=cropData[crop].wet;if(w==='ideal')f*=1.12;
  f*=.72+state.conditions.equipment/250; f*=.82+state.conditions.soil/400;
  const avail=Math.max(0,state.enslaved+state.hired-state.injured); f*=clamp(avail/(state.enslaved+state.hired),.62,1);
  return f;
}
function turnYield(crop){return Math.max(0,Math.round(state.crops[crop]*state.yield[crop]*productionFactor(crop)/48))}
function sugarOutput(){return Math.round(turnYield('cane')*(.5+.1*state.millLevel))}
function timberOutput(){if(!state.buildings.sawmill||state.timberRate<=0)return 0;return Math.min(state.woods,Math.round(state.timberRate*(.6+state.conditions.equipment/250)))}
function apiaryOutput(){if(!state.buildings.apiary||!state.hives)return {honey:0,wax:0};const bloom=[2,3,4,5,6,7,8].includes(state.month)?1:.35;const weather=state.weather.actual==='drought'?.6:state.weather.actual==='ideal'?1.15:1;return {honey:Math.round(state.hives*bloom*weather*.35),wax:Math.round(state.hives*bloom*.08)}}
function industryRevenue(){const t=timberOutput(),a=apiaryOutput();let n=t*state.prices.lumber+a.honey*state.prices.honey+a.wax*state.prices.wax;if(state.buildings.gristmill)n+=Math.min(state.inventory.corn,6)*state.prices.flour*.5;if(state.buildings.bakery)n+=Math.min(state.inventory.flour,6)*state.prices.bread*.55;return Math.round(n)}
function turnRevenue(){return Math.round(turnYield('cotton')*state.prices.cotton+turnYield('corn')*state.prices.corn+turnYield('rice')*state.prices.rice+sugarOutput()*state.prices.sugar+industryRevenue())}
function turnExpenses(){let n=(240+state.hired*12+state.ships*45)/4;if(state.rations==='reduced')n+=18;else if(state.rations==='standard')n+=30;else n+=55;if(state.care==='minimal')n+=6;else if(state.care==='standard')n+=22;else n+=48;if(state.buildings.sawmill)n+=14;if(state.buildings.apiary)n+=state.hives*1.2;if(state.buildings.gristmill)n+=10;if(state.buildings.bakery)n+=14;return Math.round(n)}
function projectedNet(){return turnRevenue()-turnExpenses()}
function priceArrow(k){const d=state.prices[k]-state.pricePrev[k];return d>0?'<span class="price-up">▲</span>':d<0?'<span class="price-down">▼</span>':'<span class="muted">●</span>'}

function renderOverview(){
  cashKpi.textContent=money(state.cash);debtKpi.textContent=money(state.debt);netKpi.textContent=money(projectedNet());estateValueKpi.textContent=money(state.estateValue);datePill.textContent=currentDate();
  cashNote.textContent=state.cash<2000?'Reserve dangerously low':'Operating reserve';netNote.textContent=projectedNet()>=0?'Projected turn profit':'Projected turn loss';
  outlookPanel.innerHTML=`<p><b>Almanac:</b> ${state.weather.forecast}</p><p><b>Confidence:</b> ${state.weather.confidence}%</p>${meter('Heat risk',state.weather.heatRisk,state.weather.heatRisk>70?'bad':'normal')}${meter('Heavy rain risk',state.weather.rainRisk)}<p class="muted">Forecasts and gossip can be wrong. You are expected to hedge, speculate, or go against the crowd.</p>`;
  conditionMeters.innerHTML=meter('Food',state.conditions.food,state.conditions.food<45?'bad':'good')+meter('Health',state.conditions.health,state.conditions.health<50?'bad':'good')+meter('Unrest',state.conditions.unrest,state.conditions.unrest>60?'bad':'normal')+meter('Equipment',state.conditions.equipment,state.conditions.equipment<45?'bad':'normal')+meter('Soil',state.conditions.soil,state.conditions.soil<45?'bad':'normal');
  eventFeed.innerHTML=state.events.slice(0,8).map(e=>`<div class="event">${e.text}<small>${e.date}</small></div>`).join('');
}

function makePaper(){
  const marketKeys=['cotton','corn','sugar','lumber','honey'];
  const leads=[
    ['COUNTY ROAD QUESTION RETURNS','County officials are again discussing road repairs and freight access. Merchants want action before the next heavy rains.'],
    ['PLANTERS WATCH THE SKY','Dry ground and unusual heat have stirred disagreement over the coming season. Some growers are increasing cotton while others hedge with grain.'],
    ['SAVANNAH TRADE ACTIVE','Factors report steady coastal business, though freight rates remain a concern for inland producers.'],
    ['RAIL INTERESTS SEEK NEW BUSINESS','Railroad representatives are courting shippers with promises of faster carriage and improved schedules.'],
    ['MILL DEMAND RISING','Local demand for sawn boards and milled grain has improved as construction and planting activity increase.']
  ];
  const side=[
    'A neighboring estate has offered acreage for sale after a poor season.',
    'A church committee is collecting subscriptions for repairs.',
    'A horse race and county fair are being discussed for next month.',
    'Merchants report strong demand for preserved food and flour.',
    'A local bank director dismisses rumors about tight credit.',
    'Several farmers complain that seed prices have risen too quickly.',
    'A bridge inspection found rot in several timbers.',
    'A political club plans a public dinner and speeches.'
  ];
  const lead=leads[Math.floor(Math.random()*leads.length)];
  const stories=[...side].sort(()=>Math.random()-.5).slice(0,4);
  const paper={date:currentDate(),headline:lead[0],lead:lead[1],stories,markets:marketKeys.map(k=>({k,p:state.prices[k],d:state.prices[k]-state.pricePrev[k]}))};
  state.newspapers.unshift(paper); if(state.newspapers.length>60)state.newspapers.pop();
}
function renderNewspaper(){
  if(!state.newspapers.length)makePaper();const p=state.newspapers[0];
  paperDate.textContent=p.date;paperLead.innerHTML=`<h2>${p.headline}</h2><p>${p.lead}</p>`;paperStories.innerHTML=p.stories.map((s,i)=>`<article><h4>${['County','Business','Society','Agriculture'][i]}</h4><p>${s}</p></article>`).join('');
  paperMarkets.innerHTML=p.markets.map(x=>`<span class="market-chip"><b>${x.k}</b> ${money(x.p)} ${x.d>0?'▲':x.d<0?'▼':'●'}</span>`).join('');
  paperArchive.innerHTML=state.newspapers.slice(1,8).map(x=>`<div class="row"><b>${x.date}</b><div>${x.headline}</div></div>`).join('')||'<p class="muted">No older issues yet.</p>';
}

function renderMarket(){
  seedMarket.innerHTML=Object.keys(cropData).map(k=>`<div class="row"><b>${cropData[k].label}</b><span style="float:right">${money(state.seedCost[k])} / acre</span></div>`).join('');
  commodityMarket.innerHTML=Object.keys(state.prices).map(k=>`<div class="row"><b>${k[0].toUpperCase()+k.slice(1)}</b><span style="float:right">${priceArrow(k)} ${money(state.prices[k])}</span></div>`).join('');
  gossipPanel.innerHTML=`<p>${state.gossip}</p><p class="muted">Gossip can be useful, self-serving, stale, or completely wrong.</p>`;
}
function renderPlanting(){
  const used=Object.values(state.crops).reduce((a,b)=>a+b,0);acreageBadge.textContent=`${used} / ${state.cultivated} acres used`;
  cropControls.innerHTML=Object.keys(cropData).map(k=>`<div class="crop-row"><div><b>${cropData[k].label}</b><div class="muted">${state.crops[k]} acres • seed ${money(state.seedCost[k])}/acre</div></div><input type="range" min="0" max="${state.cultivated}" step="10" value="${state.crops[k]}" data-crop="${k}"><strong>${state.crops[k]}</strong></div>`).join('');
  cropControls.querySelectorAll('input').forEach(input=>input.oninput=e=>{const k=e.target.dataset.crop,next=Number(e.target.value),other=Object.entries(state.crops).filter(([x])=>x!==k).reduce((a,[,v])=>a+v,0);if(other+next>state.cultivated){toast('Not enough cultivated acreage.');e.target.value=state.crops[k];return}state.crops[k]=next;render()});
  strategyPanel.innerHTML=`<p>The market may reward consensus until it suddenly punishes it. Compare the almanac, soil, local gossip and current prices before committing acreage.</p><p><b>Current forecast:</b> ${state.weather.forecast}</p>`;
  yieldTable.innerHTML=`<div class="table-wrap"><table><thead><tr><th>Crop</th><th>Acres</th><th>Yield / turn</th><th>Weather profile</th></tr></thead><tbody>${Object.keys(cropData).map(k=>`<tr><td>${cropData[k].label}</td><td>${state.crops[k]}</td><td>${turnYield(k)}</td><td>${cropData[k].heat>.75?'Heat tolerant':cropData[k].drought<.25?'Water dependent':'Mixed'}</td></tr>`).join('')}</tbody></table></div>`;
}

function spend(cost,fn,msg){if(state.cash<cost)return toast('Not enough cash.');state.cash-=cost;fn();state.events.unshift({date:currentDate(),text:msg});toast(msg);render()}
function renderIndustries(){
  timberPanel.innerHTML=state.buildings.sawmill?`<p>Woodland remaining: <b>${state.woods} acres</b></p><p>Current cutting rate: <b>${state.timberRate} units / turn</b></p><p>Expected lumber: <b>${timberOutput()}</b> • price ${money(state.prices.lumber)}</p><div class="stack-actions"><button class="secondary-btn" data-timber="0">Pause cutting</button><button class="secondary-btn" data-timber="4">Conservative cutting</button><button class="secondary-btn" data-timber="8">Heavy cutting</button></div>`:'<p class="muted">No sawmill. Build one to turn woodland into lumber.</p>';
  apiaryPanel.innerHTML=state.buildings.apiary?`<p>Hives: <b>${state.hives}</b></p><p>Expected this turn: <b>${apiaryOutput().honey} honey</b> and <b>${apiaryOutput().wax} wax</b></p><button id="buyHives" class="secondary-btn">Add 5 hives • $180</button>`:'<p class="muted">No apiary. Bees provide honey, wax and later pollination bonuses.</p>';
  grainMillPanel.innerHTML=state.buildings.gristmill?`<p>Operational. Converts part of stored corn/grain into flour each turn.</p><p>Flour inventory: <b>${state.inventory.flour}</b></p>`:'<p class="muted">No gristmill.</p>';
  bakeryPanel.innerHTML=state.buildings.bakery?`<p>Operational. Converts flour into higher-value baked goods.</p><p>Bread inventory: <b>${state.inventory.bread}</b></p>`:'<p class="muted">No bakery.</p>';
  industryActions.innerHTML=`${!state.buildings.sawmill?'<button class="secondary-btn" id="buildSawmill">Build sawmill • $2,400</button>':''}${!state.buildings.apiary?'<button class="secondary-btn" id="buildApiary">Establish apiary • $650</button>':''}${!state.buildings.gristmill?'<button class="secondary-btn" id="buildGristmill">Build gristmill • $2,800</button>':''}${!state.buildings.bakery?'<button class="secondary-btn" id="buildBakery">Open bakery • $1,900</button>':''}`||'<p class="muted">All current industries established.</p>';
  document.querySelectorAll('[data-timber]').forEach(b=>b.onclick=()=>{state.timberRate=Number(b.dataset.timber);toast('Timber policy changed.');render()});
  document.getElementById('buyHives')?.addEventListener('click',()=>spend(180,()=>state.hives+=5,'Five hives added.'));
  document.getElementById('buildSawmill')?.addEventListener('click',()=>spend(2400,()=>{state.buildings.sawmill=1;state.estateValue+=2000;state.timberRate=4},'Sawmill built.'));
  document.getElementById('buildApiary')?.addEventListener('click',()=>spend(650,()=>{state.buildings.apiary=1;state.hives=10;state.estateValue+=500},'Apiary established.'));
  document.getElementById('buildGristmill')?.addEventListener('click',()=>spend(2800,()=>{state.buildings.gristmill=1;state.estateValue+=2300},'Gristmill built.'));
  document.getElementById('buildBakery')?.addEventListener('click',()=>spend(1900,()=>{state.buildings.bakery=1;state.estateValue+=1500},'Bakery opened.'));
}

function renderEstate(){const used=Object.values(state.crops).reduce((a,b)=>a+b,0);landPanel.innerHTML=`<p><b>${state.acres}</b> total acres</p><p><b>${state.cultivated}</b> cultivated</p><p><b>${state.woods}</b> woodland</p><p><b>${used}</b> crop acres assigned</p>`;buildingPanel.innerHTML=`<p>Sugar works level <b>${state.millLevel}</b></p><p>Warehouse <b>${state.buildings.warehouse}</b></p><p>Infirmary <b>${state.buildings.infirmary?'built':'not built'}</b></p><p>Sawmill <b>${state.buildings.sawmill?'built':'not built'}</b></p><p>Apiary <b>${state.buildings.apiary?'established':'not established'}</b></p><p>Gristmill <b>${state.buildings.gristmill?'built':'not built'}</b></p><p>Bakery <b>${state.buildings.bakery?'open':'not open'}</b></p>`}
function renderLabor(){
  enslavedKpi.textContent=state.enslaved;hiredKpi.textContent=state.hired;injuredKpi.textContent=state.injured;
  rationPanel.innerHTML=`<p>Current: <b>${state.rations}</b></p><div class="stack-actions"><button class="secondary-btn" data-ration="reduced">Reduced</button><button class="secondary-btn" data-ration="standard">Standard</button><button class="secondary-btn" data-ration="improved">Improved</button></div>`;
  carePanel.innerHTML=`<p>Current: <b>${state.care}</b></p><div class="stack-actions"><button class="secondary-btn" data-care="minimal">Minimal</button><button class="secondary-btn" data-care="standard">Standard</button><button class="secondary-btn" data-care="physician">Physician retained</button></div>`;
  laborRelations.innerHTML=meter('Trust',state.relations.enslavedTrust)+meter('Fear',state.relations.enslavedFear)+meter('Resentment',state.relations.enslavedResentment,state.relations.enslavedResentment>70?'bad':'normal')+`<p class="muted">These values are separate. High fear can produce compliance while also increasing resentment; trust does not imply acceptance of enslavement.</p>`;
  document.querySelectorAll('[data-ration]').forEach(b=>b.onclick=()=>{state.rations=b.dataset.ration;render()});document.querySelectorAll('[data-care]').forEach(b=>b.onclick=()=>{state.care=b.dataset.care;render()});
}
function renderReputation(){
  reputationMeters.innerHTML=meter('Planter class',state.relations.planters)+meter('Merchants',state.relations.merchants)+meter('Officials',state.relations.officials)+meter('Townspeople',state.relations.townspeople);
  const strongest=Object.entries({Planters:state.relations.planters,Merchants:state.relations.merchants,Officials:state.relations.officials,Townspeople:state.relations.townspeople}).sort((a,b)=>b[1]-a[1])[0];
  socialSummary.innerHTML=`<p>Your strongest public standing is currently with <b>${strongest[0]}</b>.</p><p>Economic success, donations, disputes, debts, public behavior and treatment of workers can move different groups in different directions.</p>`;
  institutionPanel.innerHTML=`<div class="row"><b>County officials</b><div class="muted">Roads, taxes, court matters, appointments and public works.</div></div><div class="row"><b>Agricultural society</b><div class="muted">Planned system: fairs, prizes, information and social standing.</div></div><div class="row"><b>Merchant association</b><div class="muted">Planned system: freight, contracts, boycotts and influence.</div></div><div class="row"><b>Political clubs</b><div class="muted">Planned system: candidates, dinners, speeches and alliances.</div></div>`;
}

function renderShipping(){
  fleetPanel.innerHTML=`<p><b>${state.ships}</b> schooner(s)</p><button id="buyShip" class="secondary-btn">Buy schooner • $4,500</button>`;
  const routes=[['Savannah → Charleston',8,650,9],['Savannah → New Orleans',12,1100,16],['Savannah → Nassau',12,1400,24]];
  tradeRoutes.innerHTML=routes.map((r,i)=>`<div class="route-row"><div><h4>${r[0]}</h4><p>${r[1]} turns • expected ${money(r[2])} • risk ${r[3]}%</p></div><button class="secondary-btn" data-route="${i}">Dispatch</button></div>`).join('');
  tradeRoutes.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>dispatch(Number(b.dataset.route)));
  activeMissions.innerHTML=state.missions.length?state.missions.map(m=>`<div class="route-row"><div><h4>${m.route}</h4><p>${m.left} turns remaining • expected ${money(m.profit)}</p></div><span class="badge">Underway</span></div>`).join(''):'<p class="muted">No active missions.</p>';
  document.getElementById('buyShip').onclick=()=>spend(4500,()=>{state.ships++;state.estateValue+=3600},'Schooner purchased.');
}
function dispatch(i){if(state.missions.length>=state.ships)return toast('All vessels are assigned.');const r=[{route:'Savannah → Charleston',left:8,profit:650,risk:9},{route:'Savannah → New Orleans',left:12,profit:1100,risk:16},{route:'Savannah → Nassau',left:12,profit:1400,risk:24}][i];state.missions.push({...r});toast('Trade mission dispatched.');render()}

function wager(amount,odds,label){if(state.cash<amount)return toast('Not enough cash.');state.cash-=amount;const win=Math.random()<odds;if(win){const payout=Math.round(amount*(1/odds)*.85);state.cash+=payout;state.events.unshift({date:currentDate(),text:`${label}: won ${money(payout-amount)} net.`});state.relations.townspeople=clamp(state.relations.townspeople+1,0,100)}else{state.events.unshift({date:currentDate(),text:`${label}: lost ${money(amount)}.`})}render()}
function socialGame(name,cost,skill){if(state.cash<cost)return toast('Not enough cash.');state.cash-=cost;const win=Math.random()<skill;state.relations.townspeople=clamp(state.relations.townspeople+(win?2:1),0,100);state.events.unshift({date:currentDate(),text:`Played ${name} at a local table and ${win?'won the evening':'lost the evening'}.`});render()}
function renderLeisure(){
  racingPanel.innerHTML=`<p>The county race meeting is taking wagers.</p><div class="action-grid"><button class="secondary-btn" data-bet="25">Bet $25</button><button class="secondary-btn" data-bet="100">Bet $100</button><button class="secondary-btn" data-bet="500">Bet $500</button></div><p class="muted">Long-term horse ownership, breeding and race reputation are roadmapped.</p>`;
  racingPanel.querySelectorAll('[data-bet]').forEach(b=>b.onclick=()=>wager(Number(b.dataset.bet),.32,'Horse race'));
  gamesPanel.innerHTML=`<div class="action-grid"><button class="secondary-btn" data-game="Poker" data-cost="50" data-skill=".44">Poker • $50</button><button class="secondary-btn" data-game="Chess" data-cost="5" data-skill=".52">Chess • $5</button><button class="secondary-btn" data-game="Checkers" data-cost="3" data-skill=".55">Checkers • $3</button><button class="secondary-btn" data-game="Backgammon" data-cost="10" data-skill=".48">Backgammon • $10</button></div>`;
  gamesPanel.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>socialGame(b.dataset.game,Number(b.dataset.cost),Number(b.dataset.skill)));
  societyPanel.innerHTML=`<p>Side activities can improve relationships, consume time and squander money. Planned additions include dinners, fairs, hunting, racehorse ownership, taverns, clubs, scandals and invitations.</p>`;
}

function renderLedger(){creditPanel.innerHTML=`<p>Outstanding debt: <b>${money(state.debt)}</b></p><p>Interest posts at month end.</p><div class="action-grid"><button id="borrow" class="secondary-btn">Borrow $1,000</button><button id="repay" class="secondary-btn">Repay $1,000</button></div>`;projectionPanel.innerHTML=`<p>Turn revenue: <b>${money(turnRevenue())}</b></p><p>Turn expenses: <b>${money(turnExpenses())}</b></p><p>Projected net: <b class="${projectedNet()>=0?'good':'bad'}">${money(projectedNet())}</b></p>`;ledgerRows.innerHTML=state.ledger.length?state.ledger.slice().reverse().slice(0,16).map(r=>`<tr><td>${r.date}</td><td>${money(r.rev)}</td><td>${money(r.exp)}</td><td class="${r.net>=0?'good':'bad'}">${money(r.net)}</td><td>${money(r.cash)}</td></tr>`).join(''):'<tr><td colspan="5" class="muted">Month-end entries appear here.</td></tr>';document.getElementById('borrow').onclick=()=>{state.cash+=1000;state.debt+=1000;render()};document.getElementById('repay').onclick=()=>{if(state.cash<1000||state.debt<=0)return toast('Not enough cash or no debt.');const x=Math.min(1000,state.debt);state.cash-=x;state.debt-=x;render()}}

function render(){renderOverview();renderNewspaper();renderMarket();renderPlanting();renderIndustries();renderEstate();renderLabor();renderReputation();renderShipping();renderLeisure();renderLedger()}

document.getElementById('buyLand').onclick=()=>spend(2000,()=>{state.acres+=100;state.cultivated+=60;state.woods+=25;state.estateValue+=2400},'Purchased 100 acres.');
document.getElementById('buildWarehouse').onclick=()=>spend(1250,()=>{state.buildings.warehouse++;state.estateValue+=1000},'Warehouse expanded.');
document.getElementById('buildInfirmary').onclick=()=>{if(state.buildings.infirmary)return toast('Infirmary already built.');spend(1800,()=>{state.buildings.infirmary=1;state.estateValue+=1300;state.conditions.health=clamp(state.conditions.health+5,0,100)},'Infirmary built.')};
document.getElementById('repairEquipment').onclick=()=>spend(600,()=>state.conditions.equipment=clamp(state.conditions.equipment+22,0,100),'Equipment repaired.');

function chooseWeather(){const r=Math.random();return r<.25?'heatwave':r<.45?'drought':r<.68?'wet':'ideal'}
function newForecast(){const f=[['Hotter and drier than usual summer',58,72,38],['Wet spring followed by an ordinary summer',62,44,76],['Mild season with average rainfall',54,38,48],['Dry spring; late summer storms possible',51,61,57]][Math.floor(Math.random()*4)];state.weather={forecast:f[0],confidence:f[1],actual:'unknown',heatRisk:f[2],rainRisk:f[3]}}
function marketMove(){state.pricePrev={...state.prices};for(const k of Object.keys(state.prices)){const v=['cotton','sugar','lumber'].includes(k)?5:3;state.prices[k]=Math.max(2,Math.round((state.prices[k]+(Math.random()-.5)*v)*10)/10)}for(const k of Object.keys(state.seedCost))state.seedCost[k]=Math.max(1,Math.round((state.seedCost[k]+(Math.random()-.5)*.6)*10)/10)}
function showDecision(title,text,choices){decisionTitle.textContent=title;decisionText.textContent=text;decisionChoices.innerHTML='';choices.forEach(([label,fn])=>{const b=document.createElement('button');b.className='secondary-btn';b.textContent=label;b.onclick=()=>{fn();decisionModal.classList.add('hidden');state.events.unshift({date:currentDate(),text:`Decision: ${label}.`});render()};decisionChoices.appendChild(b)});decisionModal.classList.remove('hidden')}
function maybeDecision(){const r=Math.random();if(r<.12){showDecision('Sugar-house injury','A worker has suffered a serious scalding injury.',[['Call a physician ($120)',()=>{state.cash-=120;state.injured=Math.max(0,state.injured-1);state.relations.enslavedTrust=clamp(state.relations.enslavedTrust+3,0,100)}],['Treat locally ($35)',()=>{state.cash-=35;state.injured+=1}],['Return to light duty early',()=>{state.conditions.unrest=clamp(state.conditions.unrest+4,0,100);state.relations.enslavedResentment=clamp(state.relations.enslavedResentment+4,0,100)}]]);return 'A serious injury requires a decision.'}if(r<.22){state.conditions.equipment=clamp(state.conditions.equipment-6,0,100);return 'Equipment wear was worse than expected.'}if(r<.32){state.relations.merchants=clamp(state.relations.merchants+2,0,100);return 'A merchant praised your reliability after a prompt settlement.'}if(r<.40){state.relations.planters=clamp(state.relations.planters-2,0,100);return 'Several neighboring planters criticized your recent management choices.'}return 'No major private event this turn.'}

function processIndustries(){const t=timberOutput();if(t){state.inventory.lumber+=t;state.woods=Math.max(0,state.woods-Math.ceil(t/8))}const a=apiaryOutput();state.inventory.honey+=a.honey;state.inventory.wax+=a.wax;if(state.buildings.gristmill&&state.inventory.corn>0){const use=Math.min(4,state.inventory.corn);state.inventory.corn-=use;state.inventory.flour+=Math.round(use*1.4)}if(state.buildings.bakery&&state.inventory.flour>0){const use=Math.min(4,state.inventory.flour);state.inventory.flour-=use;state.inventory.bread+=Math.round(use*1.3)}}
function processMissions(){state.missions.forEach(m=>m.left--);const done=state.missions.filter(m=>m.left<=0);done.forEach(m=>{const trouble=Math.random()*100<m.risk;const gain=trouble?Math.round(m.profit*.25):Math.round(m.profit*(.85+Math.random()*.35));state.cash+=gain;state.events.unshift({date:currentDate(),text:trouble?`${m.route} returned after trouble with only ${money(gain)}.`:`${m.route} returned with ${money(gain)}.`})});state.missions=state.missions.filter(m=>m.left>0)}
function advanceTurn(){
  if(!decisionModal.classList.contains('hidden'))return toast('Resolve the pending decision first.');
  if([4,5,6,7].includes(state.month))state.weather.actual=chooseWeather();
  const rev=turnRevenue(),exp=turnExpenses();state.cash+=rev-exp;
  state.inventory.cotton+=turnYield('cotton');state.inventory.corn+=turnYield('corn');state.inventory.rice+=turnYield('rice');state.inventory.sugar+=sugarOutput();processIndustries();processMissions();
  state.conditions.food=clamp(state.conditions.food+(state.rations==='improved'?.5:state.rations==='reduced'?-1.5:-.25),0,100);
  state.conditions.health=clamp(state.conditions.health+(state.care==='physician'?.6:state.care==='minimal'?-.6:0)+(state.rations==='improved'?.3:state.rations==='reduced'?-.5:0),0,100);
  state.conditions.unrest=clamp(state.conditions.unrest+(state.rations==='reduced'?1:state.rations==='improved'?-.5:0),0,100);
  state.relations.enslavedTrust=clamp(state.relations.enslavedTrust+(state.rations==='improved'?.4:state.rations==='reduced'?-.5:0)+(state.care==='physician'?.4:0),0,100);
  state.relations.enslavedResentment=clamp(state.relations.enslavedResentment+(state.rations==='reduced'?.7:state.rations==='improved'?-.3:0),0,100);
  state.conditions.equipment=clamp(state.conditions.equipment-.5,0,100);
  const closing=state.phase===3;
  if(closing){state.debt+=Math.round(state.debt*.0075);state.ledger.push({date:monthKey(),rev:rev*4,exp:exp*4,net:(rev-exp)*4,cash:state.cash});marketMove();if(state.month===1)newForecast()}
  state.phase++;if(state.phase>3){state.phase=0;state.month++;if(state.month>11){state.month=0;state.year++}}
  const evt=maybeDecision();state.events.unshift({date:currentDate(),text:evt});makePaper();render();
}
document.getElementById('advanceTurn').onclick=advanceTurn;
makePaper();render();