MERC ZEBRA — COCKPIT ART DROP (View C, the NFS windshield/steering-wheel POV)

Drop your driver's-seat renders here and the POV DRIVE TEST sandbox ("make pov")
lights them up automatically — every draw is IMG-guarded with a procedural fallback,
so nothing breaks if a slot is empty.

WIRED 2026-06-19 (TEMP): dash.png = the IN-CAR render (hands on the wheel, amber gauges, wood dash,
windshield already transparent). The wheel is BAKED IN + static, so the POV skips the procedural wheel
until a separate wheel.png turn-sheet arrives. Keyed/installed via tools/key_bg.py if a render needs its
windshield/glass punched to alpha. Swap dash.png anytime; drop a wheel.png turn-sheet to get a live wheel.

SLOTS
  dash.png    The cockpit foreground: dashboard + A-pillars + glowing gauges, with the
              WINDSHIELD OPENING transparent (alpha) so the scrolling road plate shows
              through. Authored full-frame (it's drawn 0,0 -> W,H over the road). 16:9.
              Prompt: ART-REQUEST.md §4 (the cockpit foreground prompt).

  wheel.png   The steering wheel. TWO modes, auto-detected by aspect ratio:
                · SINGLE WHEEL  (roughly square image)  -> the sandbox ROTATES it by steer.
                · WHEEL-TURN SHEET (a wide N-up strip)  -> the sandbox PICKS the frame by
                  steer. This is the "wheel turn sprites" path. Lay the frames left->right,
                  hard-left ... straight (center) ... hard-right, evenly spaced, same size.
                  Frame count = round(sheet_width / sheet_height). Center frame = straight.
              Put the Mercury "☿" on the horn boss either way.

NOTES
  · Keep the ☿ and the worn-black-wheel / amber-gauge read consistent with the cab deck.
  · The sandbox is a feel proving-ground only — top-down stays the locked core (guardrail #2).
    If/when View C earns a real home, the same slots wire into the game IMG-guarded.
