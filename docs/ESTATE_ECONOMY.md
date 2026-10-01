# Georgia Sun Estate Economy

This document defines the economic direction for Georgia Sun's estate simulation. The central rule is simple:

> Wealth is not income, and income is not liquidity.

A player can own valuable land, buildings, crops, livestock and vessels while still being unable to meet current expenses. Georgia Sun should make the player actively manage cash, land, food production, debt, risk and opportunity costs rather than treating a plantation or large estate as a passive money generator.

## Current build

The v0.5 estate-economy slice introduces the following playable systems:

- finite estate expansion with a current single-estate ceiling of 10,000 acres
- progressively more expensive 100-acre land purchases
- land divided into cultivated fields, woodland, pasture, wetland/low ground, orchard/garden and infrastructure
- multiple simultaneous uses inside pasture, woodland, wetland and orchard/garden categories
- cultivated acreage shared across all crops
- expanded playable crop list
- livestock purchases and recurring livestock burden
- estate provisions model
- internally produced food reducing purchased-food requirements
- animal feed pressure
- recurring maintenance/tax/livestock overhead
- estate solvency status
- estate-backed borrowing
- leverage limits
- month-end arrears tracking
- foreclosure after sustained arrears at extreme leverage
- game continuation after foreclosure rather than a forced Game Over

The values in the current provisions model are gameplay-tunable prototype values. They are not presented as a universal historical accounting table for every plantation or every year.

## Land model

The starting estate remains approximately 900 acres. The initial categories are:

| Category | Starting acres |
| --- | ---: |
| Cultivated | 520 |
| Woodland | 260 |
| Pasture | 70 |
| Wetland / low ground | 30 |
| Orchard / garden | 10 |
| Roads, yards, buildings and other infrastructure | 10 |
| **Total** | **900** |

The purpose of these categories is to stop acreage from behaving like one universal resource. A 900-acre estate does not mean 900 acres can be planted with arbitrary crops.

### Cultivated fields

Cultivated acreage is shared by all field and garden crops placed on the Planting screen. The player cannot plant every available crop at meaningful scale unless enough cultivated land exists.

The player therefore has to choose among cash crops, food crops, grains, specialty crops and soil-management needs.

### Pasture

Pasture can be divided among:

- cattle pasture
- goat browse
- sheep pasture
- hay meadow
- apiary forage

These uses compete with each other. Increasing one use can require reducing another.

### Woodland

Woodland can be divided among:

- managed timber
- firewood
- hunting reserve
- apiary forage
- uncut reserve

Future work will make these allocations affect timber growth, wildlife, fuel supply, erosion, forage and long-term property value.

### Wetland / low ground

Wetland can be divided among:

- rice / water support
- useful marsh plants
- seasonal grazing
- natural reserve

Future work will add drainage, flood risk, water control, malaria/illness pressure where historically appropriate, marsh-mallow, wetland conversion costs and ecological tradeoffs.

### Orchard and garden

Orchard/garden acreage can be divided among:

- fruit trees
- berries
- kitchen garden
- herbs / medicinal plants
- apiary sites

Future orchards will be persistent multi-year plantings rather than annual sliders.

## Estate-size limit

The current single-estate ceiling is **10,000 acres**.

This is primarily a simulation-design ceiling, not a claim that no historical landowner could exceed it. It prevents the optimal strategy from becoming unlimited expansion followed by planting everything.

Future expansion beyond the main-estate limit should require separate systems such as:

- a second property
- another county
- inheritance
- partnership
- a separately managed estate
- exceptional land transactions

Separate properties should carry their own travel, management, labor, security, transportation, tax and information costs.

## Land prices

Land is not an infinite store with a fixed price.

The prototype begins around $2,000 for the next 100-acre parcel, then applies a rising acquisition curve as the estate grows. Future versions should replace the simple curve with actual named parcels and owners so that:

- desirable river land may be expensive
- neighbors may refuse to sell
- distressed owners may sell cheaply
- auctions may create opportunities
- rumors can move prices
- railroads and roads can change land values
- rival buyers can acquire parcels first

## Expanded crop catalog

The current build adds playable allocations for:

- wheat
- oats
- barley
- rye
- potatoes
- sweet potatoes
- field peas
- beans
- strawberries
- melons

These join cotton, sugar cane, corn and rice.

Every crop draws from the same finite cultivated acreage. New crops begin at zero acres, so existing estate plans are not silently rewritten.

The long-term crop database should track:

- planting window
- harvest window
- time to maturity
- soil preference
- drainage requirement
- water demand
- drought tolerance
- heat tolerance
- frost sensitivity
- labor demand
- seed or propagation cost
- storage life
- spoilage
- pest pressure
- disease pressure
- soil depletion or improvement
- processing uses
- food value
- feed value
- local price
- export price
- transportation sensitivity

## Crop choice and opportunity cost

The crop catalog exists to force decisions, not to let the player collect every crop.

A successful player should routinely face choices such as:

- plant more cotton for cash or corn for provisions
- use scarce good ground for strawberries or staple grain
- devote acreage to animal feed instead of a market crop
- leave land fallow or rotate into a soil-improving crop
- grow food internally or gamble on buying it cheaply later
- choose a crop because weather favors it even when the current market does not

The ideal system creates years where a previously unimportant crop suddenly becomes valuable because of weather, war, transport disruption, disease, shortages or neighboring planting decisions.

## Provisions

The estate now carries a recurring provisioning burden.

The model accounts for:

- people supplied
- food requirements
- food produced internally
- food purchases
- clothing and tool burden
- salt and medicine burden
- animal feed requirements
- hay and stored-grain feed offsets

The current build calculates a per-turn provisioning cost and adds it directly to estate expenses.

### Self-sufficiency

Food stored or produced on the estate reduces cash purchases. This gives staple crops a strategic role even when their market price is weaker than a cash crop.

A player who devotes nearly all cultivated acreage to export crops can make more money in a good year but becomes more exposed to food prices and shortages.

A player who grows more food sacrifices some cash-crop opportunity but gains resilience.

Neither strategy should be universally correct.

## Livestock

Current purchasable livestock:

- cattle
- goats
- sheep
- pigs
- chickens

Livestock adds recurring feed and overhead costs. Future livestock systems should add:

- breeding
- births
- age
- death
- disease
- milk
- eggs
- meat
- wool
- hides
- draft animals
- pasture carrying capacity
- winter feed
- market sales
- theft
- veterinary care
- pedigree and quality

Apiaries are treated differently from ordinary livestock because their physical footprint and their forage requirement are not the same thing. Future versions should model a small apiary site plus surrounding forage quality.

## Operating expenses

The long-term estate ledger should eventually include separate lines for:

- purchased food
- salt
- coffee and imported household goods
- clothing and cloth
- shoes
- tools
- nails and hardware
- wagon maintenance
- harness and tack
- seed
- fertilizer and soil amendments
- drainage and irrigation work
- medical care
- veterinary care
- firewood and fuel
- building maintenance
- mill maintenance
- storage losses
- spoilage
- freight
- merchant commissions
- taxes and assessments
- interest
- insurance where available
- hired specialists
- managers / overseers where used
- lawyers and court costs
- political/social obligations
- emergency purchases

The current v0.5 model aggregates several of these expenses into prototype provisioning and estate-overhead calculations. Later slices should break them into visible ledger categories.

## Liquidity and solvency

The player now receives a solvency status based on cash, recurring burn and leverage.

Current statuses:

1. Healthy
2. Tight
3. Strained
4. Overleveraged
5. Distressed
6. Default

A valuable estate can still be distressed if current cash is insufficient.

## Estate-backed borrowing

The Ledger now permits borrowing $5,000 against estate assets.

The prototype lender ceiling is based on a percentage of estate value. The purpose is to let players turn illiquid wealth into cash while creating genuine leverage risk.

That cash is normal cash. The game does not protect the player from spending it badly.

A player can therefore borrow against the estate and then lose the money through poor investments, failed crops, operating losses or gambling.

Poker buy-ins are already funded directly from estate cash. A player who converts estate equity into cash can choose to risk that cash at the table.

## Foreclosure

The current build introduces a severe failure state.

If the estate remains in arrears for repeated month ends while debt exceeds an extreme share of estate value, creditors can foreclose.

Current prototype consequence:

- estate land seized
- buildings seized
- inventories liquidated
- livestock lost
- vessels lost
- active shipping missions ended
- debt cleared through liquidation
- player left with a small cash remainder
- game continues

This is intentionally harsh. Georgia Sun should allow the player to destroy a fortune.

Future versions should make foreclosure more granular by allowing:

- emergency crop sales
- livestock sales
- vessel sales
- mortgage restructuring
- partial land sales
- auctions
- creditor negotiation
- family loans
- merchant credit
- bankruptcy-like settlements appropriate to the period
- tenancy or wage work after estate loss
- rebuilding from a smaller economic position

## Gambling and estate risk

Gambling should not be protected by arbitrary low limits simply to keep the estate safe.

Limits should eventually arise from believable counterparties:

- table stakes
- bookmaker liquidity
- private-game wealth
- creditworthiness
- reputation
- local law and enforcement

A player should be able to wager dangerously large amounts if a game and bankroll make that possible.

The AI should not guarantee recovery. Losing the estate through reckless gambling must remain possible.

## Historical pressure over time

The estate economy should become harder to manage as the outside world changes.

Long-term systems will include:

- banking disruptions
- commodity cycles
- transportation changes
- railroad expansion
- changing taxes and laws
- elections and local factional politics
- sectional conflict
- trade disruption
- shortages
- inflation
- military mobilization
- conscription pressures where applicable
- wartime requisition
- property damage
- labor disruption
- postwar legal and economic upheaval

The Civil War era should not be a single scripted popup. It should alter prices, labor, transportation, credit, politics, risk and daily estate management.

## Core design rules added by this build

1. Every acre has an opportunity cost.
2. Land categories are divisible into multiple uses.
3. The player cannot plant the whole crop catalog at meaningful scale.
4. Estate size does not equal cultivable acreage.
5. Production can reduce operating costs as well as generate revenue.
6. A large estate must consume substantial resources to remain functional.
7. Assets are not the same as cash.
8. Debt can convert assets into liquidity but can also destroy the estate.
9. The game does not protect the player from reckless financial decisions.
10. Economic failure changes the player's circumstances rather than automatically ending the save.
