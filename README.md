# MERC ZEBRA

A May-gray delivery run across the Valley. You're Mercury. Keep moving.

## ▶ [PLAY IT IN YOUR BROWSER](https://anderspartnersck.github.io/MERCZEBRA/)

## 🆕 ▶ [NORTHRIDGE — drive the real Valley](https://anderspartnersck.github.io/MERCZEBRA/NORTHRIDGE.html)

**An experiment, and the most interesting thing in this repo.** A standalone level that drives
on a **photograph of the actual San Fernando Valley** instead of a procedural grid — rendered
the way OutRun did it, a ground plane sampled per scanline, so the perspective, the horizon and
the sky are real rather than faked.

The scale is measured, not chosen: a parking stall in the aerial is 16px and a real stall is
2.6m, so the art runs at 16.25 cm/px and a 4.5m car covers 27.7px — within a hair of this
engine's own 25-unit car. **One source pixel is one world unit.** The world is 3072 x 2048
against the main game's 1200 x 1200.

**Tilt is the speedometer.** Parked, the camera is near-vertical and it reads as a map. On the
throttle it lays down toward the road, the horizon drops in and the sky opens up. Speed is the
only thing that moves it.

| | |
|---|---|
| **Drive** | `W A S D` |
| **Survey** (flat, north-up) | hold `SHIFT` |
| **Glide / snap** (A/B the feel) | `G` |
| **Minimap · reset** | `M` · `R` |

[`?selftest`](https://anderspartnersck.github.io/MERCZEBRA/NORTHRIDGE.html?selftest) checks the projection ·
[`?spd=150`](https://anderspartnersck.github.io/MERCZEBRA/NORTHRIDGE.html?spd=150) boots at speed

*The main game below is untouched by this — it still runs the procedural Valley.*

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

### Jump to any level

The bare link boots the **coin-op campaign** — one credit, stage 1, no skipping. To reach the
**STAGE SELECT**, open the jailbroken MAY GRAY cab:

**[▸ MERC ZEBRA — JAILBREAK / STAGE SELECT](?cab=maygray)**

That roster is read straight from the level table, so it can never drift out of sync: RUN ALL
(the whole campaign on one credit), every stage individually — including **THE COURTESY**, the
DTLA bonus level the campaign can never reach — plus the cheat panel. Runs started from here
deliberately **do not post to the board**.

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
