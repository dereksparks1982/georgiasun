# Georgia Sun Horse Racing System

Georgia Sun uses menu-based live horse races represented by progress bars rather than animated horses. The goal is to make racing feel like a persistent local sport and gambling circuit embedded in the county economy, not a disposable random minigame.

## Turn structure

Each game turn contains one race meeting:

1. Quick Race 1
2. Quick Race 2
3. Quick Race 3
4. Quick Race 4
5. Main Event unlocks
6. Main Event

Rules:

- maximum 4 Quick Races per turn
- maximum 1 Main Event per turn
- the Main Event cannot be entered until all four Quick Races have been completed
- race allowances reset when the player advances to the next game turn
- Quick Race target duration: about 30 seconds
- Main Event target duration: about 60 seconds

The Main Event is intentionally gated so the player sees several local races, watches form and condition change, and gathers information before the featured race.

## Persistent horse roster

Horses persist across races and turns. Fields are selected from a regional roster rather than generating six entirely new horses every race.

Each horse tracks:

- name
- age
- sex
- jockey
- speed
- stamina
- consistency
- late kick
- starting ability
- jockey skill
- preferred surface
- preferred distance
- fitness
- fatigue
- confidence
- health
- injury state
- career starts
- wins
- places
- shows
- earnings
- recent finishing form
- career peak

This allows the player to recognize recurring horses and build an opinion of them over time.

## Development and decline

Horse ability is not static.

Young horses can improve gradually. Prime-age horses tend to stabilize and may gain consistency. Older horses can lose speed, stamina and fitness. Race performance can slightly raise or lower confidence. Repeated racing raises fatigue. Rest between game turns restores some fitness and lowers fatigue.

The model deliberately allows horses to get worse. A formerly dominant horse can age out of its prime, become injury-prone or lose form.

## Injuries

Racing carries a small injury risk. Risk rises somewhat with fatigue and with the longer Main Event.

Current prototype injuries include:

- minor strain
- hoof soreness
- leg soreness

An injured horse receives a major performance penalty and is normally excluded from field selection until recovered. Recovery can happen between turns as health improves.

Future work can distinguish temporary soreness from career-changing injuries and retirement.

## Field selection

Quick Race fields are selected from healthy, reasonably rested horses in the regional pool.

Main Event fields are weighted more strongly toward horses with:

- higher underlying ability
- better recent form
- lower fatigue
- adequate health

This makes the Main Event feel like a stronger field rather than simply a longer copy of a Quick Race.

## Odds

Odds are recalculated whenever a new field is assembled.

The current market model uses:

- underlying ability
- recent form
- fitness
- fatigue
- confidence
- health
- track-surface match
- distance match
- small market/public noise

The UI displays both fractional-style odds and an implied probability estimate.

The odds are intentionally not a perfect revelation of true ability. Public noise and changing condition can produce favorites, overlooked horses and value opportunities.

Future work can add public betting movement, morning lines, bookmakers, scratches, newspaper handicappers and regional betting markets.

## Race engine

Each horse advances along a 0–100% progress bar. First to 100% wins.

Race speed is influenced by:

- effective current rating
- preferred track surface
- preferred distance
- fatigue
- fitness
- stamina in later stages
- starting ability early in the race
- late kick near the finish
- consistency
- small random variance
- occasional burst
- occasional stumble / checked stride

The player sees only the progress bars and public racing information rather than hidden raw attributes.

## Betting

Current bet types:

- Win
- Place
- Show

Quick and Main races have different maximum wager sizes. Winnings and losses directly change estate cash.

Betting history records:

- horse backed
- bet type
- wager
- finishing position
- winner
- payout
- net win or loss

Future bets can include Exacta, Quinella and Daily Double once the core race economy is stable.

## Longer-term roadmap

Planned racing depth includes:

- owned horses
- purchase and sale
- breeding and pedigrees
- trainers
- player-selected training schedules
- jockey contracts
- entry fees
- purse money
- race classes
- eligibility rules
- scratches
- veterinarian bills
- serious injuries
- retirement
- stable reputation
- newspaper previews and racing columns
- seasonal race calendar
- rival owners
- public betting movement
- bookmaker credit and gambling debt

The guiding principle is persistence: races should create history. A player should remember a horse that repeatedly burned them, a former champion in decline, or a long shot they learned to recognize before the market did.
