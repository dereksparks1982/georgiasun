# Georgia Sun Roadmap

This roadmap separates systems that are already playable from systems that are planned. The design target is a long-form menu simulation where a single save can plausibly last hundreds of turns and many real-world hours.

## Live in v0.4-dev

- 4 turns per month / 48 turns per year
- cash, debt, estate value, revenue, expenses, ledger
- seed and commodity price movement
- imperfect forecasts, merchant gossip, heat, drought, wet, and ideal weather outcomes
- cotton, sugar cane, corn, and rice acreage allocation
- sugar works
- timber cutting and sawmill production
- apiary, honey, and beeswax
- gristmill and bakery production chains
- Savannah shipping missions
- separate reputation with planters, merchants, officials, and townspeople
- enslaved-community trust, fear, resentment, health, food, and unrest variables
- generated newspaper every turn with archive
- chess, checkers, and backgammon side activities
- estate improvements and equipment condition
- random decisions and private events

### Persistent horse-racing circuit

The racing system now treats horses as recurring animals rather than disposable random entries.

Current rules and systems:

- regional roster of persistent named horses
- four Quick Races maximum per game turn
- Main Event remains locked until all four Quick Races have been completed
- one Main Event maximum per turn
- allowances reset when the player advances the game turn
- Quick Race approximately 30 seconds
- Main Event approximately 60 seconds
- six horses per field
- Win / Place / Show wagering
- separate Quick Race and Main Event betting caps
- persistent age
- permanent base traits for speed, stamina, consistency, late kick, starting ability, preferred surface and preferred distance
- fitness, fatigue, confidence, health and injury state
- recent form and career record
- wins, places, shows, starts and earnings
- young-horse development, prime years and age-related decline
- post-race fatigue and fitness loss
- recovery between game turns
- minor injury risk, recovery and temporary performance penalties
- dynamic field selection from healthy / available horses
- Main Event field weighted toward stronger and in-form horses
- dynamic odds recalculated for each field from ability, recent form, fitness, fatigue, confidence, surface, distance and market noise
- implied probability displayed with the odds
- odds and visible condition change as horses race and their careers develop
- race-engine effects for late kick, stamina, surface preference, distance preference, bursts and stumbles
- session betting history

See `docs/HORSE_RACING.md` for the full design specification.

## In development — v0.4

### AI poker table

Current development build includes a first playable Texas Hold'em table inside Leisure & Society:

- estate-funded buy-in
- player plus three county AI opponents
- blinds
- preflop / flop / turn / river
- fold / check-call / raise
- AI personalities and aggression
- seven-card hand evaluation
- showdown and prototype split-pot handling
- cash-out back into estate funds

Next poker work:

- harden betting-round logic so raises can reopen action correctly
- side pots and proper all-in behavior
- persistent named opponents with memory and relationships
- tells, bluff tendencies and player notes
- AI difficulty tiers
- table stakes by venue
- private games and invitations
- gambling debts and creditor pressure
- hand history and long-term poker statistics
- social consequences for winning, cheating accusations, drunken play or unpaid debts

The development pass reviewed `dnevins/poker` as an MIT-licensed technical reference. See `THIRD_PARTY_NOTICES.md`.

## Next build priorities

### Full Georgia agriculture catalog

Move crops into data-driven categories so the game can support a much broader historically plausible catalog without hardcoding every plant.

Planned categories:

- field crops
- grains
- vegetables
- berries and small fruit
- orchard crops
- nuts
- herbs
- medicinal plants
- wetland crops and useful marsh plants
- specialty / imported crops

Specific requested additions include strawberries and marsh-mallow (`Althaea officinalis`) for historical confectionery production.

Each crop should eventually track:

- planting window
- harvest window
- soil preference
- water demand
- heat tolerance
- frost sensitivity
- labor requirement
- seed cost
- storage life
- pests and disease
- processing uses
- local and export prices

### Deeper production chains

- expanded grain milling
- commercial bakery
- confectionery and historical marshmallow production
- preserves
- orchard processing
- expanded lumber grades and timber contracts
- tavern / inn supply chains
- distilling where historically appropriate to the selected year and location
- candles and other beeswax uses

### Broker and investments

- named brokers
- delayed orders
- broker fees
- railroad bonds
- bank shares
- canal / infrastructure debt where appropriate
- shipping-company investments
- coupon payments and dividends
- defaults and bank failures
- newspaper rumors and incomplete financial information

### Associations & societies

Do not use generic "guild" terminology unless a specific historical organization actually used it.

Planned organization types:

- agricultural societies
- merchant associations
- railroad interests
- political clubs
- fraternal organizations
- church networks
- banking circles
- trade organizations

Players should be able to join, form, fund, lead, oppose, split, boycott, negotiate with, or economically compete against organizations.

### Local government and politics

- county meetings / court sessions appropriate to the place and year
- road and bridge petitions
- taxes and assessments
- elections
- appointments
- public works
- militia matters where historically appropriate
- school and courthouse funding
- lobbying and political donations
- favors and grudges
- reputation by constituency rather than one universal political score

### Living towns

Towns should not be permanent scenery. Their economies should change.

Planned systems:

- population growth and decline
- major employers
- railroad depots
- freight access
- mills and warehouses
- fairs and race grounds
- hotel / tavern demand
- business openings and closures
- infrastructure loss
- rival towns
- ghost-town outcomes when trade routes or major employers disappear

### Newspaper expansion

Current newspapers are generated each turn. Planned depth:

- persistent named newspaper editors
- political bias and editorial positions
- advertisements that create opportunities
- land-for-sale notices
- deaths and marriages
- court notices
- shipping arrivals
- business failures
- election endorsements
- contradictory reporting
- delayed national and foreign news
- selectable archived issues
- race previews, tips, scratches and Main Event coverage tied to the persistent racing roster

### Character and memory system

- named player character
- slow aging
- spouse and family
- inheritance
- children
- neighboring families
- merchants
- bankers
- officials
- newspaper editors
- hired workers
- enslaved families
- individual memories of important events
- relationship histories
- feuds
- favors owed
- scandal
- marriage prospects

### Reputation and power

Expand current separate reputation values into a deeper network.

Public groups:

- planters
- merchants
- bankers
- county officials
- ordinary townspeople
- churches
- associations and societies

Estate community variables:

- trust
- fear
- resentment
- family stability
- health
- hope
- perceived opportunity to escape
- knowledge of escape routes and contacts
- resistance pressure

Important outcomes should emerge from several variables rather than one morality or rebellion meter.

### Leisure, gambling, and wealth destruction

Already live: persistent progress-bar horse racing, Win / Place / Show wagers, four-race preliminaries leading to one Main Event, chess, checkers, backgammon, and a first AI poker build.

Roadmapped racing depth:

- Exacta
- Quinella
- Daily Double
- richer odds market and public betting movement
- newspaper handicapping and rumors
- scratches before post time
- named owners and trainers
- player-owned racehorses
- buying and selling horses
- breeding and pedigrees
- training schedules
- jockey contracts
- purse money and entry fees
- race classes and eligibility
- veterinarian costs
- serious injuries and retirement
- seasonal race calendar
- stable reputation

Roadmapped leisure depth:

- deeper poker AI
- dice and period card games
- chess, checkers, and backgammon skill growth
- private clubs
- fairs
- hunting
- dinners and parties
- drinking
- luxury purchases
- carriages
- imported furniture and clothing
- gambling debts
- scandals

A prosperous player should be fully capable of squandering a fortune.

### Long-term economy

- merchants with personalities and liquidity
- haggling
- repeat-customer relationships
- contracts
- credit terms
- property taxes
- insurance
- mortgages
- foreclosures
- land auctions
- crop gluts and shortages
- regional price differences
- transportation costs
- railroad freight contracts
- infrastructure disruptions
- broader regional economic cycles

## Later

- save / load and multiple named saves
- cloud saves if a backend is added
- deeper historical event timeline
- wars and major national disruptions
- more ports and shipping routes
- insurance markets
- legal disputes and lawsuits
- newspapers from rival towns
- dynamic county map as data only, without turning Georgia Sun into a city builder
- long-run statistics and family history screen

## Design rules

1. Georgia Sun remains primarily a **menu game**.
2. Time should move slowly enough that a player can spend 100+ hours with one character.
3. Important outcomes should usually come from multiple interacting systems.
4. The world continues to change outside the player's estate.
5. Information can be incomplete, delayed, biased, or wrong.
6. Wealth should create opportunities but also new ways to lose money.
7. Reputation is audience-specific.
8. Historical terminology should match the place, year, and institution rather than using modern catch-all labels.
9. Long saves should generate memorable personal history, not merely bigger numbers.
10. Recurring simulation entities should persist and develop over time rather than being regenerated without history.
