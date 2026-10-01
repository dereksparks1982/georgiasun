# Georgia Sun Roadmap

Georgia Sun is being built by consuming this roadmap one slice at a time. When a system becomes playable, it moves out of the wish list and into the live-build documentation.

## Live now — v0.6-dev

### Core simulation
- 4 turns per month / 48 turns per year
- cash, debt, estate value, revenue, expenses, ledger
- imperfect forecasts and merchant gossip
- weather outcomes
- shipping missions from Savannah
- generated newspaper every turn with archive
- separate reputation groups
- labor, health, food, injury, trust, fear, resentment and unrest
- random decisions and private events

### Land, agriculture and estate economy
- finite 10,000-acre single-estate ceiling
- progressively more expensive land acquisition
- cultivated, woodland, pasture, wetland, orchard/garden and infrastructure acreage
- multiple competing uses inside each land class
- shared cultivated acreage across the crop catalog
- fourteen playable crops
- livestock purchases
- estate-backed borrowing, leverage, arrears and foreclosure
- play continues after estate loss

### Operating estate depth
- consumable stores for meat, flour, grain, vegetables, fruit, salt, feed, hay and household goods
- turn-by-turn consumption
- internal production offsets
- spoilage
- emergency market purchases at a premium
- shortage effects on food, health and unrest
- detailed recurring operating ledger
- clothing and cloth
- shoes
- tools
- nails and hardware
- wagon repair
- harness and tack
- seed reserve
- medical expense
- veterinary expense
- fuel / firewood
- building maintenance
- mill maintenance
- freight
- merchant commissions
- taxes and assessments
- interest expense
- hired specialists
- named field management blocks
- fertility
- soil moisture
- erosion
- previous crop
- fallow periods
- rotation
- pest pressure
- disease pressure
- soil-improving peas and beans
- livestock age, health, births and deaths
- carrying pressure
- milk, eggs, wool and hides
- feed and hay demand

See `docs/ESTATE_ECONOMY.md` and `docs/OPERATING_ESTATE.md`.

### Industry
- sugar works
- timber and sawmill
- apiary, honey and beeswax
- gristmill
- bakery

### Horse racing
- persistent regional horse roster
- four Quick Races per turn
- Main Event unlocked after four Quick Races
- one Main Event per turn
- form, age, fitness, fatigue, confidence, health and injury
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
- chess, checkers and backgammon

## Next build slice — poker hardening

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

The game will not protect the player from reckless gambling. If credit and a sufficiently wealthy table exist, the player should be capable of losing a fortune.

## Agriculture expansion slice

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
- deaths and marriages
- court notices
- shipping arrivals
- business failures
- race previews, tips, rumors and scratches
- election coverage
- contradictory reporting
- delayed national and foreign news
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
- breeding and pedigrees
- training schedules
- jockey contracts
- entry fees and purses
- race classes and eligibility
- serious injuries and retirement
- seasonal race calendar
- stable reputation
- Exacta, Quinella and Daily Double
- public betting movement
- bookmaker liquidity

## Historical pressure and long timeline

The outside world should increasingly interfere with estate plans rather than appearing only as flavor text.

- regional commodity cycles
- banking panics
- transportation change
- railroad expansion
- legal change
- taxes and elections
- sectional conflict
- trade disruption
- shortages and inflation
- military mobilization
- conscription pressure where applicable
- requisition
- property destruction
- labor disruption
- Civil War
- postwar legal and labor change
- postwar credit and land restructuring

## Later technical systems

- save / load
- multiple named saves
- cloud saves if a backend is added
- long-run statistics
- family history screen
- more ports
- regional price differences
- dynamic county data view without becoming a city builder

## Design rules

1. Georgia Sun remains primarily a menu game.
2. Time moves slowly enough for 100+ hours with one character.
3. Every acre has an opportunity cost.
4. The player cannot plant or own everything simply by expanding forever.
5. Assets, income and cash are different things.
6. Running a large estate requires continuous money, labor, food, maintenance and judgment.
7. Important outcomes come from interacting systems rather than one hidden success score.
8. The world changes outside the player's property.
9. Information can be incomplete, delayed, biased or wrong.
10. The game does not protect the player from bad financial decisions.
11. Wealth creates new opportunities and new ways to fail.
12. Reputation is audience-specific.
13. Historical terminology should fit the time and place.
14. Persistent entities accumulate history rather than respawning without memory.
15. Economic failure alters the player's life rather than automatically ending the save.
