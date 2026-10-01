# Georgia Sun Roadmap

Georgia Sun is being built by consuming this roadmap one slice at a time. Systems that become playable move out of the roadmap and into the live-build documentation.

## Live now — v0.5-dev

### Core simulation
- 4 turns per month / 48 turns per year
- cash, debt, estate value, revenue, expenses, ledger
- imperfect forecasts and merchant gossip
- heat, drought, wet and ideal weather outcomes
- shipping missions from Savannah
- generated newspaper every turn with archive
- separate public reputation groups
- labor, health, food, injury, trust, fear, resentment and unrest variables
- random decisions and private events

### Agriculture and estate land
- finite single-estate ceiling of 10,000 acres
- progressively more expensive 100-acre acquisitions
- cultivated fields, woodland, pasture, wetland/low ground, orchard/garden and infrastructure
- divisible acreage inside each land category
- competing pasture uses for cattle, goats, sheep, hay and apiary forage
- competing woodland uses for timber, firewood, hunting, apiary forage and reserve
- competing wetland uses for rice/water support, marsh plants, seasonal grazing and reserve
- orchard/garden uses for fruit, berries, kitchen garden, herbs and apiary sites
- cultivated acreage shared across the crop catalog
- cotton, sugar cane, corn, rice, wheat, oats, barley, rye, potatoes, sweet potatoes, field peas, beans, strawberries and melons
- livestock purchases for cattle, goats, sheep, pigs and chickens
- recurring provisioning burden
- internally produced food reducing cash purchases
- animal-feed pressure
- maintenance/tax/livestock overhead
- solvency states
- estate-backed borrowing
- leverage limits
- arrears tracking
- foreclosure at sustained extreme leverage
- game continuation after estate loss

See `docs/ESTATE_ECONOMY.md`.

### Industry
- sugar works
- timber and sawmill production
- apiary, honey and beeswax
- gristmill
- bakery

### Horse racing
- persistent regional horse roster
- four Quick Races per turn
- Main Event unlocked only after four Quick Races
- one Main Event per turn
- changing form, age, fitness, fatigue, confidence and health
- injuries and recovery
- dynamic odds and implied probability
- surface and distance preferences
- Win / Place / Show betting
- race history

See `docs/HORSE_RACING.md`.

### Poker and leisure
- playable AI Texas Hold'em prototype
- three county AI opponents
- estate-funded buy-ins
- blinds, flop, turn and river
- fold, check/call and raise
- hand evaluation and showdown
- chess, checkers and backgammon side activities

## Next build slice — operating estate depth

The current estate economy works, but several costs are still aggregated. The next slice should make the financial machine more visible and more dangerous.

### Detailed operating ledger
- purchased food by category
- salt
- clothing and cloth
- shoes
- tools
- nails and hardware
- wagon maintenance
- harness and tack
- seed purchases
- medical expense
- veterinary expense
- fuel / firewood
- building maintenance
- mill maintenance
- spoilage and storage loss
- freight charges
- merchant commissions
- taxes and assessments
- interest expense
- hired specialists
- emergency purchases

### Provision inventories
- meat
- flour
- grain
- vegetables
- fruit
- salt
- animal feed
- hay
- household goods
- consumption by turn
- spoilage
- emergency market purchases
- ration quality interacting with health and unrest

### Livestock depth
- breeding
- births
- age
- death
- illness
- milk
- eggs
- meat
- wool
- hides
- draft animals
- carrying capacity
- winter feed
- market sales
- veterinary care

### Field condition
- named or numbered fields
- fertility
- soil moisture
- erosion
- previous crop
- fallow periods
- crop rotation
- pest pressure
- disease pressure
- soil-improving crops
- drainage

## Poker hardening slice

- proper reopened betting after raises
- proper all-in behavior
- side pots
- stack-aware AI
- stronger bluff and value-bet logic
- persistent named opponents
- opponent memory
- tells and tendencies
- private games
- table stakes by venue
- gambling debts
- creditor pressure
- hand history
- long-term statistics
- social consequences

The long-term rule remains that the game does not protect the player from financial recklessness. If enough credit and a sufficiently wealthy table exist, the player should be capable of gambling away a fortune.

## Agriculture expansion slice

The crop system is now broader but still only the beginning.

### Additional crop database
- vegetables
- berries and small fruit
- orchard crops
- nuts
- herbs
- medicinal plants
- wetland plants
- specialty / imported crops
- marsh-mallow (`Althaea officinalis`)

### Crop data still needed
- planting window
- harvest window
- time to maturity
- soil preference
- drainage requirement
- water demand
- drought tolerance
- heat tolerance
- frost sensitivity
- labor requirement
- seed / propagation cost
- storage life
- spoilage
- pests
- disease
- processing uses
- food value
- feed value
- soil effects
- local price
- export price

## Production-chain slice

- expanded grain milling
- commercial bakery
- preserves
- orchard processing
- confectionery
- historical marshmallow production
- beeswax candles
- expanded lumber grades
- timber contracts
- tavern / inn supply chains
- distilling where historically appropriate
- livestock processing
- leather / hides where appropriate

## Finance and investment slice

- named bankers and brokers
- delayed orders
- broker fees
- railroad bonds
- bank shares
- infrastructure debt where appropriate
- shipping-company investments
- coupon payments
- dividends
- defaults
- bank failures
- mortgages with named creditors
- refinancing
- foreclosures and auctions
- insurance
- merchant credit
- crop liens / advances where historically appropriate
- rumors and incomplete financial information

## Living county slice

### People and businesses
- persistent merchants
- bankers
- newspaper editors
- officials
- neighboring landowners
- innkeepers
- physicians
- lawyers
- craftsmen
- trainers and jockeys
- businesses opening and closing
- liquidity and bankruptcy for NPC businesses

### Town development
- population growth and decline
- major employers
- mills
- warehouses
- hotels / taverns
- fairs
- race grounds
- roads
- bridges
- railroad depots
- freight access
- rival towns
- ghost-town outcomes

## Associations and societies slice

Use historically appropriate names rather than generic "guild" terminology.

- agricultural societies
- merchant associations
- railroad interests
- political clubs
- fraternal organizations
- church networks
- banking circles
- trade organizations

Player actions:
- join
- form
- fund
- lead
- oppose
- split
- boycott
- negotiate
- compete economically

## Local government and politics slice

- county meetings / court sessions appropriate to place and year
- roads and bridge petitions
- taxes and assessments
- elections
- appointments
- public works
- militia matters where historically appropriate
- school and courthouse funding
- lobbying
- donations
- favors
- grudges
- constituency-specific reputation

## Newspaper expansion slice

- persistent editor
- editorial positions
- advertisements
- land-for-sale notices
- deaths
- marriages
- court notices
- shipping arrivals
- business failures
- race previews
- race tips and rumors
- scratches
- election coverage
- contradictory reporting
- delayed national news
- delayed foreign news
- selectable archived issues

## Character and memory slice

- named player character
- slow aging
- spouse and family
- inheritance
- children
- neighboring families
- hired workers
- enslaved families
- individual memories
- relationship histories
- favors owed
- feuds
- scandal
- marriage prospects

## Horse ownership slice

- named owners and trainers
- buying and selling horses
- player-owned stable
- breeding
- pedigrees
- training schedules
- jockey contracts
- entry fees
- purses
- race classes
- eligibility
- serious injuries
- retirement
- seasonal race calendar
- stable reputation
- Exacta
- Quinella
- Daily Double
- public betting movement
- bookmaker liquidity

## Historical pressure and long timeline

The outside world should increasingly interfere with estate plans rather than appearing only as scripted flavor text.

- regional commodity cycles
- banking panics
- transportation change
- railroad expansion
- legal change
- taxes
- elections
- sectional conflict
- trade disruption
- shortages
- inflation
- military mobilization
- conscription pressure where applicable
- requisition
- property destruction
- labor disruption
- Civil War
- postwar legal change
- postwar labor change
- postwar credit and land restructuring

The Civil War era should alter prices, labor, transportation, credit, law, politics and risk across the simulation.

## Later technical systems

- save / load
- multiple named saves
- cloud saves if a backend is added
- long-run statistics
- family history screen
- more ports
- regional price differences
- dynamic county data view without turning the game into a city builder

## Design rules

1. Georgia Sun remains primarily a menu game.
2. Time moves slowly enough for 100+ hours with one character.
3. Every acre has an opportunity cost.
4. The player cannot plant or own everything simply by expanding forever.
5. Assets, income and cash are different things.
6. Running a large estate should require continuous money, labor, food, maintenance and judgment.
7. Important outcomes come from interacting systems rather than one hidden morality or success score.
8. The world changes outside the player's property.
9. Information can be incomplete, delayed, biased or wrong.
10. The game does not protect the player from bad financial decisions.
11. Wealth creates new opportunities and new ways to fail.
12. Reputation is audience-specific.
13. Historical terminology should fit the time and place.
14. Persistent entities should accumulate history rather than constantly respawning without memory.
15. Economic failure should alter the player's life rather than automatically ending the save.
