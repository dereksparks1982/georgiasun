# Georgia Sun — Operating Estate Systems

This document describes the v0.6-dev operating-estate slice. The goal is to make a large estate feel expensive, fragile, and management-heavy rather than automatically profitable because the player owns land.

## Core rule

Estate wealth, annual production, and liquid cash are separate things. A player can own valuable land and buildings while still being unable to cover food, repairs, debt service, seed, tools, freight, medical expense, or livestock costs.

## Operating stores

The estate now tracks consumable stores separately from the crop inventory:

- meat
- flour
- grain
- vegetables
- fruit
- salt
- animal feed
- hay
- household goods

Each turn these stores are consumed according to the number of people and livestock on the estate. Internal production replenishes some stores. When a store cannot cover demand, the estate makes an emergency market purchase at a premium and the extra charge is taken from cash.

Stores also spoil at different rates. Salt has effectively no routine spoilage while meat, vegetables, and fruit lose value faster.

Shortages can reduce food and health conditions and increase unrest even when emergency purchases prevent outright depletion.

## Detailed operating ledger

The estate now exposes additional recurring expenses instead of hiding everything inside one generic expense number. The current detail includes:

- cloth and clothing
- shoes
- tools
- nails and hardware
- wagon repair
- harness and tack
- seed reserve
- medical expense
- veterinary expense
- fuel and firewood
- building upkeep
- mill upkeep
- freight
- merchant commissions
- taxes and assessments
- interest expense
- hired specialists

These costs are charged each turn on top of the earlier prototype's baseline estate expenses. They are intentionally subject to later tuning as the economy becomes more historically and regionally specific.

## Livestock cycle

Cattle, goats, sheep, pigs, and chickens now have ongoing simulation state.

Tracked values include:

- head count
- average age
- health
- births
- deaths
- accumulated milk
- accumulated eggs
- wool
- hides

Herd health is affected by crowding relative to the land allocated to that stock. Birth and death calculations occur at month end. Older or unhealthy animals have more loss risk.

Livestock also interacts with operating stores. Hay and feed are consumed every turn. Pasture allocation and hay acreage therefore have economic consequences.

Future livestock slices will add individual quality, breeding stock, sale prices, slaughter decisions, draft-animal work, milk/egg sale or household allocation, disease outbreaks, and seasonal winter-feed planning.

## Field condition

Cultivated land is now represented by named management blocks. The initial 520 cultivated acres are divided into eight fields matching the starting crop plan.

Each field tracks:

- acreage
- current crop
- previous crop
- fertility
- moisture
- erosion
- pest pressure
- disease pressure
- fallow status

The player can change a field's crop or leave it fallow. Field assignments can update the aggregate crop acreage totals.

A utility button can rebuild field blocks from the current aggregate crop plan if the older Planting sliders have been used.

## Rotation and soil behavior

Repeated planting of the same crop raises pest and disease pressure. Cotton, cane, and corn are currently modeled as relatively demanding crops. Peas and beans provide a modest fertility benefit. Fallow land recovers fertility and reduces pest and disease pressure.

Weather affects field moisture and erosion. Wet periods increase erosion and disease risk; drought and heat reduce moisture.

These are gameplay systems rather than claims that every crop, soil, or historical plantation behaved identically. Later crop data will make field response more specific by crop, soil type, drainage, season, and geography.

## Financial danger

The operating-estate system is intentionally designed so that expansion increases both opportunity and burn rate.

A larger property can require more:

- maintenance
- hardware
- tools
- food purchases
- animal feed
- freight
- tax payments
- debt service
- emergency purchases

The player is not protected from combining these liabilities with gambling or excessive borrowing.

## Build direction

The next logical depth after this slice includes:

- crop planting and harvest calendars
- soil types and drainage
- crop-specific pests and diseases
- livestock sale and breeding markets
- winter feed planning
- named merchants and suppliers
- contracts and credit terms
- storage capacity and warehouse losses
- wage/specialist contracts
- more explicit month-end statements
- historical price and supply shocks

The design target remains a long-running simulation in which the player has to decide what deserves limited land, labor, food, time, and cash.