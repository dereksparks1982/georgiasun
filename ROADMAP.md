# Georgia Sun Roadmap

Georgia Sun is being built by consuming this roadmap one slice at a time. When a system becomes playable, it moves out of the wish list and into the live-build documentation.

## Live now — v0.7-dev

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
- turn-by-turn consumption, internal production offsets, spoilage and emergency purchases
- shortage effects on food, health and unrest
- detailed recurring operating ledger
- named field management blocks
- fertility, soil moisture, erosion, previous crop, fallow, rotation, pests and disease
- soil-improving peas and beans
- livestock age, health, births, deaths, carrying pressure and products

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
- four-player AI Texas Hold'em table
- rotating dealer / small blind / big blind
- proper betting order by street
- fold, check/call, raise and all-in
- raises reopen action correctly
- contribution-based main and side pots
- stack-aware AI with distinct aggression, bluff and patience tendencies
- persistent named opponents
- opponent career memory
- player aggression tracking
- career hand history and statistics
- unrestricted buy-in up to current estate cash
- **Buy In With All Cash** option
- gambling losses tied directly to estate liquidity
- chess, checkers and backgammon

See `docs/POKER.md`.

## Next build slice — agriculture expansion

The crop system now has real acreage pressure and field condition, so the next slice should make crop choice substantially broader and more seasonal rather than simply adding more names.

### Additional crop database
- cabbage
- turnips
- carrots
- onions
- squash
- pumpkins
- cucumbers
- tomatoes where historically appropriate to the selected year/use
- okra
- collards / greens
- apples
- peaches
- pears
- plums
- grapes
- blackberries
- raspberries where locally appropriate
- pecans / other nuts where historically appropriate
- culinary herbs
- medicinal herbs
- wetland plants
- specialty / imported crops
- marsh-mallow (`Althaea officinalis`)

### Crop data model
Each crop should track as many of these as useful rather than relying on one generic yield number:

- planting window
- harvest window
- time to maturity
- suitable land classes
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
- pest vulnerability
- disease vulnerability
- processing uses
- food value
- feed value
- soil effects
- local price
- export price
- perennial vs annual behavior

### Seasonal decision pressure
- crops unavailable outside realistic planting windows
- missed planting windows matter
- multi-turn crops occupy acreage while growing
- harvest timing matters
- orchards require years to mature
- weather can make one crop attractive and another foolish
- acreage, labor, cash and storage jointly limit diversification
- player cannot simply plant one acre of everything with no operational consequence

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
- direct gambling credit / markers
- unpaid gambling debt
- creditor pressure tied to gambling losses

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

## Poker social-depth slice

The rules engine is now hardened. Remaining poker work should connect the table more deeply to county life rather than rebuilding basic poker mechanics.

- multiple venues with different stakes
- private games and invitations
- opponent relationships outside poker
- remembered showdowns and player notes
- tells and tilt
- drunken play
- cheating accusations
- social reputation effects
- richer adaptive AI
- period-appropriate alternate poker variants after historical research

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
