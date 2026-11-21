# The Tower of Lumen

An isometric puzzle adventure for Year 3 (England's National Curriculum). Children open doors guarded by Maths, English, Reading, Logic and Science & World questions, light up the tower and collect mystery-box rewards.

## Play it
Open `index.html` in a browser, or host this folder on any static web host (GitHub Pages, Netlify, Cloudflare Pages). There is nothing to install or build.

Progress is saved in each player's browser. To move a player between devices or links, use Menu > Parent view > Move to another device.

## Files
- `index.html` – page layout and styles
- `js/data.js` – question bank (English, Reading passages, Science & World), rewards, story, character options
- `js/questions.js` – maths and logic generators, difficulty by floor, question picker
- `js/audio.js` – music, sound effects and read-aloud (all generated in code)
- `js/render.js` – isometric drawing of rooms, doors, characters, pets and the celebration
- `js/game.js` – saves, floors, rooms, doors, Golden Door, rewards, movement
- `js/ui.js` – screens, question windows, backpack, map, settings, parent view, tutorial
- `game-design-decisions.md` – everything agreed about how the game should work

## Continuing with Claude
Upload this folder (or connect the GitHub repository it lives in) and the design notes, then ask Claude to make the next change. Ask it to read `game-design-decisions.md` first and to update it when decisions change.
