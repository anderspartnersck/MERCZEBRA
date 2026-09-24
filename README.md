# MERC ZEBRA

A May-gray delivery run across the Valley. You're Mercury. Keep moving.

## ▶ [PLAY IT IN YOUR BROWSER](https://anderspartnersck.github.io/MERCZEBRA/)

A Castle Killscreen game by **Anders & Partners**.

> ### ⚠︎ Working build — not a finished game
>
> Playable across 11 levels with heat and cops, but this is the least settled of the driving builds — the city dressing, drop-off density and difficulty curve are all still being worked.
>
> The finished Castle Killscreen titles are **[SUCK UP](https://anderspartnersck.github.io/suck-up/)**
> and **[ONE-TIMER: THE HIGH TABLE](https://anderspartnersck.github.io/high-table/)**. This repo
> exists so the work can happen in the open, not because the work is done.

## About

Top-down delivery driving through a real-feeling San Fernando Valley — the 101,
its on-ramps and its jams, named drop-offs, cops that warm up as you push. The rule
the whole game is built around is **KEEP MOVING**.

## How to play

| | |
|---|---|
| **↑** | gas |
| **↓** | brake |
| **← / →** | steer |
| **SPACE** | start |
| **V** | horn |

On the stage select: **click a stage**, or gas/brake to move and RIDE to select.

## What still needs work

- At ~600MB this is by far the heaviest bundle — it ships the full street-tile and prop set.
- Level pacing past the mid-game is not yet tuned.

## Rebuilding this bundle

This repo is **generated** — never edit it directly. Everything here is built from the
private Castle Killscreen tree:

```
cd "ANDERS CASTLE KILLSCREEN/ZEBRA CORVETTE"
python3 tools/build_pages.py
```

The bundler shrinks art by **resolution, not by pruning**: these engines build most asset
paths by string concatenation, so a static scan can't see what's used, and a wrongly-cut
sprite doesn't error — it just silently fails to draw.

## Credits

Created by **Joseph Coleman**, with Claude and ChatGPT.
Anders & Partners.

<sub>Generated from the private Castle Killscreen tree. Edit there, not here.</sub>
