# The Tower of Lumen – Game design decisions

Last updated: 17 Nov 2026. These are the agreed decisions. Version 1 is built and published as the "The Tower of Lumen" artifact.

## Version 1 (built 17 Nov 2026)
- Web page artifact made of index.html plus js/data.js (question bank, rewards, story), js/questions.js (maths and logic generators, picker), js/audio.js (generated music, sound effects, read-aloud), js/render.js (isometric canvas drawing), js/game.js (state, saves, floors, doors), js/ui.js (screens, windows, input).
- Includes: profile picker, new-player flow (name, year, customisation), optional tutorial with Captain Cog, Year 3 floors 1–3 (Autumn wing) plus practice floors above, all five door branches, bonus doors, the Golden Door, score, stars, tries, hints, mystery boxes, backpack (clothes, pets, memories, stickers), tower map, music and sound settings, read-aloud, easier-to-read font, bigger text, parent view with PIN, move-to-another-device codes, 30-minute break suggestion.
- Question bank: about 95 English, 50 Science & World, 20 reading passages (2 questions each), 6 crate mazes, 14 odd-one-out sets; maths, patterns, robot programs and debugging puzzles are generated.
- Floor maths topics: Floor 1 place value and adding/subtracting ones and tens; Floor 2 hundreds, column methods, 3 times table, word problems; Floor 3 4 and 8 times tables, division, word problems.

## Version 5 (18 Nov 2026)
- **8 pets:** fox cub, owlet, kitten, tiny dragon, puppy, penguin, robot dog, bunny. Each has its own sound and speech lines when petted.
- **Toys (new "hand" slot, Toys tab in the backpack):** magic wand, football, guitar, balloon, kite, rainbow umbrella, magnifying glass, teddy bear, little lantern. Nothing violent (no weapons, bats or clubs).
- **Mystery box order** now has 44 rewards (about 7 floors). If a box's reward is already owned, the box gives the earliest reward the player has missed, so players who were past a slot when the order changed still get every item.
- **Endless wings:** every floor belongs to the current term's wing (Autumn wing now) and floors never run out. From Floor 4 the maths mixes everything taught so far, leaning towards harder topics, and adds missing-number and two-step word problems; debugging and robot-program puzzles grow to 6–7 steps from Floor 5; number patterns use bigger and trickier steps.
- **Spring and Summer wings** are built when that term starts (new topics, room themes and rewards).

## Version 4 (18 Nov 2026)
- **Change my explorer:** from the Menu or the Backpack, a player can change their name, skin, hair style, hair colour and coat colour at any time. Won items (hats, glasses, capes, shoes, pets) stay in the backpack.

## Version 3 changes (18 Nov 2026): follows the school's Year 3 plan
- Source: the school's curriculum maps (maths, history, geography, English, science, computing, DT, art) supplied by the user. The children's school teaches the **6 times table in Year 3** (the national curriculum puts it in Year 4).
- **School terms:** 0 Autumn 1, 1 Autumn 2, 2 Spring 1, 3 Spring 2, 4 Summer 1, 5 Summer 2. Worked out from the date (Autumn 1 Sep to 24 Oct, Autumn 2 25 Oct to Dec, Spring 1 to 14 Feb, Spring 2 to Mar, Summer 1 Apr to May, Summer 2 Jun to Aug); a parent can override it in Parent view. Topics from later terms stay hidden; earlier ones stay for revision.
- **School's Year 3 order:** Maths: Autumn 1 place value, adding and subtracting, column methods; Autumn 2 multiplication and division (3, 4, 6, 8 tables, 2-digit × 1-digit); Spring 1 multiplication and division, length and perimeter; Spring 2 fractions, mass and capacity; Summer 1 fractions, money, time; Summer 2 shape, statistics. History: Autumn Stone Age to Iron Age; Spring Romans in Britain; Summer Ancient Egypt. Geography: Autumn the UK (counties, cities, land use, hills, mountains, rivers); Spring volcanoes, earthquakes, tsunamis, time zones.
- **Floors:** Floor 1 place value and adding/subtracting; Floor 2 hundreds, column methods, word problems, 2/5/10 and 3 times tables; Floor 3 4, 6 and 8 times tables, division, 2-digit × 1-digit. Floors above are practice floors using only topics taught so far.
- **Science:** kept as it was (the school's science document has no term order). Online safety, DT and art: not included for now.
- **Science & World door** now has about 20 Stone Age to Iron Age questions and about 18 UK geography questions; Romans (Spring) and Ancient Egypt (Summer) questions are hidden until their term.
- **Reading door:** 8 new Tower of Lumen stories with a Stone Age to Iron Age flavour (cave paintings, Skara Brae, flint knapping, first farmers, Stonehenge, bronze, roundhouses, hill forts), mixed with the original 20.
- **Weekly spellings:** a parent types the week's words (from Purple Mash) in Parent view. The list is shared by all players on the device. About half of English door questions practise them, half stay normal English questions. Four kinds: listen and spell (on-screen letter keyboard), pick the right spelling, fill in missing letters, unscramble letter tiles. Tricky words come back more often; saving a new list keeps up to 3 still-tricky words from the old one. Parent view shows each word as not seen yet, practising or secure (2+ right and the last try right).

## Version 2 changes (18 Nov 2026)
- **Floor-complete celebration:** a flagpole springs up beside the player, a golden flag races to the top while the explorer jumps, then fireworks, confetti, a "FLOOR n COMPLETE!" banner and an original fanfare, before the floor summary.
- **No backtracking:** each new room offers doors for whatever the floor still needs (subjects with the fewest doors opened first, bonus doors when there is room). Once the Golden Door appears, it shows up in every room on that floor. Locked doors left behind for a finished subject turn into bonus doors, or practice doors worth 50 points.
- **Petting:** tap the pet, press P, or use the Pet button. The pet makes its own sound (fox yips, owl hoots, dragon rawrs or purrs) and shows a speech bubble and floating hearts.
- **Difficulty rises each floor:** times-table questions go up to ×10 on Floors 1–2 and ×12 from Floor 3; column addition and subtraction have no carrying or exchanging until Floor 3; robot programs and debugging puzzles get longer (3–4 steps, then 4–5, then 5–6); patterns get trickier; harder mazes come in; English and Science & World topics are graded 1–3 and the harder ones appear from Floors 2 and 3.

## Purpose and scope
- A personal try-out for the user's own two children. Not monetised, not public for now.
- Legal and privacy compliance (UK GDPR, Children's Code) is out of scope for now. Revisit before any wider release.
- **England's National Curriculum only.**
- **Platform: web browser game.** It must work with mouse and keyboard, and with touch on phones and tablets.
- **First build: Year 3 only.** Both children are in Year 3. Other years come later.
- **Name: The Tower of Lumen** (for now).
- **Art: drawn in code**, built so sprites can be swapped in later.

## Audience and visual style
- Children in Year 1 to Year 6 (Year 3 first).
- 2D-drawn but **isometric 3D view**, Diablo-style camera. Bright and colourful, never dark, no horror.
- The mini-map is isometric too, matching the room view.
- British details throughout: British spelling (colour, maths), pounds and pence, UK date and time formats.

## Lore: The Tower of Lumen
- The player wakes up in a room of a magical tower above the clouds, with no memory of how they got there. They are looking for answers and an escape door.
- The tower was built by a kind inventor, **Professor Quill**. The robot guards (such as Captain Cog) are her helpers.
- The tower's lights are powered by knowledge and have started to go dim. Each solved door brings light back to the floor.
- Memory fragments found in mystery boxes slowly reveal the story.
- Twist: Professor Quill brought the player here because she needs a new **Keeper of the Tower**.
- Finale on the rooftop: the escape door opens, the player meets Professor Quill, gets their memories back and receives a Keeper badge.

## Game length and ending
- The game must not end easily.
- Progress is by **floors, not real-world dates**. Each school year is one tower, split into three wings (Autumn, Spring, Summer) whose topics follow the order the curriculum is usually taught in. About **10 floors per wing (~30 floors per tower)**, to be tuned after playtesting.
- After the rooftop finale, **Endless mode** unlocks for that tower. When the player moves up a school year, they can start the next year's tower. Nothing is locked by the calendar.

## Profiles and saving
- Several profiles on one game. At the start, the game asks which profile to play, with a "new player" option.
- Each profile saves its own progress automatically: floor, doors, score, stars, backpack and settings.
- **Saves stay in the browser on each device (no online accounts for now).**
- **Move progress between devices with a parent-only code** in the parent view.
- The school year can be changed from the parent view.

## Parent view and healthy play
- Parent view behind a 4-digit PIN: each child's progress by topic (strong topics, topics to practise), time played, floors and doors.
- **After 30 minutes of play, Captain Cog suggests a break.** It is only a suggestion: the child can keep exploring.

## Game start flow (new profile)
1. The player types their **name**.
2. The player **selects** their school year from a list.
3. The player **customises one character**: skin tone, hair style, hair colour, coat colour.
4. **Optional tutorial**: play it or skip it.
5. The player wakes up in the first room of the Tower of Lumen.

## Movement and controls
- Move with the **arrow keys** (or WASD), by **clicking** on the floor, or by **tapping** on phones and tablets. Space opens a nearby door.
- Big touch-friendly buttons, and an on-screen number pad for typed answers.

## Doors (branches)
Five subject branches: **Maths**, **English** (spelling, grammar, punctuation), **Reading** (passage + questions), **Logic** (patterns, drag-and-drop, robot programs, debugging, crate mazes), **Science & World**.
- Each door shows its subject on a sign, with an icon as well as a colour.
- **A door opens after 2 correct answers.**
- **Quota: 3 doors per branch per floor** = 15 required doors per floor, plus the Golden Door.
- **Scale by age:** doors per room (2 for Years 1–2, 3 for Years 3–4, 4 for Years 5–6).

## Golden Door (level up)
- Appears only when **all 3 doors in every branch** on the floor are open. Extra doors in one branch don't make up for another.
- Asks **one question from each branch**, then takes the player **one floor up**.

## Bonus doors, score and stars
- **1 bonus door per branch**, so 20 doors per floor. Bonus doors give **points only** (150), never mystery boxes.
- Required doors give 100 points, the Golden Door 300.
- **Stars**: 3 on the first try, 2 on the second, 1 on the third, 1 fewer if a hint was used.
- Points unlock Keeper titles: Apprentice, Explorer (800), Pathfinder (1,800), Lightbringer (3,000, gives the Glow cape), Keeper (5,000).
- Players can go back to earlier floors from the map.

## Wrong answers and hints
- 3 tries per question. After the 3rd wrong try the guard shows the answer with an explanation, then gives a new question. Nothing is ever lost.
- Topics a player gets wrong come back more often.
- Hints: multiple choice removes wrong answers; maths shows a picture help (counters, place value chart, number line, column layout); reading highlights the sentence; mazes show the next move; programs show the first arrow. A hint costs one star on that question.
- Hints come from mystery boxes, the Golden Door and climbing to a new floor. Players start with 3.

## Mystery boxes and the backpack
- **Earned: one box when a branch's 3 doors on a floor are done, plus one from the Golden Door** (6 per floor). The tutorial gives one practice box.
- Fixed reward order (no gamble feel): outfits and accessories, pets (fox, owl, dragon) that follow the player, memory fragments, hint tokens, and a sticker with every box.
- Everything is kept in the **backpack**. No home-base room.

## Music and sound
- Upbeat arcade loop with a little mystery, generated in code (free to use). Sound effects. Separate on/off and volume for each.
- Read-aloud with the browser's built-in voice; reading passages are not read aloud.

## Accessibility
- Door icons as well as colours, an easier-to-read font (Lexend) and bigger text.

## Question bank
- **Claude prepares all the questions.** Tagged by topic; maths and logic generated so they never run out.

## Still to decide
- Exact number of floors per tower (v1 has 3 Autumn floors, then practice floors).
- Spring and Summer wing topics for Year 3.
