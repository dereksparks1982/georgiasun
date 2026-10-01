(() => {
  let booted=false;
  const $=id=>document.getElementById(id);
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const irnd=(a,b)=>Math.floor(rnd(a,b+1));

  function wait(){
    if(booted)return;
    if(typeof state==='undefined'||!state.land||typeof render!=='function'){setTimeout(wait,120);return}
    booted=true;initState();injectUI();hookTurn();hookRender();renderOperating();
  }

  function initState(){
    state.ops=state.ops||{
      stock:{meat:120,flour:95,grain:180,vegetables:140,fruit:55,salt:42,feed:210,hay:170,household:70},
      spoilage:{meat:.055,flour:.012,grain:.008,vegetables:.06,fruit:.075,salt:0,feed:.012,hay:.01,household:.002},
      prices:{meat:1.9,flour:1.3,grain:.8,vegetables:.75,fruit:1.05,salt:2.4,feed:.65,hay:.5,household:1.7},
      lastExpenses:{},lastEmergency:0,lastSpoilage:0,lastProvisionNote:'No operating turn processed yet.',
      fields:[
        {name:'North Cotton',acres:110,crop:'cotton',fertility:72,moisture:61,erosion:18,pests:14,disease:10,previous:'corn',fallow:0},
        {name:'South Cotton',acres:110,crop:'cotton',fertility:69,moisture:58,erosion:22,pests:17,disease:12,previous:'peas',fallow:0},
        {name:'Upper Cane',acres:60,crop:'cane',fertility:76,moisture:72,erosion:15,pests:12,disease:14,previous:'cane',fallow:0},
        {name:'Lower Cane',acres:60,crop:'cane',fertility:73,moisture:77,erosion:13,pests:11,disease:16,previous:'cane',fallow:0},
        {name:'East Corn',acres:55,crop:'corn',fertility:68,moisture:59,erosion:20,pests:18,disease:9,previous:'cotton',fallow:0},
        {name:'West Corn',acres:55,crop:'corn',fertility:71,moisture:63,erosion:17,pests:16,disease:8,previous:'peas',fallow:0},
        {name:'North Rice',acres:35,crop:'rice',fertility:74,moisture:88,erosion:9,pests:13,disease:18,previous:'rice',fallow:0},
        {name:'South Rice',acres:35,crop:'rice',fertility:75,moisture:91,erosion:8,pests:12,disease:17,previous:'rice',fallow:0}
      ],
      livestockAge:{cattle:3.5,goats:2.8,sheep:3.0,pigs:1.5,chickens:1.2},
      livestockHealth:{cattle:82,goats:85,sheep:80,pigs:78,chickens:84},
      births:{cattle:0,goats:0,sheep:0,pigs:0,chickens:0},deaths:{cattle:0,goats:0,sheep:0,pigs:0,chickens:0},
      products:{milk:0,eggs:0,wool:0,hides:0,meat:0},
      turnCounter:0
    };
  }

  function injectUI(){
    const link=document.createElement('link');link.rel='stylesheet';link.href='operating.css';document.head.appendChild(link);
    const land=$('land');if(land&&!$('operatingEstatePanel')){
      const wrap=document.createElement('div');wrap.id='operatingEstatePanel';wrap.innerHTML=`
        <article class="card"><div class="section-head"><h3>Operating Stores</h3><span class="badge">Consumed every turn</span></div><div id="opsStores"></div></article>
        <div class="two-col"><article class="card"><div class="section-head"><h3>Detailed Operating Ledger</h3><span class="badge">Where the money goes</span></div><div id="opsExpenseLedger"></div></article><article class="card"><div class="section-head"><h3>Livestock Cycle</h3><span class="badge">Births • products • losses</span></div><div id="opsLivestock"></div></article></div>
        <article class="card"><div class="section-head"><h3>Field Condition & Rotation</h3><span class="badge">Named management blocks</span></div><div class="ops-actions"><button id="syncFieldsFromPlan" class="secondary-btn">Rebuild Fields From Current Crop Plan</button></div><div id="opsFields"></div></article>`;
      land.appendChild(wrap);
    }
    const version=document.querySelector('.sidebar-footer span:first-child');if(version)version.textContent='Prototype v0.6-dev';
  }

  function people(){return state.enslaved+state.hired+8}
  function consumption(){
    const p=people(),l=state.livestock;
    return {
      meat:p*.15,flour:p*.24,grain:p*.31,vegetables:p*.27,fruit:p*.09,salt:p*.027,
      feed:l.cattle*1.1+l.goats*.25+l.sheep*.32+l.pigs*.55+l.chickens*.025,
      hay:l.cattle*.9+l.goats*.14+l.sheep*.2,
      household:p*.035
    };
  }

  function addProduction(){
    const s=state.ops.stock,l=state.livestock,o=state.ops;
    const pastureFactor=Math.min(1.25,.55+(state.land.pasture.hay||0)/40);
    const milk=Math.round(l.cattle*.22*pastureFactor+l.goats*.09*pastureFactor);
    const eggs=Math.round(l.chickens*.38);
    const wool=(state.month===3||state.month===4)?Math.round(l.sheep*.16):0;
    o.products.milk+=milk;o.products.eggs+=eggs;o.products.wool+=wool;
    s.meat+=Math.round(l.pigs*.03+l.chickens*.015);
    s.vegetables+=Math.round((state.land.orchard.kitchenGarden||0)*1.4);
    s.fruit+=Math.round((state.land.orchard.fruit||0)*.8+(state.land.orchard.berries||0)*.65);
    s.hay+=Math.round((state.land.pasture.hay||0)*1.1);
    s.feed+=Math.round((state.inventory.corn||0)*.015+(state.inventory.oats||0)*.03);
    if(state.inventory.flour)s.flour+=Math.round(Math.min(8,state.inventory.flour*.04));
    if(state.inventory.corn)s.grain+=Math.round(Math.min(10,state.inventory.corn*.025));
  }

  function consumeAndBuy(){
    const need=consumption(),s=state.ops.stock,p=state.ops.prices;
    let emergency=0,spoiled=0;const shortages=[];
    for(const k of Object.keys(s)){
      const loss=s[k]*(state.ops.spoilage[k]||0);s[k]=Math.max(0,s[k]-loss);spoiled+=loss*(p[k]||0);
      const use=need[k]||0;
      if(use>s[k]){
        const missing=use-s[k];s[k]=0;const premium=1.18+rnd(0,.18);const cost=missing*(p[k]||1)*premium;emergency+=cost;shortages.push(k);
      }else s[k]-=use;
    }
    emergency=Math.round(emergency);spoiled=Math.round(spoiled);
    if(emergency>0)state.cash-=emergency;
    state.ops.lastEmergency=emergency;state.ops.lastSpoilage=spoiled;
    if(shortages.length){state.conditions.food=clamp(state.conditions.food-1.2,0,100);state.conditions.health=clamp(state.conditions.health-.35,0,100);state.conditions.unrest=clamp(state.conditions.unrest+.5,0,100)}
    state.ops.lastProvisionNote=shortages.length?`Emergency purchases covered shortages in ${shortages.join(', ')} for ${money(emergency)}.`:`Stores covered this turn's basic consumption. Spoilage value: ${money(spoiled)}.`;
  }

  function operatingExpenses(){
    const p=people(),ac=state.acres,b=state.buildings,l=state.livestock;
    const x={
      'Cloth & clothing':p*.18,
      'Shoes':p*.075,
      'Tools':state.cultivated*.025,
      'Nails & hardware':ac*.006,
      'Wagon repair':18+state.ships*3,
      'Harness & tack':l.cattle*.18,
      'Seed reserve':Object.entries(state.crops).reduce((a,[k,v])=>a+(state.seedCost[k]||0)*v*.012,0),
      'Medical':state.injured*4+(state.care==='physician'?18:6),
      'Veterinary':(l.cattle+l.goats+l.sheep+l.pigs)*.12,
      'Fuel / firewood':Math.max(4,18-(state.land.woodland.firewood||0)*.08),
      'Building upkeep':state.estateValue*.00012,
      'Mill upkeep':(state.millLevel||0)*7+(b.sawmill?5:0)+(b.gristmill?5:0)+(b.bakery?4:0),
      'Freight':state.missions.length*9+state.ships*3,
      'Merchant commissions':Math.max(4,turnRevenue()*0.006),
      'Taxes & assessments':state.estateValue*.00008,
      'Interest expense':state.debt*.00035,
      'Specialists':state.hired*1.4
    };
    const total=Math.round(Object.values(x).reduce((a,b)=>a+b,0));state.ops.lastExpenses=x;state.cash-=total;return total;
  }

  function fieldCropEffect(f){
    const restorative=['peas','beans'].includes(f.crop),hard=['cotton','cane','corn'].includes(f.crop),wet=f.crop==='rice';
    if(f.fallow){f.fertility=clamp(f.fertility+rnd(.8,1.8),0,100);f.pests=clamp(f.pests-rnd(.7,1.5),0,100);f.disease=clamp(f.disease-rnd(.4,1.1),0,100);f.erosion=clamp(f.erosion-rnd(.1,.5),0,100);return}
    f.fertility=clamp(f.fertility+(restorative?rnd(.25,.8):hard?-rnd(.25,.85):-rnd(.05,.3)),0,100);
    const rain=state.weather.actual==='wet'?rnd(3,7):state.weather.actual==='drought'?-rnd(5,10):state.weather.actual==='heatwave'?-rnd(3,7):rnd(-2,3);
    f.moisture=clamp(f.moisture+rain+(wet?2:0),0,100);
    f.erosion=clamp(f.erosion+(state.weather.actual==='wet'?rnd(.3,1.1):rnd(0,.25))+(hard?.15:0),0,100);
    const repeat=f.previous===f.crop?1.2:.5;f.pests=clamp(f.pests+rnd(-.8,1.25)+repeat,0,100);f.disease=clamp(f.disease+rnd(-.7,1.0)+(f.moisture>80?.7:0)+repeat*.35,0,100);
  }

  function livestockMonth(){
    const types=['cattle','goats','sheep','pigs','chickens'],l=state.livestock,o=state.ops;
    for(const k of types){
      o.livestockAge[k]+=1/12;
      const capacity=k==='cattle'?state.land.pasture.cattle/2.3:k==='goats'?state.land.pasture.goats*1.6:k==='sheep'?state.land.pasture.sheep*1.4:k==='pigs'?Math.max(8,state.land.pasture.hay*.8):80;
      const crowded=Math.max(0,l[k]-capacity);o.livestockHealth[k]=clamp(o.livestockHealth[k]-crowded*.08+rnd(-1,1.2),20,100);
      let birthRate=k==='cattle'?.025:k==='goats'?.07:k==='sheep'?.055:k==='pigs'?.12:.18;
      let births=Math.floor(l[k]*birthRate*(o.livestockHealth[k]/100)+Math.random());
      let deathRate=.003+(o.livestockHealth[k]<55?.02:0)+(o.livestockAge[k]>(k==='chickens'?5:k==='pigs'?6:12)?.015:0);
      let deaths=Math.floor(l[k]*deathRate+Math.random()*.55);
      births=Math.max(0,births);deaths=Math.min(l[k],Math.max(0,deaths));l[k]+=births-deaths;o.births[k]+=births;o.deaths[k]+=deaths;
      if(deaths&&k!=='chickens'){o.products.hides+=deaths;o.stock.meat+=deaths*(k==='cattle'?9:k==='pigs'?4:2)}
    }
  }

  function processTurn(wasClosing){
    state.ops.turnCounter++;addProduction();consumeAndBuy();const opCost=operatingExpenses();
    state.ops.fields.forEach(fieldCropEffect);
    if(wasClosing)livestockMonth();
    state.events.unshift({date:currentDate(),text:`Estate operations: ${money(opCost)} detailed overhead${state.ops.lastEmergency?` plus ${money(state.ops.lastEmergency)} emergency provisions`:''}.`});
  }

  function hookTurn(){
    const b=$('advanceTurn');if(!b||b.dataset.opsHooked)return;b.dataset.opsHooked='1';const prior=b.onclick;
    b.onclick=()=>{const wasClosing=state.phase===3;prior?.();setTimeout(()=>{const modal=$('decisionModal');if(!modal||modal.classList.contains('hidden')){processTurn(wasClosing);render();renderOperating()}},0)};
  }

  function hookRender(){
    const old=render;window.render=function(){old();renderOperating()};
  }

  function cropOptions(selected){return Object.keys(cropData).map(k=>`<option value="${k}" ${k===selected?'selected':''}>${cropData[k].label}</option>`).join('')}
  function rebuildFieldsFromPlan(){
    const entries=Object.entries(state.crops).filter(([,a])=>a>0);const fields=[];let i=1;
    for(const [crop,acres] of entries){let left=acres;while(left>0){const size=Math.min(80,left);fields.push({name:`Field ${i++}`,acres:size,crop,fertility:irnd(62,78),moisture:irnd(52,76),erosion:irnd(8,24),pests:irnd(8,20),disease:irnd(6,18),previous:crop,fallow:0});left-=size}}
    state.ops.fields=fields;renderOperating();toast('Field blocks rebuilt from the current crop plan.');
  }
  function syncCropTotals(){for(const k of Object.keys(state.crops))state.crops[k]=0;for(const f of state.ops.fields){if(!f.fallow)state.crops[f.crop]=(state.crops[f.crop]||0)+f.acres}render()}

  function renderOperating(){
    if(!$('opsStores'))return;const o=state.ops,need=consumption();
    const keys=['meat','flour','grain','vegetables','fruit','salt','feed','hay','household'];
    $('opsStores').innerHTML=`<div class="ops-grid">${keys.slice(0,4).map(k=>`<div class="ops-kpi"><span>${k}</span><strong class="${o.stock[k]<(need[k]||1)*2?'stock-low':'stock-ok'}">${Math.round(o.stock[k])}</strong></div>`).join('')}</div><table class="ops-table"><thead><tr><th>Store</th><th>On hand</th><th>Turn need</th><th>Approx. turns</th></tr></thead><tbody>${keys.map(k=>`<tr><td>${k}</td><td>${Math.round(o.stock[k])}</td><td>${Math.round((need[k]||0)*10)/10}</td><td>${need[k]?Math.floor(o.stock[k]/need[k]):'∞'}</td></tr>`).join('')}</tbody></table><div class="turn-note">${o.lastProvisionNote}</div>`;

    const ex=o.lastExpenses,vals=Object.values(ex),max=Math.max(1,...vals);const total=Math.round(vals.reduce((a,b)=>a+b,0));
    $('opsExpenseLedger').innerHTML=Object.keys(ex).length?`${Object.entries(ex).map(([k,v])=>`<div class="expense-bar"><span>${k}</span><div class="expense-track"><div class="expense-fill" style="width:${Math.max(2,v/max*100)}%"></div></div><b>${money(v)}</b></div>`).join('')}<p><b>Detailed overhead this turn: ${money(total)}</b></p><p class="muted">Emergency provision purchases are charged separately when stores cannot cover consumption.</p>`:'<p class="muted">Advance a turn to produce the detailed operating ledger.</p>';

    const types=['cattle','goats','sheep','pigs','chickens'];
    $('opsLivestock').innerHTML=`<div class="livestock-row"><b>Stock</b><span>Head</span><span>Avg age</span><span>Health</span><span>Births</span><span>Deaths</span></div>${types.map(k=>`<div class="livestock-row"><b>${k}</b><span>${state.livestock[k]}</span><span>${o.livestockAge[k].toFixed(1)}y</span><span>${Math.round(o.livestockHealth[k])}%</span><span>${o.births[k]}</span><span>${o.deaths[k]}</span></div>`).join('')}<p class="muted">Products accumulated: milk ${o.products.milk}, eggs ${o.products.eggs}, wool ${o.products.wool}, hides ${o.products.hides}. Carrying capacity, feed and health affect the herd over time.</p>`;

    $('opsFields').innerHTML=o.fields.map((f,i)=>`<div class="field-card"><div class="field-head"><div><b>${f.name}</b> • ${f.acres} acres</div><span class="badge">${f.fallow?'Fallow':cropData[f.crop]?.label||f.crop}</span></div><div class="field-meta"><div><span>Fertility</span><strong>${Math.round(f.fertility)}%</strong></div><div><span>Moisture</span><strong>${Math.round(f.moisture)}%</strong></div><div><span>Erosion</span><strong>${Math.round(f.erosion)}%</strong></div><div><span>Pests</span><strong>${Math.round(f.pests)}%</strong></div><div><span>Disease</span><strong>${Math.round(f.disease)}%</strong></div></div><div class="ops-actions"><select data-field-crop="${i}" ${f.fallow?'disabled':''}>${cropOptions(f.crop)}</select><button class="secondary-btn" data-fallow="${i}">${f.fallow?'Return to production':'Leave fallow'}</button></div><small class="muted">Previous crop: ${cropData[f.previous]?.label||f.previous}. Repeated cropping raises pest/disease pressure; peas and beans help fertility.</small></div>`).join('');
    $('opsFields').querySelectorAll('[data-field-crop]').forEach(s=>s.onchange=e=>{const f=o.fields[Number(e.target.dataset.fieldCrop)];f.previous=f.crop;f.crop=e.target.value;syncCropTotals()});
    $('opsFields').querySelectorAll('[data-fallow]').forEach(b=>b.onclick=()=>{const f=o.fields[Number(b.dataset.fallow)];f.fallow=f.fallow?0:1;syncCropTotals()});
    $('syncFieldsFromPlan')?.addEventListener('click',rebuildFieldsFromPlan,{once:true});
  }

  wait();
})();