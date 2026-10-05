# Brawlhalla Scoreboard for TournamentStreamHelper

[Overlay Demo](https://youtu.be/prlm6ZDzRbs)


A broadcast scoreboard overlay for Brawlhalla, built as a layout for [TournamentStreamHelper (TSH)](https://github.com/joaorb64/TournamentStreamHelper). It's designed for **2v2** and falls back to **1v1** automatically.

- **Bottom bar:** each player gets a character portrait, their tag, a sponsor prefix, and an info line (country flag, seed, pronouns). The scores sit in the middle with the phase, match name and "best of" text between them.
- **Top-left corner tab:** shows the tournament name and event name.
- **Extra 2v2 details:** team-name tabs sit above each half of the bar, and a pulsing **LOSERS** tab appears over the score of a team in losers bracket.

The look is dark panels, green and purple team colors, the Syne typeface in wide-spaced uppercase, and slanted edges throughout.

---

## Requirements

- TournamentStreamHelper (built and tested against **v5.975**)
- Brawlhalla selected as the game in TSH. The character portraits use TSH's Brawlhalla `base_files/icon` asset pack, which TSH downloads.
- OBS Studio, or any streaming software with a browser source

## Installation

1. Copy this whole folder into your TSH install's `layout/` directory:

   ```
   TournamentStreamHelper/
   └── layout/
       └── scoreboard_brawlhalla/   ← this folder
           ├── index.html
           ├── index.css
           ├── index.js
           ├── settings.json
           └── fonts/
               ├── Syne.ttf
               └── OFL.txt
   ```

   The folder name can be anything. Just use the same name in the URL below.

2. The layout depends on TSH's shared files in `layout/include/` and `layout/main.css`. Those ship with TSH, so there's nothing else to install.

## Adding it to OBS

1. Start TSH and select **Brawlhalla** as the game.
2. In OBS, add a **Browser** source:
   - **URL:** `http://localhost:5500/layout/scoreboard_brawlhalla/index.html`
     Use whichever port your TSH web server runs on. 5500 is the default (TSH setting `general.webserver_port`).
   - **Width / Height:** `1920` × `1080`
   - Leave the default transparent background CSS in place.
3. The scoreboard fades and slides in once it receives match data from TSH. It updates live as you edit the match in TSH.

You can also use **Local file** mode in OBS and point it at `index.html`. TSH's scripts handle OBS's local-file mode.

### Multiple scoreboards

If TSH is tracking more than one scoreboard, choose which one this overlay shows with a URL parameter:

```
http://localhost:5500/layout/scoreboard_brawlhalla/index.html?scoreboardNumber=2
```

## What shows where

| On screen | TSH field |
|---|---|
| Top-left tab, large text | Tournament name |
| Top-left tab, small text | Event name (hidden when empty) |
| Player tag | Player name |
| Small coloured text above tag | Player's team / sponsor prefix |
| Info line under tag | Country flag + code · Seed (or Twitter handle if there's no seed) · Pronouns |
| Portrait | The player's **first** selected character |
| Score blocks | Team scores |
| Center, top line | Phase (e.g. "Winners Semis") |
| Center, middle line | Match (e.g. "Winners Round 1") |
| Center, bottom line | Best-of text (e.g. "Best of 5") |
| Tabs above the bar (2v2 only) | Team names, hidden when empty |
| Pulsing "LOSERS" tab | The team's **Losers** checkbox |

**2v2 vs 1v1** is detected from how many players each team has in TSH. In 1v1 the second slot on each side hides and the bar narrows.

If a player has no character picked yet, their portrait card is hidden rather than shown empty.

## Settings

`settings.json` in this folder:

```json
{
  "assets": {
    "default": {
      "asset_key": "base_files/icon"
    }
  },
  "useTeamColors": false
}
```

| Setting | Default | What it does |
|---|---|---|
| `useTeamColors` | `false` | When `false`, team 1 is always green and team 2 always purple. Set to `true` to use the team colours chosen in TSH instead. |
| `assets.default.asset_key` | `base_files/icon` | Which TSH character asset pack the portraits use. |

## Customising the look

Most sizes and colours are CSS variables at the top of `index.css`:

| Variable | Default | Controls |
|---|---|---|
| `--p1-accent` / `--p2-accent` | `#a3d934` / `#a78fe0` | Team colours (score blocks, sponsor text, accent lines) |
| `--p1-accent-dim` / `--p2-accent-dim` | translucent versions | Tint on the info strip under each side |
| `--bh-panel`, `--bh-panel-2` | near-black | Bar and tab backgrounds |
| `--bh-strip` | `#1a1723` | Info strip background |
| `--bh-text`, `--bh-text-dim` | light lilac tones | Main and secondary text colour |
| `--bar-width` | `1672px` | Width of the bottom bar in 2v2 (the 1v1 width is set under `body.singles` at the bottom of the file) |
| `--bar-height` | `92px` | Height of the bottom bar |
| `--center-width` | `452px` | Width of the center score section |
| `--slant` | `28px` | How far the slanted edges lean |

A few things you're likely to want to change:

- **Gap between the match text and the scores:** change `padding` in `.center_text`. If you add space there, add the same amount to `--center-width` and both `--bar-width` values. Otherwise the match text shrinks to fit.
- **Corner tab position:** change `top` / `left` in `.top_bar` to move it off the screen edge.
- **Corner tab width:** change `min-width` / `max-width` in `.top_bar`.

Long text never overflows. Names and labels shrink evenly to fit their space, using TSH's `font-scale-fit`.

## Developing / previewing without OBS

The page is invisible until it loads match data from TSH. So **double-clicking `index.html` gives a blank page**, because Chrome blocks `file://` pages from reading `out/program_state.json`. Either:

- open it through TSH's web server: `http://localhost:5500/layout/scoreboard_brawlhalla/index.html`, or
- launch Chrome with `--allow-file-access-from-files` and open the file directly.

Set the browser viewport to 1920×1080 (DevTools → device toolbar) to see it at broadcast size. If the page stays blank, check the DevTools console for errors.

### Files

| File | Purpose |
|---|---|
| `index.html` | Markup: corner tab, scorebar, player slots, team tabs, losers tabs |
| `index.css` | All styling and the theme variables |
| `index.js` | Intro animation and the `Update()` handler that maps TSH data onto the page |
| `settings.json` | Layout settings, merged with TSH's global `layout/settings.json` |
| `fonts/` | Bundled Syne font and its licence |

## Troubleshooting

- **Blank page:** see *Developing / previewing* above. Usually the data isn't loading because the page was opened as a local file outside OBS.
- **No character portraits:** make sure Brawlhalla is the selected game in TSH and a character is picked for each player. TSH needs to have downloaded the Brawlhalla asset pack.
- **Wrong colours (red/blue):** `useTeamColors` is `true` in `settings.json`. Set it to `false` for green/purple.
- **Overlay looks the wrong size:** set the OBS browser source to exactly 1920×1080.

## Credits & licences

- Built on [TournamentStreamHelper](https://github.com/joaorb64/TournamentStreamHelper)'s layout framework (`globals.js`, GSAP, jQuery from TSH's `layout/include/`).
- [Syne](https://gitlab.com/bonjour-monde/fonderie/syne-typeface) typeface by The Syne Project Authors, licensed under the SIL Open Font License 1.1. See `fonts/OFL.txt`. The licence file must stay with the font if you redistribute it.
- Character art is Brawlhalla's, supplied through TSH's asset packs, and isn't included in this folder.
