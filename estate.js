(() => {
  const style=document.createElement('link');style.rel='stylesheet';style.href='estate.css';document.head.appendChild(style);

  const LAND_CAP=10000;
  const household=8;
  const extraCrops={
    wheat:{label:'Wheat',heat:.48,drought:.48,wet:.48,seed:2.7,price:9,yield:1.45,note:'Bread grain; useful for provisioning or sale.'},
    oats:{label:'Oats',heat:.42,drought:.48,wet:.56,seed:2.2,price:7,yield:1.5,note:'Feed and market grain.'},
    barley:{label:'Barley',heat:.42,drought:.52,wet:.44,seed:2.4,price:8,yield:1.35,note:'Feed, food and processing grain.'},
    rye:{label:'Rye',heat:.46,drought:.62,wet:.42,seed:2.0,price:7,yield:1.4,note:'Hardy grain for marginal ground.'},
    potatoes:{label:'Potatoes',heat:.38,drought:.34,wet:.58,seed:5.2,price:10,yield:2.4,note:'Food crop with strong provisioning value.'},
    sweetPotatoes:{label:'Sweet Potatoes',heat:.78,drought:.52,wet:.55,seed:4.5,price:11,yield:2.3,note:'Warm-season food crop.'},
    peas:{label:'Field Peas',heat:.72,drought:.6,wet:.48,seed:2.1,price:8,yield:1.35,note:'Food/feed crop with soil-restoring value.'},
    beans:{label:'Beans',heat:.62,drought:.48,wet:.52,seed:2.6,price:10,yield:1.25,note:'Food crop; useful diversification.'},
    strawberries:{label:'Strawberries',heat:.38,drought:.3,wet:.5,seed:8.5,price:28,yield:.7,note:'High-value, labor-intensive specialty crop.'},
    melons:{label:'Melons',heat:.78,drought:.48,wet:.52,seed:3.6,price:15,yield:1.25,note:'Seasonal market garden crop.'}
  };

  for(const [k,c] of Object.entries(extraCrops)){
    if(!cropData[k])cropData[k]={label:c.label,heat:c.heat,drought:c.drought,wet:c.wet};
    if(state.crops[k]==null)state.crops[k]=0;
    if(state.seedCost[k]==null)state.seedCost[k]=c.seed;
    if(state.prices[k]==null)state.prices[k]=c.price;
    if(state.pricePrev[k]==null)state.pricePrev[k]=c.price;
    if(state.yield[k]==null)state.yield[k]=c.yield;
    if(state.inventory[k]==null)state.inventory[k]=0;
  }

  state.land=state.land||{
    cap:LAND_CAP,
    categories:{cultivated:state.cultivated,woodland:state.woods,pasture:70,wetland:30,orchard:10,infrastructure:10},
    pasture:{cattle:30,goats:10,sheep:10,hay:15,apiary:5},
    woodland:{timber:90,firewood:45,hunting:35,apiary:10,reserve:80},
    wetland:{riceSupport:10,marshPlants:5,seasonalGrazing:5,reserve:10},
    orchard:{fruit:4,berries:2,kitchenGarden:2,herbs:1,apiary:1}
  };
  state.livestock=state.livestock||{cattle:12,goats:8,sheep:10,pigs:14,chickens:32};
  state.finance=state.finance||{arrearsMonths:0,foreclosed:false,lastProvisionCost:0,lastOverhead:0,status:'Healthy'};

  function landUsed(group){return Object.values(state.land[group]||{}).reduce((a,b)=>a+Number(b||0),0)}
  function cropAcres(){return Object.values(state.crops).reduce((a,b)=>a+Number(b||0),0)}
  function totalLand(){return Object.values(state.land.categories).reduce((a,b)=>a+Number(b||0),0)}
  function availableLand(){return Math.max(0,state.land.cap-state.acres)}

  function foodProductionScore(){
    const inv=state.inventory;
    return (inv.corn||0)*.7+(inv.flour||0)*1.2+(inv.bread||0)*1.4+(inv.potatoes||0)*.8+(inv.sweetPotatoes||0)*.9+(inv.peas||0)*.8+(inv.beans||0)*.9+(inv.honey||0)*.35;
  }
  function provisionNeed(){
    const people=state.enslaved+state.hired+household;
    const livestockFeed=state.livestock.cattle*2.4+state.livestock.goats*.7+state.livestock.sheep*.8+state.livestock.pigs*1.0+state.livestock.chickens*.06;
    const foodNeed=people*1.35;
    const foodCredit=Math.min(foodNeed*.7,foodProductionScore()/14);
    const purchasedFood=Math.max(0,foodNeed-foodCredit);
    const foodCost=purchasedFood*1.65;
    const clothingTools=people*.42;
    const saltMedicine=people*.22;
    const feedCredit=(state.land.pasture.hay*.42)+(state.inventory.oats||0)*.12+(state.inventory.corn||0)*.05;
    const feedCost=Math.max(0,livestockFeed-feedCredit)*.72;
    const total=Math.round(foodCost+clothingTools+saltMedicine+feedCost);
    return {people,foodNeed,foodCredit,purchasedFood,foodCost,clothingTools,saltMedicine,livestockFeed,feedCredit,feedCost,total,selfSufficiency:clamp(foodCredit/Math.max(1,foodNeed)*100,0,100)};
  }
  function estateOverhead(){
    const acreage=state.acres*.045;
    const building=state.estateValue*.00055;
    const animals=state.livestock.cattle*1.8+state.livestock.goats*.5+state.livestock.sheep*.55+state.livestock.pigs*.65+state.livestock.chickens*.03;
    return Math.round(acreage+building+animals);
  }
  function liquidityStatus(){
    const monthlyBurn=(turnExpensesBase?turnExpensesBase():0)+provisionNeed().total+estateOverhead();
    const debtRatio=state.estateValue>0?state.debt/state.estateValue:1;
    let s='Healthy';
    if(state.cash<monthlyBurn*2)s='Tight';
    if(state.cash<monthlyBurn||debtRatio>.45)s='Strained';
    if(debtRatio>.65)s='Overleveraged';
    if(state.cash<0||debtRatio>.8)s='Distressed';
    if(state.finance.arrearsMonths>=2)s='Default';
    state.finance.status=s;return {s,monthlyBurn,debtRatio};
  }

  const turnRevenueBase=turnRevenue;
  turnRevenue=function(){
    let n=turnRevenueBase();
    for(const k of Object.keys(extraCrops))n+=turnYield(k)*state.prices[k];
    return Math.round(n);
  };
  const turnExpensesBase=turnExpenses;
  turnExpenses=function(){
    const p=provisionNeed(),o=estateOverhead();
    state.finance.lastProvisionCost=p.total;state.finance.lastOverhead=o;
    return Math.round(turnExpensesBase()+p.total+o);
  };

  function injectUI(){
    const nav=document.getElementById('nav');
    if(nav&&!document.querySelector('[data-view="land"]')){
      const b=document.createElement('button');b.className='nav-btn';b.dataset.view='land';b.textContent='Land & Provisions';
      const planting=document.querySelector('[data-view="planting"]');planting.insertAdjacentElement('afterend',b);b.onclick=()=>setView('land');
    }
    if(!document.getElementById('land')){
      const sec=document.createElement('section');sec.id='land';sec.className='view';
      sec.innerHTML=`
        <div class="land-summary-grid" id="landSummary"></div>
        <article class="card"><div class="section-head"><h3>Estate Land Allocation</h3><span class="badge">Every acre has an opportunity cost</span></div><div id="landAllocation"></div></article>
        <div class="two-col"><article class="card"><div class="section-head"><h3>Livestock</h3><span class="badge">Pasture + feed</span></div><div id="livestockPanel"></div></article><article class="card"><div class="section-head"><h3>Provision Burden</h3><span class="badge">Recurring cash drain</span></div><div id="provisionPanel"></div></article></div>
        <article class="card"><div class="section-head"><h3>Expanded Crop Catalog</h3><span class="badge">Cultivated acreage is shared</span></div><div id="cropCatalog" class="crop-catalog"></div></article>
        <article class="card"><div class="section-head"><h3>County Land Market</h3><span class="badge">Finite expansion</span></div><div id="landMarket"></div></article>`;
      document.getElementById('industries').insertAdjacentElement('beforebegin',sec);
    }
    if(!document.getElementById('solvencyPanel')){
      const card=document.createElement('article');card.className='card';card.innerHTML='<div class="section-head"><h3>Solvency & Estate Risk</h3><span class="badge">Wealth ≠ liquidity</span></div><div id="solvencyPanel"></div>';
      document.getElementById('ledger').appendChild(card);
    }
  }

  const allocationLabels={
    pasture:{cattle:'Cattle pasture',goats:'Goat browse',sheep:'Sheep pasture',hay:'Hay meadow',apiary:'Apiary forage'},
    woodland:{timber:'Managed timber',firewood:'Firewood',hunting:'Hunting reserve',apiary:'Apiary forage',reserve:'Uncut reserve'},
    wetland:{riceSupport:'Rice / water support',marshPlants:'Marsh plants',seasonalGrazing:'Seasonal grazing',reserve:'Natural reserve'},
    orchard:{fruit:'Fruit trees',berries:'Berries',kitchenGarden:'Kitchen garden',herbs:'Herbs / medicinal',apiary:'Apiary site'}
  };
  function allocationGroup(group,title,total){
    const used=landUsed(group),free=total-used;
    return `<div class="allocation-group"><div class="allocation-head"><h4>${title}</h4><span class="badge">${used} / ${total} acres • ${free} free</span></div>${Object.entries(state.land[group]).map(([k,v])=>`<div class="allocation-row"><span>${allocationLabels[group][k]}</span><input type="range" min="0" max="${total}" step="1" value="${v}" data-land-group="${group}" data-land-use="${k}"><output>${v} ac</output></div>`).join('')}</div>`;
  }

  function renderLand(){
    if(!document.getElementById('landSummary'))return;
    const c=state.land.categories,p=provisionNeed();
    landSummary.innerHTML=`<div class="land-kpi"><span>Total estate</span><strong>${state.acres} ac</strong></div><div class="land-kpi"><span>Cultivated</span><strong>${c.cultivated} ac</strong></div><div class="land-kpi"><span>County ceiling</span><strong>${state.land.cap.toLocaleString()} ac</strong></div><div class="land-kpi"><span>Food self-supply</span><strong>${Math.round(p.selfSufficiency)}%</strong></div>`;
    landAllocation.innerHTML=`<div class="allocation-group"><div class="allocation-head"><h4>Cultivated fields</h4><span class="badge">${cropAcres()} / ${c.cultivated} acres • ${Math.max(0,c.cultivated-cropAcres())} free</span></div><p class="muted">Cultivated acreage is divided among the crops on the Planting screen. Adding one crop means taking land away from another unless acreage is free.</p></div>`+
      allocationGroup('pasture','Pasture',c.pasture)+allocationGroup('woodland','Woodland',c.woodland)+allocationGroup('wetland','Wetland / low ground',c.wetland)+allocationGroup('orchard','Orchard & garden',c.orchard)+`<div class="allocation-group"><div class="allocation-head"><h4>Roads, yards & buildings</h4><span class="badge">${c.infrastructure} acres</span></div><p class="muted">Infrastructure acreage is occupied by the house, quarters, barns, roads, yards, mills and other improvements.</p></div>`;
    landAllocation.querySelectorAll('[data-land-group]').forEach(i=>i.oninput=e=>{
      const g=e.target.dataset.landGroup,k=e.target.dataset.landUse,next=Number(e.target.value),total=state.land.categories[g];
      const other=Object.entries(state.land[g]).filter(([x])=>x!==k).reduce((a,[,v])=>a+Number(v),0);
      if(other+next>total){toast(`Only ${Math.max(0,total-other)} acres remain in ${g}.`);e.target.value=state.land[g][k];return}
      state.land[g][k]=next;renderLand();
    });

    livestockPanel.innerHTML=`<table class="estate-ledger-table"><tr><th>Stock</th><th>Head</th><th></th></tr>${[['cattle','Cattle',45],['goats','Goats',9],['sheep','Sheep',12],['pigs','Pigs',8],['chickens','Chickens',1]].map(([k,l,cost])=>`<tr><td>${l}</td><td>${state.livestock[k]}</td><td><button class="secondary-btn" data-animal="${k}" data-cost="${cost}">Buy +1 • ${money(cost)}</button></td></tr>`).join('')}</table><p class="muted">More animals mean more food, feed, veterinary and land pressure. Livestock sales and breeding are next-stage systems.</p>`;
    livestockPanel.querySelectorAll('[data-animal]').forEach(b=>b.onclick=()=>{const cost=Number(b.dataset.cost);if(state.cash<cost)return toast('Not enough cash.');state.cash-=cost;state.livestock[b.dataset.animal]++;state.events.unshift({date:currentDate(),text:`Purchased one ${b.dataset.animal}.`});render()});

    provisionPanel.innerHTML=`<div class="provision-grid"><div class="provision-kpi"><span>People supplied</span><strong>${p.people}</strong></div><div class="provision-kpi"><span>Purchased food burden</span><strong>${money(p.foodCost)}</strong></div><div class="provision-kpi"><span>Animal feed burden</span><strong>${money(p.feedCost)}</strong></div><div class="provision-kpi"><span>Total / turn</span><strong>${money(p.total)}</strong></div></div><p class="muted">Prototype operating model: food grown on the estate reduces purchases, while population, livestock and shortages increase cash costs. Values are gameplay-tunable rather than a claim of one universal historical plantation budget.</p>`;

    cropCatalog.innerHTML=Object.entries(extraCrops).map(([k,crop])=>`<div class="crop-chip"><b>${crop.label}</b><small>${crop.note}<br>Seed ${money(state.seedCost[k])}/acre • market ${money(state.prices[k])}</small></div>`).join('');
    const nextCost=landPurchaseCost();
    landMarket.innerHTML=`<p><b>${availableLand().toLocaleString()} acres</b> remain before the current county-estate ceiling. Neighboring parcels become progressively more expensive as the estate grows.</p><button id="buyCountyLand" class="secondary-btn" ${availableLand()<100?'disabled':''}>Buy next 100 acres • ${money(nextCost)}</button><p class="muted">A single estate is capped at ${state.land.cap.toLocaleString()} acres in this prototype. Future expansion beyond that will require separately managed properties, inheritance or exceptional transactions.</p>`;
    document.getElementById('buyCountyLand')?.addEventListener('click',buyCountyLand);
  }

  function landPurchaseCost(){const growth=Math.max(0,(state.acres-900)/100);return Math.round(2000*Math.pow(1.045,growth))}
  function buyCountyLand(){
    if(availableLand()<100)return toast('No 100-acre parcel remains under the current estate cap.');
    const cost=landPurchaseCost();if(state.cash<cost)return toast('Not enough cash for the next parcel.');
    state.cash-=cost;state.acres+=100;state.cultivated+=55;state.woods+=25;
    state.land.categories.cultivated+=55;state.land.categories.woodland+=25;state.land.categories.pasture+=12;state.land.categories.wetland+=5;state.land.categories.orchard+=2;state.land.categories.infrastructure+=1;
    state.land.woodland.reserve+=25;state.land.pasture.hay+=12;state.land.wetland.reserve+=5;state.land.orchard.fruit+=2;state.estateValue+=Math.round(cost*1.15);
    state.events.unshift({date:currentDate(),text:`Purchased another 100-acre parcel for ${money(cost)}.`});render();
  }

  function renderSolvency(){
    const el=document.getElementById('solvencyPanel');if(!el)return;
    const q=liquidityStatus(),cls='status-'+q.s.toLowerCase().replace(/\s+/g,'-');const equity=Math.max(0,state.estateValue-state.debt);
    el.innerHTML=`<div class="solvency-grid"><div class="solvency-kpi"><span>Status</span><strong class="solvency-status ${cls}">${q.s}</strong></div><div class="solvency-kpi"><span>Estate equity</span><strong>${money(equity)}</strong></div><div class="solvency-kpi"><span>Debt / value</span><strong>${Math.round(q.debtRatio*100)}%</strong></div><div class="solvency-kpi"><span>Current cash</span><strong>${money(state.cash)}</strong></div></div><p>Provisioning this turn: <b>${money(state.finance.lastProvisionCost)}</b> • maintenance/tax/livestock overhead: <b>${money(state.finance.lastOverhead)}</b>.</p><div class="action-grid"><button id="estateMortgage" class="secondary-btn">Borrow $5,000 against estate</button><button id="estateRepay" class="secondary-btn">Repay $5,000 debt</button></div>${q.s==='Distressed'||q.s==='Default'?'<div class="land-warning"><b>Estate at risk.</b> Continued month-end arrears at extreme leverage can trigger foreclosure and liquidation.</div>':'<div class="land-good">The estate is presently meeting its obligations, but land value does not equal spendable cash.</div>'}`;
    document.getElementById('estateMortgage').onclick=()=>{const ceiling=state.estateValue*.8;if(state.debt+5000>ceiling)return toast('No lender will extend another $5,000 at this leverage.');state.debt+=5000;state.cash+=5000;state.events.unshift({date:currentDate(),text:'Borrowed $5,000 against estate assets.'});render()};
    document.getElementById('estateRepay').onclick=()=>{if(state.cash<5000||state.debt<=0)return toast('Insufficient cash or debt balance.');const x=Math.min(5000,state.debt);state.cash-=x;state.debt-=x;render()};
  }

  function monthEndCheck(){
    const q=liquidityStatus();
    if(state.cash<0||q.debtRatio>.82)state.finance.arrearsMonths++;else state.finance.arrearsMonths=Math.max(0,state.finance.arrearsMonths-1);
    if(state.finance.arrearsMonths>=3&&q.debtRatio>.9&&!state.finance.foreclosed)foreclose();
  }
  function foreclose(){
    state.finance.foreclosed=true;
    state.events.unshift({date:currentDate(),text:'FORECLOSURE: creditors seized the estate after sustained arrears and extreme leverage.'});
    state.cash=100;state.debt=0;state.estateValue=0;state.acres=0;state.cultivated=0;state.woods=0;
    Object.keys(state.crops).forEach(k=>state.crops[k]=0);Object.keys(state.inventory).forEach(k=>state.inventory[k]=0);Object.keys(state.livestock).forEach(k=>state.livestock[k]=0);
    state.land.categories={cultivated:0,woodland:0,pasture:0,wetland:0,orchard:0,infrastructure:0};
    state.land.pasture={cattle:0,goats:0,sheep:0,hay:0,apiary:0};state.land.woodland={timber:0,firewood:0,hunting:0,apiary:0,reserve:0};state.land.wetland={riceSupport:0,marshPlants:0,seasonalGrazing:0,reserve:0};state.land.orchard={fruit:0,berries:0,kitchenGarden:0,herbs:0,apiary:0};
    state.buildings={warehouse:0,infirmary:0,sawmill:0,apiary:0,gristmill:0,bakery:0};state.hives=0;state.ships=0;state.missions=[];
    toast('The estate has been foreclosed. The game continues, but the property is gone.');
  }

  function afterTurn(closing){
    for(const k of Object.keys(extraCrops))state.inventory[k]+=turnYield(k);
    if(closing)monthEndCheck();
    render();
  }

  injectUI();
  const originalRender=render;
  render=function(){originalRender();renderLand();renderSolvency();const old=document.getElementById('buyLand');if(old){old.textContent='Land purchases moved to Land & Provisions';old.disabled=true}};
  const adv=document.getElementById('advanceTurn'),originalAdvance=adv.onclick;
  adv.onclick=()=>{const closing=state.phase===3;originalAdvance();afterTurn(closing)};
  render();
})();
