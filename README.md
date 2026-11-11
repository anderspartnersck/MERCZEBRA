# MERC ZEBRA

> **Status: working build, not finished.** Live at
> **[anderspartnersck.github.io/MERCZEBRA](https://anderspartnersck.github.io/MERCZEBRA/)**.
> All 11 campaign stages play, with heat and cops, but the city dressing, drop-off
> density and difficulty curve are all still being worked.
>
> The finished Castle Killscreen titles are **[SUCK UP](https://anderspartnersck.github.io/suck-up/3d.html?arcade)**
> and **[ONE-TIMER: THE HIGH TABLE](https://anderspartnersck.github.io/high-table/)**. This repo
> exists so the work can happen in the open, not because the work is done.

A May-gray delivery run across the Valley. You're Mercury. Keep moving.

## ▶ [PLAY IT IN YOUR BROWSER](https://anderspartnersck.github.io/MERCZEBRA/)

A Castle Killscreen game by **Anders & Partners**.

## About

Top-down delivery driving through a real-feeling San Fernando Valley: the 101,
its on-ramps and its jams, named drop-offs, cops that warm up as you push. The
campaign runs from Northridge through the Valley, out to Santa Clarita and
Ventura, and ends in the Mojave. The rule the whole game is built around is
**KEEP MOVING**.

## How to play

| | Keyboard | Gamepad |
|---|---|---|
| Steer | **← / →** | stick or D-pad |
| Gas | **↑**, **Z** or **A** | **A** |
| Brake | **↓**, **X** or **S** | **B** |
| Ride (pick up / drop off, start, confirm) | **SPACE** or **ENTER** | **Y** |
| Lay low (bleed heat, shake the cops) | **SHIFT** or **C** | **X** |
| Horn (the gallop: leapfrog traffic) | **H** | **LB** |
| Pause | **ESC** or **P** | **SELECT** |

The pause menu has a HOW TO DRIVE card with the same list.

**On a phone,** turn it sideways: a steering pad and six buttons (GAS, BRAKE,
RIDE, LAY LOW, HORN, START) sit beside the game. The ⇄ LEFTY chip mirrors the
two sides.

### Jump to any level

The bare link boots the **coin-op campaign**: one credit, stage 1, no skipping. To
reach the **STAGE SELECT**, open the jailbroken MAY GRAY cab:

**[▸ MERC ZEBRA — JAILBREAK / STAGE SELECT](https://anderspartnersck.github.io/MERCZEBRA/?cab=maygray)**

Gas/brake (or click) to choose, RIDE to go, LAY LOW to back out. It lists RUN ALL
(the whole campaign on one credit), every stage on its own, including
**THE COURTESY**, the DTLA bonus level the campaign never reaches, plus the cheat
panel. Runs started from here **do not post to the board**.

### Also in this repo

[POV DRIVE TEST](https://anderspartnersck.github.io/MERCZEBRA/POV%20DRIVE%20TEST.html)
is a sandbox for a behind-the-car and cockpit view. It is an experiment, not the game.

## What still needs work

- Level pacing past the mid-game is not yet tuned.
- This is the heaviest of the bundles (about 120 MB of street tiles, props and music).

## Rebuilding this bundle

This repo is **generated**. Never edit the game files here directly. They are
built from the private Castle Killscreen tree:

```
cd "ANDERS CASTLE KILLSCREEN/ZEBRA CORVETTE"
python3 tools/build_pages.py
```

The bundler shrinks art by **resolution, not by pruning**: these engines build most asset
paths by string concatenation, so a static scan can't see what's used, and a wrongly-cut
sprite doesn't error. It just silently fails to draw. The build leaves this README
alone; it is the one file kept by hand, in this repo.

## Credits

Created by **Joseph Coleman**, with Claude, ChatGPT, and Blender.
Anders & Partners.

<sub>Generated from the private Castle Killscreen tree. Edit there, not here.</sub>
