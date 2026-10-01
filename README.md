# Georgia Sun

## Play & related projects

- **Georgia Sun web app:** https://dereksparks1982.github.io/georgiasun/index.html
- **Federal Electric web app:** https://dereksparks1982.github.io/federalelectric/index.html

> **Proprietary software — All Rights Reserved.** This repository is public for access to the hosted web app and source visibility only. No open-source license is granted. Commercial use, redistribution, modification, derivative works, sublicensing, or reuse of the source or project materials is not authorized except for the limited platform-level rights required by GitHub's Terms of Service. See [`LICENSE`](LICENSE).

Georgia Sun is a browser-based historical economic, estate, community, and life simulation set in a fictional 19th-century Georgia county.

## Current prototype — v0.7-dev

Georgia Sun is intentionally **menu-driven**, not a city builder. The player is meant to live inside the county economy over a long save, making financial, agricultural, social, industrial, gambling, and political choices while the surrounding world develops independently.

### Time

- 4 turns per month: Early, Mid, Late, Month End
- 48 turns per year
- designed for long sessions and slow character aging

### Current systems

- cash, debt, estate value, revenue, expenses, and month-end ledger
- fluctuating seed and commodity prices
- imperfect almanac-style forecasts and merchant gossip
- heat, drought, wet periods, and ideal seasons
- finite estate expansion with a current 10,000-acre single-estate ceiling
- land divided into cultivated fields, woodland, pasture, wetland/low ground, orchard/garden, and infrastructure
- multiple competing uses inside pasture, woodland, wetland, and orchard/garden acreage
- cultivated acreage shared across all crops
- cotton, sugar cane, corn, rice, wheat, oats, barley, rye, potatoes, sweet potatoes, field peas, beans, strawberries, and melons
- operating stores for meat, flour, grain, vegetables, fruit, salt, animal feed, hay, and household goods
- consumption, spoilage, internal production, shortages, and premium emergency market purchases
- detailed operating costs for clothing, shoes, tools, hardware, wagon repair, tack, seed reserve, medical/veterinary expense, fuel, building/mill upkeep, freight, merchant commissions, taxes, interest, and specialists
- named field management blocks with fertility, moisture, erosion, previous crop, pests, disease, fallow periods, and crop rotation
- peas/beans as soil-improving crops and fallow recovery
- livestock lifecycle simulation for cattle, goats, sheep, pigs, and chickens
- livestock health, age, births, deaths, carrying pressure, milk, eggs, wool, hides, feed and hay demand
- recurring estate maintenance and provisioning pressure
- solvency states from Healthy through Default
- estate-backed borrowing, leverage limits, sustained-arrears foreclosure, and play continuing after property loss
- sugar production
- timber and sawmill system with woodland depletion
- apiary with honey and beeswax production
- gristmill and bakery production chains
- shipping missions from Savannah
- labor, food, health, injury, trust, fear, resentment, and unrest variables
- separate public reputation with planters, merchants, officials, and townspeople
- generated newspaper every turn with county news, business, society, agriculture, markets, and archive
- persistent regional horse-racing circuit
- four Quick Races per turn followed by one unlocked Main Event
- dynamic horse form, age, fitness, fatigue, confidence, injury, career records, and changing odds
- Win / Place / Show wagering
- hardened four-player AI Texas Hold'em table with rotating blinds and real betting order
- proper check/call/fold/raise/all-in actions
- raises reopen action correctly
- main pots and side pots based on actual player contributions
- stack-aware opponents with distinct aggression, bluff and patience profiles
- persistent opponent memory and career records
- player poker history, wins/losses, biggest pot, buy-ins, cash-outs and raise-frequency tracking
- **Buy In With All Cash** option, allowing the player to risk the estate's entire current liquid cash balance
- poker losses remain part of the same estate economy rather than isolated minigame currency
- poker card faces display `10` rather than programmer shorthand `T`
- chess, checkers, and backgammon side activities
- random private events and decision popups
- responsive desktop/mobile interface

## Design documentation

- [`docs/ESTATE_ECONOMY.md`](docs/ESTATE_ECONOMY.md) — land, provisions, livestock, liquidity, debt, foreclosure, and crop opportunity cost
- [`docs/OPERATING_ESTATE.md`](docs/OPERATING_ESTATE.md) — operating stores, detailed expenses, livestock cycles, field condition, rotation, and soil pressure
- [`docs/HORSE_RACING.md`](docs/HORSE_RACING.md) — persistent racing circuit, race limits, horse development, and odds
- [`docs/POKER.md`](docs/POKER.md) — table rules, all-ins, side pots, persistent opponents, player statistics, and financial risk
- [`ROADMAP.md`](ROADMAP.md) — remaining build slices

## Run locally

Open `index.html` in a modern browser. No build step or backend is required.

## GitHub Pages

**Live app:** https://dereksparks1982.github.io/georgiasun/index.html

GitHub Pages configuration:

- Branch: `main`
- Folder: `/ (root)`

## Third-party notices

See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). The poker development pass reviewed the MIT-licensed `dnevins/poker` project as a technical reference; Georgia Sun's current poker implementation is project-specific code.

## License

Copyright © 2026 Derek Sparks. All rights reserved. Georgia Sun is proprietary software and is **not open source**. See [`LICENSE`](LICENSE) for the full terms.
