# Georgia Sun

**Play the web app:** https://dereksparks1982.github.io/georgiasun/

> **Proprietary software — All Rights Reserved.** This repository is public for access to the hosted web app and source visibility only. No open-source license is granted. Commercial use, redistribution, modification, derivative works, sublicensing, or reuse of the source or project materials is not authorized except for the limited platform-level rights required by GitHub's Terms of Service. See [`LICENSE`](LICENSE).

Georgia Sun is a browser-based historical economic, estate, community, and life simulation set in a fictional 19th-century Georgia county.

## Current prototype — v0.4-dev

Georgia Sun is intentionally **menu-driven**, not a city builder. The player is meant to live inside the county economy over a long save, making financial, agricultural, social, industrial, gambling, and political choices while the surrounding world develops independently.

### Time

- 4 turns per month: Early, Mid, Late, Month End
- 48 turns per year
- designed for long sessions and slow character aging

### Current systems

- cash, debt, estate value, revenue, expenses, and month-end ledger
- fluctuating seed and commodity prices
- imperfect almanac-style forecasts and merchant gossip
- weather outcomes including heat, drought, wet periods, and ideal seasons
- cotton, sugar cane, corn, and rice acreage management
- sugar production
- timber and sawmill system with woodland depletion
- apiary with honey and beeswax production
- gristmill and bakery production chains
- shipping missions from Savannah
- labor, food, health, injury, trust, fear, resentment, and unrest variables
- separate public reputation with planters, merchants, officials, and townspeople
- generated newspaper every turn with county news, business, society, agriculture, markets, and archive
- **live horse racing** with Quick Race (~30 seconds) and Main Event (~60 seconds)
- six-horse progress-bar races
- win / place / show wagering
- odds, form history, jockeys, horse condition, track surface, race distance, late kicks, fatigue, stumbles, and betting history
- poker, chess, checkers, and backgammon side activities
- **v0.4-dev AI Texas Hold'em table** with a player buy-in, three county AI opponents, blinds, flop/turn/river progression, betting, folding, raising, hand evaluation, and cash-out back to the estate
- random private events and decision popups
- responsive desktop/mobile interface

## Run locally

Open `index.html` in a modern browser. No build step or backend is required.

## GitHub Pages

**Live app:** https://dereksparks1982.github.io/georgiasun/

GitHub Pages configuration:

- Branch: `main`
- Folder: `/ (root)`

## Roadmap

See [`ROADMAP.md`](ROADMAP.md) for implemented, next, and long-term systems.

## Third-party notices

See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). The poker development pass reviewed the MIT-licensed `dnevins/poker` project as a technical reference; Georgia Sun's current poker prototype is project-specific code.

## License

Copyright © 2026 Derek Sparks. All rights reserved. Georgia Sun is proprietary software and is **not open source**. See [`LICENSE`](LICENSE) for the full terms.
