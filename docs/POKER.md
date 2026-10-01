# Georgia Sun Poker System

Poker is a leisure and financial-risk system tied directly to the estate economy. It is not intended to be a harmless minigame with isolated chips. Buy-ins come from ordinary estate cash, which means gambling competes with food, seed, taxes, repairs, debt service and every other operating need.

## Current v0.7-dev implementation

### Table structure

- four-player Texas Hold'em development table
- player plus three persistent county opponents
- $1 / $2 blinds
- dealer, small blind and big blind rotate between funded players
- proper preflop, flop, turn and river betting rounds
- betting order proceeds around the table instead of resolving all opponents at once
- raises reopen action for players who must respond
- checks, calls, folds, raises and all-ins
- player can buy in with any amount of available estate cash above the minimum
- an **All Cash** control intentionally allows the player to risk all current liquid cash
- cashing out is blocked during an active hand; the player must finish or fold first

### All-ins and side pots

The engine tracks each player's total contribution to the hand. At showdown it builds main and side pots from contribution tiers.

This allows situations such as:

- one player all-in for $35
- another all-in for $90
- two deeper stacks continuing to $200

Each player can win only the pots for which that player contributed enough to be eligible.

### Hand evaluation

The engine evaluates the best five-card hand from seven available cards and supports:

1. high card
2. pair
3. two pair
4. three of a kind
5. straight
6. flush
7. full house
8. four of a kind
9. straight flush

Tens display as `10` on the card face even though the internal rank representation uses `T`.

## Persistent opponents

The three current county opponents are:

- **Elias Mercer** — cautious and patient
- **Thomas Hale** — aggressive and more willing to bluff
- **Samuel Price** — steadier middle-ground player

Their profiles persist in game state and accumulate:

- hands played
- wins
- folds
- raises
- showdowns
- recorded money won/lost
- most recent result

The AI also observes the player's aggregate raise frequency. This is an early opponent-memory mechanic: very aggressive player behavior can make opponents somewhat less willing to automatically surrender marginal hands.

## Player statistics

Georgia Sun currently records:

- career hands
- hands won
- hands lost
- total table buy-ins
- total table cash-outs
- largest pot seen
- recent hand history
- player raise frequency

These are save-state variables rather than decorative counters, so later social and creditor systems can react to the player's gambling history.

## Financial risk

Poker chips are funded from the same cash balance that runs the estate.

The game deliberately does not reserve money for:

- provisions
- taxes
- repairs
- seed
- livestock
- interest
- emergency purchases

If the player buys into the table with nearly all available cash and loses it, the estate must absorb that decision. Estate-backed borrowing can therefore indirectly fund gambling, and a player can put an already leveraged property into greater danger by converting debt into liquid cash and then losing that cash at the table.

This is intentional. Georgia Sun does not protect the player from financial recklessness.

## AI direction

The current AI uses:

- preflop hand quality
- postflop made-hand strength
- pot pressure
- stack size
- individual aggression
- individual bluff tendency
- individual patience
- observed player aggression

It is designed to be beatable but not a guaranteed source of money.

Future work should make opponents more human and less formulaic through:

- position awareness
- drawing-hand equity
- bet-size interpretation
- remembered showdowns
- opponent-specific grudges and confidence
- tilt
- drunken play
- tells
- bluff-catching tendencies
- table selection

## Remaining poker roadmap

The following remain planned rather than complete:

- multiple venues with different table stakes
- invitations to private games
- richer social consequences
- direct gambling credit / markers from named creditors
- unpaid gambling debts
- creditor pressure and collections
- accusations of cheating
- opponent relationships outside the table
- stronger long-term adaptive AI
- period-appropriate alternate poker variants after historical research

## Design rule

Poker is part of the economic simulation, not outside it.

A player may use gambling to rescue a desperate estate, enlarge a fortune or destroy both cash and credit. The game should make all three outcomes possible without quietly steering the result toward success.