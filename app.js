const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];

const state={
  year:1836,month:2,
  cash:8200,debt:6000,estateValue:39000,
  acres:900,cultivated:520,
  crops:{cotton:220,cane:120,corn:110,rice:70},
  seedCost:{cotton:4.2,cane:5.4,corn:2.1,rice:3.6},
  prices:{cotton:31,cane:14,corn:7,rice:12,sugar:22},
  pricePrev:{cotton:30,cane:14,corn:7.3,rice:11.5,sugar:21},
  yield:{cotton:1.15,cane:2.1,corn:1.8,rice:1.5},
  inventory:{cotton:90,cane:40,corn:110,rice:55,sugar:35},
  conditions:{food:72,health:74,unrest:28,equipment:66,soil:71},
  weather:{forecast:'Hotter and drier than usual summer',confidence:58,actual:'unknown',heatRisk:72,rainRisk:38},
  gossip:'Most neighboring planters are increasing cotton acreage after a strong winter price run. A Savannah merchant says cane may outperform if the summer stays hot, but nobody agrees on rainfall.',
  enslaved:84,hired:9,injured:3,
  rations:'standard',care:'standard',
  millLevel:1,warehouse:1,infirmary:0,ships:1,
  missions:[],ledger:[],
  events:[
    {date:'March 1836',text:'Spring planting has begun. Cotton prices are steady; sugar demand is rising.'},
    {date:'February 1836',text:'A leaking mill kettle was repaired before it caused a major shutdown.'},
    {date:'January 1836',text:'The Savannah factor extended another season of credit.'}
  ]
};

const cropData={
  cotton:{label:'Cotton',heat:0.72,drought:0.48,wet:0.42},
  cane:{label:'Sugar Cane',heat:0.9,drought:0.34,wet:0.72},
  corn:{label:'Corn',heat:0.55,drought:0.4,wet:0.56},
  rice:{label:'Rice',heat:0.7,drought:0.12,wet:0.96}
};

function currentDate(){return `${monthNames[state.month]} ${state.year}`}
function productionFactor(crop){
  let f=1;
  const w=state.weather.actual;
  if(w==='heatwave') f*=cropData[crop].heat;
  if(w==='drought') f*=cropData[crop].drought;
  if(w==='wet') f*=cropData[crop].wet;
  if(w==='ideal') f*=1.12;
  f*=.72+state.conditions.equipment/250;
  f*=.82+state.conditions.soil/400;
  const available=Math.max(0,state.enslaved+state.hired-state.injured);
  f*=clamp(available/(state.enslaved+state.hired),.62,1);
  return f;
}
function expectedYield(crop){return Math.max(0,Math.round(state.crops[crop]*state.yield[crop]*productionFactor(crop)/12))}
function sugarOutput(){return Math.round(expectedYield('cane')*(.5+.1*state.millLevel))}
function monthlyRevenue(){return Math.round(expectedYield('cotton')*state.prices.cotton+expectedYield('corn')*state.prices.corn+expectedYield('rice')*state.prices.rice+sugarOutput()*state.prices.sugar)}
function monthlyExpenses(){
  let n=240+state.hired*12+state.debt*.0075+state.ships*45;
  if(state.rations==='reduced') n+=70; else if(state.rations==='standard') n+=120; else n+=220;
  if(state.care==='minimal') n+=25; else if(state.care==='standard') n+=85; else n+=190;
  return Math.round(n);
}
function projectedNet(){return monthlyRevenue()-monthlyExpenses()}

function setView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
  document.getElementById('viewTitle').textContent=document.querySelector(`.nav-btn[data-view="${id}"]`)?.textContent||'Overview';
}

document.querySelectorAll('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>setView(btn.dataset.view)));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>setView(btn.dataset.go)));

function meter(label,value,type='normal'){
  return `<div class="meter"><label>${label}</label><div class="track"><div class="fill ${type}" style="width:${value}%"></div></div><strong>${Math.round(value)}%</strong></div>`;
}
function priceArrow(k){const d=state.prices[k]-state.pricePrev[k];return d>0?'<span class="price-up">▲</span>':d<0?'<span class="price-down">▼</span>':'<span class="muted">●</span>'}
function toast(text){const t=document.getElementById('toast');t.textContent=text;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),2200)}

function renderOverview(){
  cashKpi.textContent=money(state.cash); debtKpi.textContent=money(state.debt); netKpi.textContent=money(projectedNet()); estateValueKpi.textContent=money(state.estateValue);
  cashNote.textContent=state.cash<2000?'Reserve dangerously low':'Operating reserve'; cashNote.className=state.cash<2000?'bad':'';
  netNote.textContent=projectedNet()>=0?'Projected profit':'Projected loss'; netNote.className=projectedNet()>=0?'good':'bad';
  datePill.textContent=currentDate();
  outlookPanel.innerHTML=`<p><b>Old planter's almanac:</b> ${state.weather.forecast}</p><p><b>Confidence:</b> ${state.weather.confidence}%</p><p class="muted">Forecasts are intentionally unreliable. The profitable move may be to follow the crowd, hedge, or deliberately plant against consensus.</p>${meter('Heat risk',state.weather.heatRisk,state.weather.heatRisk>70?'bad':'normal')}${meter('Heavy rain risk',state.weather.rainRisk)}`;
  conditionMeters.innerHTML=meter('Food',state.conditions.food,state.conditions.food<45?'bad':'good')+meter('Health',state.conditions.health,state.conditions.health<50?'bad':'good')+meter('Unrest',state.conditions.unrest,state.conditions.unrest>60?'bad':'normal')+meter('Equipment',state.conditions.equipment,state.conditions.equipment<45?'bad':'normal')+meter('Soil',state.conditions.soil,state.conditions.soil<45?'bad':'normal');
  eventFeed.innerHTML=state.events.slice(0,7).map(e=>`<div class="event">${e.text}<small>${e.date}</small></div>`).join('');
}
function renderMarket(){
  seedMarket.innerHTML=Object.keys(cropData).map(k=>`<div class="row"><b>${cropData[k].label}</b><span style="float:right">${money(state.seedCost[k])} / acre</span><div class="muted">Cost to seed current acreage: ${money(Math.round(state.crops[k]*state.seedCost[k]))}</div></div>`).join('');
  commodityMarket.innerHTML=['cotton','cane','corn','rice','sugar'].map(k=>`<div class="row"><b>${k[0].toUpperCase()+k.slice(1)}</b><span style="float:right">${priceArrow(k)} ${money(state.prices[k])}</span></div>`).join('');
  gossipPanel.innerHTML=`<p>${state.gossip}</p><p class="muted">Rumor is a signal, not a promise. Market consensus can be profitable or disastrously crowded.</p>`;
}
function renderPlanting(){
  const used=Object.values(state.crops).reduce((a,b)=>a+b,0); acreageBadge.textContent=`${used} / ${state.cultivated} acres used`;
  cropControls.innerHTML=Object.keys(cropData).map(k=>`<div class="crop-row"><div><b>${cropData[k].label}</b><div class="muted">${state.crops[k]} acres • seed ${money(state.seedCost[k])}/acre</div></div><input type="range" min="0" max="${state.cultivated}" step="10" value="${state.crops[k]}" data-crop="${k}"><strong>${state.crops[k]}</strong></div>`).join('');
  cropControls.querySelectorAll('input').forEach(input=>input.addEventListener('input',e=>{
    const k=e.target.dataset.crop; const next=Number(e.target.value); const other=Object.entries(state.crops).filter(([x])=>x!==k).reduce((a,[,v])=>a+v,0); if(other+next>state.cultivated){toast('Not enough cultivated acreage.');e.target.value=state.crops[k];return} state.crops[k]=next; render();
  }));
  strategyPanel.innerHTML=`<p>The market expects <b>cotton</b> to remain strong, while the almanac predicts unusual heat.</p><p><b>Contrarian possibility:</b> shift acreage toward crops better suited to the forecast. If the forecast is wrong, that hedge can cost you.</p><p class="muted">This is the core Georgia Sun loop: incomplete information, capital commitments, then consequences.</p>`;
  yieldTable.innerHTML=`<div class="table-wrap"><table><thead><tr><th>Crop</th><th>Acres</th><th>Baseline / month</th><th>Forecast sensitivity</th></tr></thead><tbody>${Object.keys(cropData).map(k=>`<tr><td>${cropData[k].label}</td><td>${state.crops[k]}</td><td>${expectedYield(k)}</td><td>${cropData[k].heat>.75?'Heat tolerant':cropData[k].drought<.25?'Needs water':'Mixed'}</td></tr>`).join('')}</tbody></table></div>`;
}
function renderEstate(){
  const used=Object.values(state.crops).reduce((a,b)=>a+b,0);
  landPanel.innerHTML=`<p><b>${state.acres}</b> total acres</p><p><b>${state.cultivated}</b> cultivated acres</p><p><b>${used}</b> allocated to crops</p><p><b>${state.acres-state.cultivated}</b> woods, pasture, roads, buildings and water</p>`;
  buildingPanel.innerHTML=`<p>Sugar mill level <b>${state.millLevel}</b></p><p>Warehouse level <b>${state.warehouse}</b></p><p>Infirmary <b>${state.infirmary?'built':'not built'}</b></p><p>Dock / landing <b>operational</b></p><p>Schooners <b>${state.ships}</b></p>`;
}
function renderLabor(){
  enslavedKpi.textContent=state.enslaved; hiredKpi.textContent=state.hired; injuredKpi.textContent=state.injured;
  rationPanel.innerHTML=`<p>Current: <b>${state.rations}</b></p><div class="stack-actions"><button class="secondary-btn" data-ration="reduced">Reduced</button><button class="secondary-btn" data-ration="standard">Standard</button><button class="secondary-btn" data-ration="improved">Improved</button></div>`;
  carePanel.innerHTML=`<p>Current: <b>${state.care}</b></p><div class="stack-actions"><button class="secondary-btn" data-care="minimal">Minimal</button><button class="secondary-btn" data-care="standard">Standard</button><button class="secondary-btn" data-care="physician">Physician retained</button></div>`;
  rationPanel.querySelectorAll('[data-ration]').forEach(b=>b.onclick=()=>{state.rations=b.dataset.ration;render()});
  carePanel.querySelectorAll('[data-care]').forEach(b=>b.onclick=()=>{state.care=b.dataset.care;render()});
  medicalCases.innerHTML=state.injured?`<p><b>${state.injured}</b> people are currently injured or infirm. Later versions can track named individuals, injury type, prognosis, treatment cost, disability and recovery time.</p>`:'<p class="muted">No current cases.</p>';
}
function renderSugar(){
  sugarPanel.innerHTML=`<p>Mill level: <b>${state.millLevel}</b></p><p>Estimated sugar output this month: <b>${sugarOutput()}</b> units</p><p>Market price: <b>${money(state.prices.sugar)}</b></p><p>Equipment condition: <b>${state.conditions.equipment}%</b></p>`;
  const risk=clamp(12+state.millLevel*4+(100-state.conditions.equipment)*.28,5,50); sugarRisk.innerHTML=`${meter('Injury risk',risk,risk>25?'bad':'normal')}<p class="muted">Higher throughput and poor maintenance increase breakdown and scalding risk.</p>`;
}
function renderShipping(){
  fleetPanel.innerHTML=`<p><b>${state.ships}</b> schooner(s)</p><p>Maintenance: <b>${money(state.ships*45)}</b> / month</p><button id="buyShip" class="secondary-btn">Buy schooner • $4,500</button>`;
  const routes=[['Savannah → Charleston',2,650,9],['Savannah → New Orleans',3,1100,16],['Savannah → Nassau',3,1400,24]];
  tradeRoutes.innerHTML=routes.map((r,i)=>`<div class="route-row"><div><h4>${r[0]}</h4><p>${r[1]} months • expected ${money(r[2])} • risk ${r[3]}%</p></div><button class="secondary-btn" data-route="${i}">Dispatch</button></div>`).join('');
  tradeRoutes.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>dispatch(Number(b.dataset.route)));
  activeMissions.innerHTML=state.missions.length?state.missions.map(m=>`<div class="route-row"><div><h4>${m.route}</h4><p>${m.left} month(s) remaining • expected ${money(m.profit)}</p></div><span class="badge">Underway</span></div>`).join(''):'<p class="muted">No active missions.</p>';
  document.getElementById('buyShip').onclick=()=>spend(4500,()=>{state.ships++;state.estateValue+=3600},'Schooner purchased.');
}
function renderLedger(){
  creditPanel.innerHTML=`<p>Outstanding debt: <b>${money(state.debt)}</b></p><p>Monthly interest: <b>${money(state.debt*.0075)}</b></p><div class="action-grid"><button id="borrow" class="secondary-btn">Borrow $1,000</button><button id="repay" class="secondary-btn">Repay $1,000</button></div>`;
  projectionPanel.innerHTML=`<p>Projected revenue: <b>${money(monthlyRevenue())}</b></p><p>Projected expenses: <b>${money(monthlyExpenses())}</b></p><p>Projected net: <b class="${projectedNet()>=0?'good':'bad'}">${money(projectedNet())}</b></p>`;
  ledgerRows.innerHTML=state.ledger.length?state.ledger.slice().reverse().slice(0,12).map(r=>`<tr><td>${r.date}</td><td>${money(r.rev)}</td><td>${money(r.exp)}</td><td class="${r.net>=0?'good':'bad'}">${money(r.net)}</td><td>${money(r.cash)}</td></tr>`).join(''):'<tr><td colspan="5" class="muted">Advance a month to begin the ledger.</td></tr>';
  document.getElementById('borrow').onclick=()=>{state.cash+=1000;state.debt+=1000;toast('Borrowed $1,000.');render()};
  document.getElementById('repay').onclick=()=>{if(state.cash<1000||state.debt<=0)return toast('Not enough cash or no debt to repay.');const x=Math.min(1000,state.debt);state.cash-=x;state.debt-=x;toast(`Repaid ${money(x)}.`);render()};
}
function render(){renderOverview();renderMarket();renderPlanting();renderEstate();renderLabor();renderSugar();renderShipping();renderLedger()}

function spend(cost,fn,msg){if(state.cash<cost)return toast('Not enough cash.');state.cash-=cost;fn();toast(msg);render()}

document.getElementById('buyLand').onclick=()=>spend(2000,()=>{state.acres+=100;state.cultivated+=60;state.estateValue+=2400},'Purchased 100 acres.');
document.getElementById('buildWarehouse').onclick=()=>spend(1250,()=>{state.warehouse++;state.estateValue+=1000},'Warehouse expanded.');
document.getElementById('buildInfirmary').onclick=()=>{if(state.infirmary)return toast('Infirmary already built.');spend(1800,()=>{state.infirmary=1;state.estateValue+=1300;state.conditions.health=clamp(state.conditions.health+5,0,100)},'Infirmary built.')};
document.getElementById('repairEquipment').onclick=()=>spend(600,()=>state.conditions.equipment=clamp(state.conditions.equipment+22,0,100),'Equipment repaired.');
document.getElementById('upgradeMill').onclick=()=>spend(1500,()=>{state.millLevel++;state.estateValue+=1100;state.conditions.equipment=clamp(state.conditions.equipment+12,0,100)},'Sugar mill upgraded.');
document.getElementById('maintenanceMill').onclick=()=>spend(350,()=>state.conditions.equipment=clamp(state.conditions.equipment+14,0,100),'Preventive maintenance completed.');

function dispatch(i){
  if(state.missions.length>=state.ships)return toast('All vessels are already assigned.');
  const routes=[{route:'Savannah → Charleston',left:2,profit:650,risk:9},{route:'Savannah → New Orleans',left:3,profit:1100,risk:16},{route:'Savannah → Nassau',left:3,profit:1400,risk:24}];
  state.missions.push({...routes[i]});toast('Trade mission dispatched.');render();
}

function chooseWeather(){
  const r=Math.random();
  if(r<.25)return 'heatwave';
  if(r<.45)return 'drought';
  if(r<.68)return 'wet';
  return 'ideal';
}
function newForecast(){
  const forecasts=[
    ['Hotter and drier than usual summer',58,72,38],
    ['Wet spring followed by an ordinary summer',62,44,76],
    ['Mild season with average rainfall',54,38,48],
    ['Dry spring; late summer storms possible',51,61,57]
  ];
  const f=forecasts[Math.floor(Math.random()*forecasts.length)];
  state.weather.forecast=f[0];state.weather.confidence=f[1];state.weather.heatRisk=f[2];state.weather.rainRisk=f[3];state.weather.actual='unknown';
}
function marketMove(){
  state.pricePrev={...state.prices};
  for(const k of Object.keys(state.prices)){
    const volatility=k==='sugar'?5:k==='cotton'?6:3;
    state.prices[k]=Math.max(2,Math.round((state.prices[k]+(Math.random()-.5)*volatility)*10)/10);
  }
  for(const k of Object.keys(state.seedCost)) state.seedCost[k]=Math.max(1,Math.round((state.seedCost[k]+(Math.random()-.5)*.8)*10)/10);
}
function maybeDecision(){
  const r=Math.random();
  if(r<.22){showDecision('Boiling-house injury','A worker has suffered a serious scalding injury in the sugar works. Production will be affected while you decide how much care to provide.',[
    ['Call a physician ($120)',()=>{state.cash-=120;state.conditions.health=clamp(state.conditions.health+2,0,100);state.injured=Math.max(0,state.injured-1);state.conditions.unrest=clamp(state.conditions.unrest-2,0,100)}],
    ['Treat locally ($35)',()=>{state.cash-=35;state.injured+=1;state.conditions.health=clamp(state.conditions.health-1,0,100)}],
    ['Return to light duty early',()=>{state.conditions.unrest=clamp(state.conditions.unrest+5,0,100);state.conditions.health=clamp(state.conditions.health-4,0,100);state.injured+=1}]
  ]);return 'A serious sugar-house injury requires a decision.'}
  if(r<.42){state.conditions.food=clamp(state.conditions.food-9,0,100);return 'Stored provisions spoiled during humid weather.'}
  if(r<.62){state.conditions.equipment=clamp(state.conditions.equipment-8,0,100);return 'Mill and field equipment suffered heavier-than-normal wear.'}
  if(r<.78){return 'A neighboring planter boasts that cotton is the only sensible crop this year. The local merchant repeats the claim.'}
  return 'The month passed without a major estate-wide incident.';
}
function showDecision(title,text,choices){
  decisionTitle.textContent=title;decisionText.textContent=text;decisionChoices.innerHTML='';
  choices.forEach(([label,fn])=>{const b=document.createElement('button');b.className='secondary-btn';b.textContent=label;b.onclick=()=>{fn();decisionModal.classList.add('hidden');state.events.unshift({date:currentDate(),text:`Decision resolved: ${label}.`});render()};decisionChoices.appendChild(b)});
  decisionModal.classList.remove('hidden');
}

function advanceMonth(){
  if(!decisionModal.classList.contains('hidden'))return toast('Resolve the pending decision first.');
  if(state.month===4||state.month===5||state.month===6||state.month===7){state.weather.actual=chooseWeather()}
  const rev=monthlyRevenue(),exp=monthlyExpenses(),net=rev-exp;
  state.cash+=net;state.debt+=Math.round(state.debt*.0075);
  state.inventory.cotton+=expectedYield('cotton');state.inventory.corn+=expectedYield('corn');state.inventory.rice+=expectedYield('rice');state.inventory.sugar+=sugarOutput();
  state.conditions.food=clamp(state.conditions.food+(state.rations==='improved'?2:state.rations==='reduced'?-5:-1),0,100);
  state.conditions.health=clamp(state.conditions.health+(state.care==='physician'?2:state.care==='minimal'?-2:0)+(state.rations==='improved'?1:state.rations==='reduced'?-2:0),0,100);
  state.conditions.unrest=clamp(state.conditions.unrest+(state.rations==='reduced'?4:state.rations==='improved'?-2:0)+(state.conditions.health<55?3:0),0,100);
  state.conditions.equipment=clamp(state.conditions.equipment-2,0,100);
  state.conditions.soil=clamp(state.conditions.soil+(Math.random()>.6?-2:1),0,100);
  state.missions.forEach(m=>m.left--);
  const finished=state.missions.filter(m=>m.left<=0);
  finished.forEach(m=>{const trouble=Math.random()*100<m.risk;const gain=trouble?Math.round(m.profit*.25):Math.round(m.profit*(.85+Math.random()*.35));state.cash+=gain;state.events.unshift({date:currentDate(),text:trouble?`${m.route} encountered trouble and returned only ${money(gain)}.`:`${m.route} completed, returning ${money(gain)}.`})});
  state.missions=state.missions.filter(m=>m.left>0);
  state.ledger.push({date:currentDate(),rev,exp,net,cash:state.cash});
  state.month++;if(state.month>11){state.month=0;state.year++}
  if(state.month===1)newForecast();
  marketMove();
  const eventText=maybeDecision();state.events.unshift({date:currentDate(),text:eventText});
  render();
}

document.getElementById('advanceMonth').onclick=advanceMonth;
render();
