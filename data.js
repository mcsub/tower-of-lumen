/* The Tower of Lumen – fixed content: branches, question bank, rewards, story. */
(function () {
  var TOL = (window.TOL = window.TOL || {});

  TOL.BRANCHES = ['maths', 'english', 'reading', 'logic', 'science'];

  TOL.BRANCH_INFO = {
    maths:   { name: 'Maths',            short: 'MATHS',   guard: 'Captain Cog', body: '#60A5FA', panel: '#3B82F6', frame: '#1E40AF', label: '#2563EB', icon: 'plus' },
    english: { name: 'English',          short: 'ENGLISH', guard: 'Inky',        body: '#F9A8D4', panel: '#F472B6', frame: '#9D174D', label: '#BE185D', icon: 'Aa' },
    reading: { name: 'Reading',          short: 'READING', guard: 'Page',        body: '#FCD34D', panel: '#FBBF24', frame: '#B45309', label: '#B45309', icon: 'book' },
    logic:   { name: 'Logic',            short: 'LOGIC',   guard: 'Gizmo',       body: '#86EFAC', panel: '#4ADE80', frame: '#15803D', label: '#15803D', icon: 'puzzle' },
    science: { name: 'Science & World',  short: 'SCIENCE & WORLD', guard: 'Sprout', body: '#5EEAD4', panel: '#2DD4BF', frame: '#0F766E', label: '#0F766E', icon: 'globe' }
  };

  /* ---------- English (Year 3) ---------- */
  var E = [];
  function eq(topic, prompt, options, hint, explain) {
    E.push({ branch: 'english', topic: topic, type: 'mc', prompt: prompt, options: options, answer: 0, hint: hint, explain: explain });
  }

  // a or an
  [['ant', 1], ['apple', 1], ['egg', 1], ['owl', 1], ['insect', 1], ['elephant', 1], ['octopus', 1], ['orange', 1],
   ['igloo', 1], ['envelope', 1], ['ice cream', 1], ['robot', 0], ['tiger', 0], ['banana', 0], ['castle', 0],
   ['dragon', 0], ['lantern', 0], ['parrot', 0], ['window', 0], ['key', 0]].forEach(function (w) {
    var right = w[1] ? 'an' : 'a', wrong = w[1] ? 'a' : 'an';
    eq('a or an', 'Choose a or an:  ___ ' + w[0], [right, wrong],
      'Does "' + w[0] + '" start with a vowel sound (a, e, i, o, u)?',
      'We use "an" before a vowel sound and "a" before other sounds, so it is "' + right + ' ' + w[0] + '".');
  });

  // Conjunctions
  eq('Conjunctions', 'Choose the best word:  I wore my coat ___ it was raining.', ['because', 'but', 'or', 'if'], 'Which word gives a reason?', '"Because" tells us the reason for wearing the coat.');
  eq('Conjunctions', 'Choose the best word:  Mia was tired, ___ she kept walking.', ['but', 'because', 'if', 'so'], 'The second part is a surprise after being tired.', '"But" joins two ideas that are a bit opposite.');
  eq('Conjunctions', 'Choose the best word:  Brush your teeth ___ you go to bed.', ['before', 'because', 'or', 'but'], 'Which word is about time?', '"Before" tells us when to brush our teeth.');
  eq('Conjunctions', 'Choose the best word:  Would you like juice ___ milk?', ['or', 'so', 'because', 'when'], 'You are choosing between two things.', '"Or" is used to give a choice.');
  eq('Conjunctions', 'Choose the best word:  It was dark, ___ Sam switched on the lamp.', ['so', 'but', 'or', 'if'], 'What happened as a result of the dark?', '"So" tells us what happened because of something.');
  eq('Conjunctions', 'Choose the best word:  I will help you ___ you ask me nicely.', ['if', 'but', 'or', 'so'], 'The help depends on something.', '"If" shows that one thing depends on another.');
  eq('Conjunctions', 'Choose the best word:  The dog barked ___ the postman came.', ['when', 'or', 'but', 'so'], 'Which word is about time?', '"When" tells us the time the dog barked.');
  eq('Conjunctions', 'Choose the best word:  We stayed inside ___ it was snowing.', ['because', 'or', 'but', 'until'], 'Which word gives a reason?', '"Because" gives the reason we stayed inside.');

  // Prefixes
  eq('Prefixes', 'Which word is the opposite of "kind"?', ['unkind', 'diskind', 'miskind', 'rekind'], 'Try the prefix that means "not".', 'The prefix un- means "not", so unkind means not kind.');
  eq('Prefixes', 'Which word is the opposite of "appear"?', ['disappear', 'unappear', 'misappear', 'subappear'], 'Try dis-.', 'The prefix dis- can make the opposite: disappear.');
  eq('Prefixes', 'Which word is the opposite of "obey"?', ['disobey', 'unobey', 'misobey', 'reobey'], 'Try dis-.', 'Disobey means not doing what you are told.');
  eq('Prefixes', 'Which word is the opposite of "lock"?', ['unlock', 'dislock', 'mislock', 'sublock'], 'Try un-.', 'Unlock is the opposite of lock.');
  eq('Prefixes', 'Which word means "spelt wrongly"?', ['misspelt', 'disspelt', 'unspelt', 'subspelt'], 'The prefix mis- means "wrongly".', 'Mis- means wrongly, so misspelt means spelt wrongly.');
  eq('Prefixes', 'Which prefix means "again"?  ___build', ['re', 'un', 'dis', 'super'], 'Rebuild means build again.', 'Re- means again: rebuild, redo, replay.');
  eq('Prefixes', 'Which word means "a boat that goes under the sea"?', ['submarine', 'supermarine', 'remarine', 'automarine'], 'The prefix sub- means "under".', 'Sub- means under, so a submarine goes under the sea.');
  eq('Prefixes', 'Which word means "a very big shop"?', ['supermarket', 'submarket', 'mismarket', 'remarket'], 'The prefix super- means "very big" or "above".', 'Super- means more than or very big: supermarket.');
  eq('Prefixes', 'Which prefix means "self"?', ['auto', 'sub', 'super', 'dis'], 'Think of "autograph": your own name.', 'Auto- means self, like autograph (your own signature).');
  eq('Prefixes', 'Which word is the opposite of "behave"?', ['misbehave', 'unbehave', 'disbehave', 'rebehave'], 'Try mis-.', 'Misbehave means to behave badly.');

  // Suffixes and adverbs
  eq('Suffixes', 'Add -ly:  quick + ly =', ['quickly', 'quickley', 'quikly', 'quickely'], 'Usually you just add -ly.', 'Quick + ly = quickly.');
  eq('Suffixes', 'Add -ly:  happy + ly =', ['happily', 'happyly', 'happly', 'happely'], 'When a word ends in y, change the y to i.', 'Happy ends in y, so change y to i: happily.');
  eq('Suffixes', 'Add -ly:  gentle + ly =', ['gently', 'gentlely', 'gentely', 'gentlly'], 'Words ending in -le change the -le to -ly.', 'Gentle ends in -le, so it becomes gently.');
  eq('Suffixes', 'Add -ly:  basic + ly =', ['basically', 'basicly', 'basicaly', 'basiclly'], 'Words ending in -ic add -ally.', 'Words ending in -ic add -ally: basically.');
  eq('Suffixes', 'Add -ation:  inform + ation =', ['information', 'informashun', 'informtion', 'informacion'], 'Just add -ation to the end.', 'Inform + ation = information.');
  eq('Adverbs', 'Which word is an adverb?  The cat crept quietly.', ['quietly', 'cat', 'crept', 'The'], 'An adverb tells us how something was done.', '"Quietly" tells us how the cat crept.');

  // Word classes
  eq('Word classes', 'Which word is a noun?  The tall girl ran fast.', ['girl', 'tall', 'ran', 'fast'], 'A noun is a person, place or thing.', '"Girl" is a person, so it is a noun.');
  eq('Word classes', 'Which word is an adjective?  A shiny apple fell.', ['shiny', 'apple', 'fell', 'A'], 'An adjective describes a noun.', '"Shiny" describes the apple.');
  eq('Word classes', 'Which word is a verb?  Owls hoot at night.', ['hoot', 'Owls', 'night', 'at'], 'A verb is a doing word.', '"Hoot" is what the owls do.');
  eq('Prepositions', 'Which word is a preposition?  The key is under the mat.', ['under', 'key', 'mat', 'is'], 'A preposition tells us where something is.', '"Under" tells us where the key is.');
  eq('Prepositions', 'Which word is a preposition?  We ate lunch before the show.', ['before', 'ate', 'lunch', 'show'], 'A preposition can tell us when something happens.', '"Before" tells us when we ate lunch.');
  eq('Prepositions', 'Which word is a preposition?  The robot hid behind the door.', ['behind', 'robot', 'hid', 'door'], 'Which word tells us where?', '"Behind" tells us where the robot hid.');

  // Present perfect
  eq('Present perfect', 'Choose the best words:  Mum ___ to the shops, so she is not home.', ['has gone', 'goed', 'going', 'gone has'], 'It happened in the past but matters now.', '"Has gone" is the present perfect: it happened and still matters now.');
  eq('Present perfect', 'Choose the best words:  I ___ my homework already!', ['have finished', 'has finished', 'finishing', 'have finish'], 'With "I" we use "have".', '"I have finished" is the present perfect.');
  eq('Present perfect', 'Choose the best words:  The robots ___ the tower lights.', ['have fixed', 'has fixed', 'fixing', 'have fix'], 'With "the robots" (more than one) we use "have".', '"The robots have fixed" is correct for more than one robot.');

  // Inverted commas
  eq('Speech marks', 'Which sentence uses speech marks correctly?', ['"Let\'s go!" shouted Ben.', '"Let\'s go! shouted Ben.', 'Let\'s go!" shouted Ben.', '"Let\'s go! shouted" Ben.'], 'Speech marks go around the words that are spoken.', 'Only "Let\'s go!" is spoken, so the speech marks go around those words.');
  eq('Speech marks', 'Which words are spoken?  "I love maps," said Ava.', ['I love maps', 'said Ava', 'love maps said', 'Ava'], 'Look inside the speech marks.', 'The words inside the speech marks are the ones Ava said.');
  eq('Speech marks', 'Which sentence uses speech marks correctly?', ['"Where is the key?" asked Zara.', '"Where is the key? asked Zara."', 'Where is the key? "asked Zara."', '"Where is" the key? asked Zara.'], 'Only the spoken words go inside.', 'Zara said "Where is the key?", so only those words go inside the speech marks.');

  // Homophones
  [['The dog wagged its ___.', 'tail', 'tale'], ['Can you ___ the music?', 'hear', 'here'], ['Come over ___!', 'here', 'hear'],
   ['We ___ our friends at the park.', 'meet', 'meat'], ['He gave me a ___ of cake.', 'piece', 'peace'],
   ['The ___ landed at the airport.', 'plane', 'plain'], ['The horse has a long ___.', 'mane', 'main'],
   ['That was a ___ idea!', 'great', 'grate'], ['Be careful not to ___ the glass.', 'break', 'brake'],
   ['I don\'t know ___ it will rain.', 'whether', 'weather'], ['We ___ the bus by one minute!', 'missed', 'mist'],
   ['She won a gold ___.', 'medal', 'meddle'], ['The ___ is sunny today.', 'weather', 'whether'],
   ['I have ___ taller this year.', 'grown', 'groan']].forEach(function (h) {
    eq('Homophones', 'Choose the right word:  ' + h[0], [h[1], h[2]], 'Both words sound the same. Which one fits the meaning?', '"' + h[1] + '" is the right word here. "' + h[2] + '" sounds the same but means something different.');
  });

  // Spelling (Years 3–4 statutory word list)
  [['believe', 'beleive', 'belive', 'beleeve'], ['February', 'Febuary', 'Februery', 'Febrary'], ['library', 'libary', 'liberry', 'libery'],
   ['surprise', 'suprise', 'surprize', 'serprise'], ['separate', 'seperate', 'separat', 'sepparate'], ['island', 'iland', 'islend', 'ighland'],
   ['different', 'diffrent', 'diferent', 'differant'], ['favourite', 'favrite', 'faverite', 'favourit'], ['quarter', 'quater', 'qwarter', 'quartor'],
   ['straight', 'straite', 'strayt', 'straigt'], ['enough', 'enuff', 'enouf', 'enugh'], ['minute', 'minit', 'minnute', 'minnit'],
   ['question', 'questoin', 'kwestion', 'queston'], ['remember', 'rember', 'remembar', 'remmember'], ['although', 'allthough', 'althogh', 'althow'],
   ['famous', 'famus', 'famose', 'faymous'], ['accident', 'acident', 'accidant', 'axident'], ['guard', 'gard', 'guared', 'gaurd'],
   ['build', 'bild', 'biuld', 'buld'], ['busy', 'bizzy', 'buisy', 'bisy'], ['centre', 'senter', 'centure', 'sentre'],
   ['answer', 'anser', 'answar', 'arnswer'], ['heard', 'hered', 'hurd', 'haerd'], ['caught', 'cort', 'caut', 'caugt']].forEach(function (s) {
    eq('Spelling', 'Which word is spelt correctly?', [s[0], s[1].trim(), s[2], s[3]], 'Say the word slowly and picture it.', 'The correct spelling is "' + s[0] + '".');
  });

  /* ---------- Reading passages ({name} = the player's name) ---------- */
  TOL.PASSAGES = [
    { title: 'The Sleepy Lantern', s: ['On the third floor of the tower hung a lantern called Flick.', 'Every night, Flick glowed bright orange to help the robots find their way.', 'One evening, Flick felt so tired that his light became as dim as a candle.', 'Captain Cog climbed a ladder and polished his glass until it sparkled.', 'Soon Flick was shining brighter than ever.'],
      q: [['What colour did Flick glow?', ['orange', 'blue', 'green', 'white'], 1], ['How did Captain Cog help Flick?', ['He polished his glass', 'He gave him a battery', 'He sang him a song', 'He moved him downstairs'], 3]] },
    { title: 'The Crumpled Map', s: ['{name} found a crumpled map under a dusty rug.', 'The map showed a staircase that nobody had ever seen.', 'A small star was drawn next to a window on the left.', '{name} folded the map carefully and put it in a backpack.'],
      q: [['Where was the map found?', ['under a rug', 'inside a book', 'on a shelf', 'in a chest'], 0], ['What was drawn next to the window?', ['a small star', 'a key', 'a tree', 'a door'], 2]] },
    { title: 'The Garden Room', s: ['Not every room in the tower has a wooden floor.', 'The Garden Room has soft grass and a little pond full of silver fish.', 'Professor Quill grew sunflowers here because they love the light.', 'The sunflowers turn their heads to follow the sun across the sky.'],
      q: [['What lives in the pond?', ['silver fish', 'frogs', 'ducks', 'turtles'], 1], ['Why did Professor Quill grow sunflowers here?', ['They love the light', 'They smell nice', 'They are tiny', 'They grow in the dark'], 2]] },
    { title: 'Bolt\'s Bad Day', s: ['Bolt was the smallest robot in the tower.', 'One morning, he dropped a box of bolts all over the kitchen floor.', 'He felt embarrassed and his ears went pink.', 'His friend Nell helped him pick up every single bolt, and they finished before lunch.'],
      q: [['Who was the smallest robot?', ['Bolt', 'Nell', 'Captain Cog', 'Flick'], 0], ['How did Bolt feel when he dropped the box?', ['embarrassed', 'excited', 'sleepy', 'brave'], 2]] },
    { title: 'The Weather Clock', s: ['In the hallway stands a tall clock with no numbers.', 'Instead of telling the time, its hand points to pictures of weather.', 'When the hand points to a cloud with raindrops, everyone takes an umbrella.', 'Today the hand is pointing at a bright yellow sun.'],
      q: [['What does the clock show instead of numbers?', ['pictures of weather', 'animals', 'colours', 'letters'], 1], ['What will the weather probably be like today?', ['sunny', 'rainy', 'snowy', 'foggy'], 3]] },
    { title: 'The Talking Book', s: ['In the library there is a book that can talk.', 'It only speaks when someone says please.', '{name} asked it politely where the next key was hidden.', 'The book whispered, "Look behind the blue curtain."'],
      q: [['When does the book speak?', ['when someone says please', 'at midnight', 'when it rains', 'every hour'], 1], ['Where was the key hidden?', ['behind the blue curtain', 'under the table', 'in the fireplace', 'on the roof'], 3]] },
    { title: 'Cloud Picnic', s: ['Once a year, the robots have a picnic on the roof of the tower.', 'They eat sandwiches while clouds drift past like giant sheep.', 'Captain Cog always brings lemonade in a big glass jug.', 'This year, a gust of wind blew away all the napkins!'],
      q: [['Where do the robots have their picnic?', ['on the roof', 'in the garden', 'by the river', 'in the kitchen'], 0], ['What happened to the napkins this year?', ['The wind blew them away', 'A dog ate them', 'They got wet', 'They were forgotten'], 3]] },
    { title: 'The Echo Corridor', s: ['There is a long corridor where every word you say comes back three times.', 'Children love to shout their names and listen.', 'Professor Quill used the echo to check that the walls were strong.', 'If the echo sounded wobbly, she knew a wall needed fixing.'],
      q: [['How many times does a word come back?', ['three', 'two', 'five', 'once'], 0], ['What did a wobbly echo tell Professor Quill?', ['A wall needed fixing', 'It was time for tea', 'Someone was lost', 'The lights were off'], 3]] },
    { title: 'Nell the Gardener', s: ['Nell is a robot who looks after the plants.', 'She waters them every morning with a watering can shaped like an elephant.', 'She also talks to the plants, because she believes it helps them grow.', 'The tomatoes she grows are the reddest in the whole tower.'],
      q: [['What shape is Nell\'s watering can?', ['an elephant', 'a fish', 'a star', 'a teapot'], 1], ['Why does Nell talk to the plants?', ['She believes it helps them grow', 'They talk back', 'She is lonely', 'To scare the birds'], 2]] },
    { title: 'The Lost Sock', s: ['Every week, one sock goes missing from the tower laundry.', 'Captain Cog decided to solve the mystery.', 'He hid behind a basket and waited quietly.', 'At midnight, a tiny mouse crept in and carried a sock back to its cosy nest.'],
      q: [['What goes missing from the laundry?', ['one sock', 'a towel', 'a hat', 'a glove'], 0], ['Who was taking the socks?', ['a tiny mouse', 'a robot', 'a cat', 'the wind'], 3]] },
    { title: 'The Singing Stairs', s: ['The stairs between the second and third floors play a note when you step on them.', 'Going up, the notes get higher, and going down, they get lower.', '{name} discovered that jumping on two steps at once made a chord.', 'Now {name} hums along every time those stairs are climbed.'],
      q: [['What happens to the notes when you go up?', ['They get higher', 'They get lower', 'They stop', 'They get quieter'], 1], ['What did jumping on two steps at once make?', ['a chord', 'a crack', 'a splash', 'a light'], 2]] },
    { title: 'The Star Telescope', s: ['At the top of the west wing is a brass telescope.', 'Through it, you can see the craters on the Moon and the rings of Saturn.', 'Professor Quill wrote the name of every star she found in a green notebook.', 'The notebook has three hundred and twelve stars in it.'],
      q: [['What colour is the notebook?', ['green', 'red', 'brown', 'gold'], 2], ['How many stars are in the notebook?', ['312', '300', '213', '12'], 3]] },
    { title: 'The Kind Kettle', s: ['The kitchen kettle whistles a tune instead of a boring beep.', 'Each morning it plays a different song to wake up the robots.', 'On Mondays it plays a slow, gentle tune because everyone is sleepy.', 'On Fridays it plays a fast, happy song.'],
      q: [['Why is the Monday tune slow and gentle?', ['Everyone is sleepy', 'The kettle is broken', 'It is cold', 'The robots are busy'], 2], ['What kind of song plays on Fridays?', ['fast and happy', 'slow and gentle', 'very quiet', 'no song at all'], 3]] },
    { title: 'Window Paintings', s: ['When it rains, the windows of the tower turn into paintings.', 'Raindrops slide down the glass and leave trails of colour.', 'Purple trails mean the rain will stop soon.', '{name} once saw a trail shaped exactly like a dragon.'],
      q: [['What do purple trails mean?', ['The rain will stop soon', 'It will snow', 'It will be windy', 'It is night'], 2], ['What shape was the trail {name} saw?', ['a dragon', 'a heart', 'a boat', 'a star'], 3]] },
    { title: 'The Map Room', s: ['The Map Room is full of maps of places that do not exist.', 'One map shows an island shaped like a teacup.', 'Another shows a mountain made entirely of cheese.', 'Professor Quill drew these maps for fun on rainy afternoons.'],
      q: [['What is the island shaped like?', ['a teacup', 'a shoe', 'a fish', 'a moon'], 1], ['Why did Professor Quill draw the maps?', ['for fun', 'for school', 'to sell them', 'to find treasure'], 3]] },
    { title: 'Captain Cog\'s Secret', s: ['Captain Cog keeps a small key on a chain around his neck.', 'He never tells anyone what it opens.', 'One day he said to {name}, "This key opens a door you will find when you are ready."', '{name} has wondered about that door ever since.'],
      q: [['Where does Captain Cog keep the key?', ['on a chain around his neck', 'in his pocket', 'under his hat', 'in a box'], 0], ['What does the key open?', ['a door {name} will find when ready', 'the kitchen', 'a treasure chest', 'the roof'], 2]] },
    { title: 'The Bubble Bath', s: ['Bolt was afraid of water, so he never had a bath.', 'Nell made him a special bath full of bubbles instead.', 'The bubbles tickled his metal feet and made him giggle.', 'Now Bolt asks for a bubble bath every Saturday.'],
      q: [['Why did Bolt never have a bath?', ['He was afraid of water', 'He was too busy', 'There was no bath', 'He liked being dusty'], 0], ['When does Bolt have a bubble bath now?', ['every Saturday', 'every day', 'on his birthday', 'never'], 3]] },
    { title: 'Paper Planes', s: ['The highest window in the tower is perfect for flying paper planes.', '{name} folded a plane from an old page of homework.', 'It glided over three clouds before landing on a sleepy seagull.', 'The seagull carried the plane away to its nest.'],
      q: [['What was the paper plane made from?', ['an old page of homework', 'a map', 'a newspaper', 'a letter'], 1], ['Where did the seagull take the plane?', ['to its nest', 'to the sea', 'back to the window', 'to the roof'], 3]] },
    { title: 'The Quiet Library', s: ['In the library, the books arrange themselves at night.', 'Books about animals hop onto the bottom shelf.', 'Books about space float up to the very top.', 'Every morning the librarian finds them in perfect order.'],
      q: [['When do the books arrange themselves?', ['at night', 'at lunchtime', 'on Sundays', 'every hour'], 0], ['Where do the space books go?', ['the very top shelf', 'the bottom shelf', 'the floor', 'a box'], 2]] },
    { title: 'The Brave Little Light', s: ['Deep in the cellar lived a tiny light bulb called Spark.', 'Spark was smaller than a pea, but she was very brave.', 'When the big lamps went out during a storm, Spark shone all night long.', 'The robots gave her a medal shaped like a sun.'],
      q: [['How small was Spark?', ['smaller than a pea', 'as big as a football', 'as tall as a door', 'the size of a cat'], 1], ['What shape was Spark\'s medal?', ['a sun', 'a star', 'a moon', 'a heart'], 3]] }
  ];

  /* ---------- Science & World (Year 3 science, KS2 geography and history) ---------- */
  var S = [];
  function sq(topic, prompt, options, hint, explain) {
    S.push({ branch: 'science', topic: topic, type: 'mc', prompt: prompt, options: options, answer: 0, hint: hint, explain: explain });
  }
  sq('Plants', 'Which part of a plant takes in water from the soil?', ['roots', 'petals', 'leaves', 'flowers'], 'It is the part under the ground.', 'Roots take in water and hold the plant in the soil.');
  sq('Plants', 'What do plants need to grow well?', ['light, water and air', 'darkness and sugar', 'only sand', 'salty water'], 'Think about what a plant on a windowsill gets.', 'Plants need light, water, air, nutrients from soil and room to grow.');
  sq('Plants', 'Which part of a flower attracts insects?', ['the petals', 'the roots', 'the stem', 'the soil'], 'It is the colourful part.', 'Bright petals attract insects such as bees.');
  sq('Plants', 'What does the stem of a plant do?', ['carries water up the plant', 'makes the soil', 'catches insects', 'makes the sun shine'], 'It is like a straw.', 'The stem carries water from the roots up to the leaves and flowers.');
  sq('Plants', 'Bees help flowers to make seeds by carrying ___.', ['pollen', 'water', 'soil', 'leaves'], 'It is a yellow powder.', 'Bees carry pollen from flower to flower. This is called pollination.');
  sq('Plants', 'How can seeds be spread?', ['by wind, water and animals', 'only by people', 'they never move', 'only by rain'], 'Think of dandelion clocks and burrs.', 'Seeds are spread by wind, water, animals and even by exploding pods.');
  sq('Animals and humans', 'Which bones protect your brain?', ['the skull', 'the ribs', 'the spine', 'the kneecaps'], 'They are in your head.', 'Your skull is like a helmet around your brain.');
  sq('Animals and humans', 'Which bones protect your heart and lungs?', ['the ribs', 'the skull', 'the toes', 'the kneecaps'], 'They make a cage in your chest.', 'Your ribs form a cage around your heart and lungs.');
  sq('Animals and humans', 'Muscles help us to ___.', ['move', 'see', 'hear', 'taste'], 'Think about your arms and legs.', 'Muscles pull on bones to make us move.');
  sq('Animals and humans', 'Which animal has its skeleton on the outside of its body?', ['a beetle', 'a dog', 'a fish', 'a human'], 'It has a hard shell.', 'Insects like beetles have an exoskeleton: a skeleton on the outside.');
  sq('Animals and humans', 'Which food gives us protein to help build muscles?', ['eggs', 'sweets', 'crisps', 'jam'], 'Protein comes from foods like meat, fish, beans and...', 'Eggs are full of protein, which helps build muscles.');
  sq('Animals and humans', 'Animals that eat only plants are called ___.', ['herbivores', 'carnivores', 'omnivores', 'insects'], 'Herbs are plants.', 'Herbivores eat only plants, like rabbits and cows.');
  sq('Animals and humans', 'Which of these animals has no skeleton at all?', ['a worm', 'a cat', 'a frog', 'a bird'], 'It is soft and wiggly.', 'Worms have no bones; they are invertebrates.');
  sq('Rocks', 'What is a fossil?', ['the remains of a living thing kept in rock', 'a shiny crystal', 'a type of soil', 'a volcano'], 'Think of dinosaur bones in stone.', 'A fossil is the remains or shape of a plant or animal from long ago, preserved in rock.');
  sq('Rocks', 'Soil is made from tiny bits of rock mixed with ___.', ['dead plants and animals', 'plastic', 'sugar', 'glass'], 'Think of rotting leaves.', 'Soil is rock pieces mixed with rotting plants and animals, air and water.');
  sq('Rocks', 'Who found famous fossils on the beach at Lyme Regis?', ['Mary Anning', 'Isaac Newton', 'Florence Nightingale', 'Charles Dickens'], 'She lived about 200 years ago.', 'Mary Anning found amazing fossils, including an ichthyosaur, at Lyme Regis.');
  sq('Rocks', 'Which rock is soft and crumbly?', ['chalk', 'granite', 'marble', 'slate'], 'Teachers once wrote on boards with it.', 'Chalk is a soft rock that crumbles easily.');
  sq('Rocks', 'Which rock is very hard and used for kitchen worktops?', ['granite', 'chalk', 'sand', 'clay'], 'It is speckled and very strong.', 'Granite is a very hard rock.');
  sq('Light', 'We need ___ to see things.', ['light', 'sound', 'wind', 'heat'], 'What disappears at night?', 'We need light to see. Light bounces off things and into our eyes.');
  sq('Light', 'Dark is the absence of ___.', ['light', 'sound', 'air', 'water'], 'Dark means there is none of it.', 'When there is no light, it is dark.');
  sq('Light', 'A shadow forms when light is ___ by an object.', ['blocked', 'turned blue', 'made louder', 'heated'], 'The object gets in the way.', 'When an object blocks light, it makes a shadow.');
  sq('Light', 'Which surface reflects light best?', ['a mirror', 'a brick', 'a wool jumper', 'a tree trunk'], 'It is shiny and smooth.', 'Smooth, shiny surfaces like mirrors reflect light best.');
  sq('Light', 'Why should you never look straight at the Sun?', ['it can damage your eyes', 'it makes you sneeze', 'it is too far away', 'it is rude'], 'The Sun is very bright.', 'Sunlight is so strong it can damage your eyes. Wear sunglasses and never look straight at it.');
  sq('Light', 'When is your shadow shortest on a sunny day?', ['around midday', 'early morning', 'evening', 'at night'], 'When is the Sun highest in the sky?', 'At midday the Sun is high, so shadows are short.');
  sq('Light', 'An object that lets no light through is ___.', ['opaque', 'transparent', 'shiny', 'soft'], 'You cannot see through it.', 'Opaque objects block all light, like a wooden door.');
  sq('Forces and magnets', 'Which object would a magnet attract?', ['an iron nail', 'a plastic ruler', 'a wooden spoon', 'a glass marble'], 'Magnets attract some metals.', 'Magnets attract iron, so the iron nail would stick.');
  sq('Forces and magnets', 'Two magnets with their north poles facing will ___.', ['push apart', 'pull together', 'melt', 'glow'], 'Same poles do not like each other.', 'Like poles repel, so they push apart.');
  sq('Forces and magnets', 'The opposite poles of two magnets will ___.', ['attract', 'repel', 'disappear', 'spin'], 'North and south...', 'Opposite poles attract and pull together.');
  sq('Forces and magnets', 'A push or a pull is called a ___.', ['force', 'magnet', 'shadow', 'fossil'], 'It starts with f.', 'Pushes and pulls are forces.');
  sq('Forces and magnets', 'On which surface would a toy car roll the furthest?', ['a smooth floor', 'a carpet', 'grass', 'sand'], 'Which is the smoothest?', 'Smooth surfaces have less friction, so the car rolls further.');
  sq('UK geography', 'What is the capital city of England?', ['London', 'Cardiff', 'Edinburgh', 'Belfast'], 'Big Ben is there.', 'London is the capital of England and of the UK.');
  sq('UK geography', 'What is the capital city of Scotland?', ['Edinburgh', 'Glasgow', 'London', 'Cardiff'], 'It has a famous castle on a hill.', 'Edinburgh is the capital of Scotland.');
  sq('UK geography', 'What is the capital city of Wales?', ['Cardiff', 'Swansea', 'Belfast', 'London'], 'It starts with C.', 'Cardiff is the capital of Wales.');
  sq('UK geography', 'What is the capital city of Northern Ireland?', ['Belfast', 'Dublin', 'Cardiff', 'Edinburgh'], 'It starts with B.', 'Belfast is the capital of Northern Ireland.');
  sq('UK geography', 'What is the highest mountain in the UK?', ['Ben Nevis', 'Snowdon', 'Scafell Pike', 'Mount Everest'], 'It is in Scotland.', 'Ben Nevis in Scotland is the highest mountain in the UK.');
  sq('UK geography', 'What is the longest river in the UK?', ['the River Severn', 'the River Thames', 'the River Nile', 'the River Amazon'], 'It flows through Wales and England.', 'The River Severn is the longest river in the UK.');
  sq('World geography', 'How many continents are there?', ['7', '5', '3', '10'], 'Count: Africa, Antarctica, Asia, Australia (Oceania), Europe, North America, South America.', 'There are 7 continents.');
  sq('World geography', 'Which is the largest ocean?', ['the Pacific', 'the Atlantic', 'the Indian', 'the Arctic'], 'It is between Asia and the Americas.', 'The Pacific Ocean is the largest.');
  sq('World geography', 'The UK is part of which continent?', ['Europe', 'Asia', 'Africa', 'South America'], 'France is on the same continent.', 'The UK is in Europe.');
  sq('Maps', 'On a compass, which direction is opposite north?', ['south', 'east', 'west', 'up'], 'Think of the North and South Poles.', 'South is opposite north.');
  sq('Maps', 'On a map, blue usually shows ___.', ['water', 'roads', 'forests', 'towns'], 'Think of seas and rivers.', 'Blue on a map usually means water.');
  sq('Maps', 'If you face north and turn right, which way are you facing?', ['east', 'west', 'south', 'north'], 'Never Eat Soggy Weetabix: north, east, south, west, going clockwise.', 'Turning right from north takes you to east.');
  sq('History', 'In the Stone Age, many tools were made from ___.', ['stone and flint', 'plastic', 'steel', 'glass'], 'The clue is in the name.', 'Stone Age people made tools from stone, flint, bone and wood.');
  sq('History', 'In which English county is Stonehenge?', ['Wiltshire', 'Kent', 'Yorkshire', 'Devon'], 'It is near Salisbury.', 'Stonehenge is in Wiltshire.');
  sq('History', 'In the Iron Age, many people lived in ___.', ['roundhouses', 'skyscrapers', 'castles', 'caravans'], 'Their houses were round with thatched roofs.', 'Iron Age people lived in roundhouses made of wood, mud and straw.');
  sq('History', 'Skara Brae is a Stone Age village in ___.', ['Scotland', 'Wales', 'Cornwall', 'London'], 'It is on the Orkney Islands.', 'Skara Brae is on Orkney, in Scotland.');
  sq('History', 'The ancient Egyptians built huge ___ as tombs for their kings.', ['pyramids', 'castles', 'bridges', 'lighthouses'], 'They are triangle-shaped.', 'The pyramids were tombs for Egyptian pharaohs.');
  sq('History', 'An ancient Egyptian king was called a ___.', ['pharaoh', 'knight', 'mayor', 'chief'], 'Tutankhamun was one.', 'Egyptian kings were called pharaohs.');
  sq('History', 'Which river was very important to ancient Egypt?', ['the Nile', 'the Thames', 'the Amazon', 'the Severn'], 'It is in Africa.', 'The River Nile gave the Egyptians water and rich soil for farming.');
  sq('History', 'Ancient Egyptian picture writing is called ___.', ['hieroglyphics', 'graffiti', 'cursive', 'capitals'], 'It starts with h.', 'Hieroglyphics used pictures and symbols as writing.');
  sq('History', 'The Romans built a long wall across the north of England called ___.', ['Hadrian\'s Wall', 'the Great Wall', 'London Wall', 'the Berlin Wall'], 'It is named after an emperor.', 'Hadrian\'s Wall was built by the Romans around AD 122.');

  // Year 3 Autumn history: Stone Age to Iron Age.
  var SA = 'Stone Age to Iron Age';
  sq(SA, 'Which came first?', ['the Stone Age', 'the Bronze Age', 'the Iron Age'], 'People used stone tools before they learned to use metal.', 'First came the Stone Age, then the Bronze Age, then the Iron Age.');
  sq(SA, 'Which came last?', ['the Iron Age', 'the Stone Age', 'the Bronze Age'], 'Iron is harder to make than bronze.', 'The order is Stone Age, Bronze Age, then Iron Age.');
  sq(SA, 'Bronze is made by mixing copper and ___.', ['tin', 'iron', 'gold', 'salt'], 'It is a light grey metal.', 'Bronze is a mix of copper and tin.');
  sq(SA, 'People who moved around hunting animals and gathering plants were called ___.', ['hunter-gatherers', 'farmers', 'knights', 'miners'], 'They hunted and they gathered.', 'Early Stone Age people were hunter-gatherers.');
  sq(SA, 'In the New Stone Age, people in Britain started to ___.', ['farm', 'use iron', 'build castles', 'drive carts'], 'They began to grow crops and keep animals.', 'In the New Stone Age (Neolithic), people began farming and settling in one place.');
  sq(SA, 'Why was flint so useful in the Stone Age?', ['It can be chipped into sharp tools', 'It is soft like clay', 'It floats on water', 'It glows in the dark'], 'Think about cutting and scraping.', 'Flint breaks into sharp edges, so it made good axes, knives and arrowheads.');
  sq(SA, 'Chipping flint to make a tool is called ___.', ['knapping', 'napping', 'knitting', 'kneading'], 'It starts with a silent k.', 'Making flint tools by chipping is called knapping.');
  sq(SA, 'Stonehenge\'s bluestones were brought all the way from ___.', ['Wales', 'France', 'London', 'Ireland'], 'It is a country next to England.', 'The bluestones came from the Preseli Hills in Wales.');
  sq(SA, 'Stonehenge was started about how long ago?', ['5,000 years ago', '50 years ago', '500 years ago', '50,000 years ago'], 'It is very, very old, but not the oldest thing ever.', 'Building began about 5,000 years ago, in the New Stone Age.');
  sq(SA, 'Iron Age forts built on the tops of hills are called ___.', ['hill forts', 'sky castles', 'tree houses', 'lighthouses'], 'The clue is where they were built.', 'Hill forts were on hilltops so people could see enemies coming.');
  sq(SA, 'Maiden Castle, one of the biggest Iron Age hill forts, is in ___.', ['Dorset', 'London', 'Wales', 'Scotland'], 'It is in the south of England.', 'Maiden Castle is in Dorset.');
  sq(SA, 'Wattle and daub walls are made from ___.', ['woven sticks and mud', 'bricks and cement', 'glass and metal', 'stone blocks'], 'Wattle is woven, daub is sticky.', 'Wattle is woven sticks; daub is a mix of mud, straw and dung spread over it.');
  sq(SA, 'Iron Age people lived in groups called ___.', ['tribes', 'teams', 'clubs', 'classes'], 'Each group had its own leader and land.', 'Iron Age Britain was made up of many tribes.');
  sq(SA, 'Stone Age artists painted animals on ___ walls.', ['cave', 'castle', 'school', 'glass'], 'They lived and sheltered in them.', 'Cave paintings show animals such as deer, horses and mammoths.');
  sq(SA, 'Stone Age paint was made from ___.', ['crushed rocks and charcoal', 'felt-tip pens', 'plastic', 'chocolate'], 'They used things found in nature.', 'They ground up coloured rocks and charcoal and mixed them with fat or water.');
  sq(SA, 'At Skara Brae, the beds and shelves were made of ___.', ['stone', 'plastic', 'metal', 'glass'], 'There were few trees on Orkney.', 'The furniture at Skara Brae was built from stone slabs.');
  sq(SA, 'How was Skara Brae uncovered in 1850?', ['A storm blew away the sand', 'A volcano erupted', 'Robots dug it up', 'A river washed it clean'], 'Think about wild weather.', 'A great storm stripped away the sand that had buried it.');
  sq(SA, 'Which giant animal did Stone Age hunters hunt?', ['the woolly mammoth', 'the elephant', 'the giraffe', 'the polar bear'], 'It was big and hairy.', 'Hunters in the Old Stone Age hunted woolly mammoths.');
  sq(SA, 'Bronze tools were better than stone tools because they ___.', ['were stronger and could be made sharper', 'were lighter than feathers', 'never got dirty', 'were invisible'], 'Think about cutting.', 'Bronze could be shaped in moulds and sharpened, and it did not shatter like stone.');
  sq(SA, 'A roundhouse roof was usually made of ___.', ['thatch (straw or reeds)', 'tiles', 'glass', 'metal'], 'It is the same material as some old cottages.', 'Roundhouses had thatched roofs of straw or reeds.');
  sq(SA, 'A quern stone was used to ___.', ['grind grain into flour', 'make fire', 'build walls', 'catch fish'], 'Farmers needed flour for bread.', 'Querns were heavy stones for grinding grain into flour.');

  // Year 3 Autumn geography: The UK.
  var UK = 'UK geography';
  sq(UK, 'How many countries make up the United Kingdom?', ['4', '2', '3', '5'], 'England, Scotland, Wales and...', 'England, Scotland, Wales and Northern Ireland: 4 countries.');
  sq(UK, 'Which country of the UK is the biggest?', ['England', 'Scotland', 'Wales', 'Northern Ireland'], 'It is also the country with the most people.', 'England is the largest country in the UK.');
  sq(UK, 'Which of these is a county?', ['Kent', 'London Eye', 'the Thames', 'Ben Nevis'], 'A county is an area of a country with its own name.', 'Kent is a county in the south-east of England.');
  sq(UK, 'Which county is known as "the Garden of England"?', ['Kent', 'Cornwall', 'Yorkshire', 'Cumbria'], 'It is famous for its orchards and hop gardens.', 'Kent is called the Garden of England because of its farms and orchards.');
  sq(UK, 'Which river flows through London?', ['the Thames', 'the Severn', 'the Nile', 'the Mersey'], 'Tower Bridge crosses it.', 'The River Thames flows through London.');
  sq(UK, 'What is the highest mountain in England?', ['Scafell Pike', 'Ben Nevis', 'Snowdon', 'Everest'], 'It is in the Lake District.', 'Scafell Pike, in the Lake District, is the highest mountain in England.');
  sq(UK, 'What is the highest mountain in Wales?', ['Snowdon (Yr Wyddfa)', 'Ben Nevis', 'Scafell Pike', 'Box Hill'], 'It is in Snowdonia.', 'Snowdon, or Yr Wyddfa in Welsh, is the highest mountain in Wales.');
  sq(UK, 'The Pennines are a long line of ___ in the north of England.', ['hills', 'lakes', 'cities', 'rivers'], 'They are sometimes called the backbone of England.', 'The Pennines are a range of hills, nicknamed the backbone of England.');
  sq(UK, 'Which sea is to the east of England?', ['the North Sea', 'the Irish Sea', 'the Red Sea', 'the Dead Sea'], 'It is between England and Norway.', 'The North Sea lies to the east of England.');
  sq(UK, 'Which sea is between Great Britain and Ireland?', ['the Irish Sea', 'the North Sea', 'the Black Sea', 'the Baltic Sea'], 'The clue is in the name.', 'The Irish Sea separates Great Britain and Ireland.');
  sq(UK, 'The stretch of sea between England and France is called the ___.', ['English Channel', 'Thames', 'Atlantic', 'North Pole'], 'Ferries and the tunnel cross it.', 'The English Channel separates England and France.');
  sq(UK, 'Which is the largest city in the UK?', ['London', 'Manchester', 'Birmingham', 'Cardiff'], 'It is also the capital.', 'London has the most people of any UK city.');
  sq(UK, 'Birmingham is a big city in which part of England?', ['the Midlands', 'the far south-west', 'the Lake District', 'Kent'], 'It is near the middle of England.', 'Birmingham is in the West Midlands.');
  sq(UK, 'Land used for growing crops and keeping animals is called ___ land.', ['farm', 'city', 'factory', 'beach'], 'Farmers work there.', 'Farmland is used for crops and animals.');
  sq(UK, 'Which of these is a human feature, made by people?', ['a motorway', 'a mountain', 'a river', 'a cliff'], 'Physical features are natural; human features are built.', 'A motorway is built by people, so it is a human feature.');
  sq(UK, 'Which of these is a physical feature, made by nature?', ['a valley', 'a bridge', 'a school', 'a car park'], 'Nature made it, not people.', 'A valley is a natural, physical feature.');
  sq(UK, 'Cornwall is in which part of England?', ['the south-west', 'the north-east', 'the Midlands', 'the far north'], 'It sticks out into the sea at the bottom left of England.', 'Cornwall is in the south-west of England.');
  sq(UK, 'What is the largest lake in England?', ['Windermere', 'Loch Ness', 'Lake Victoria', 'the Serpentine'], 'It is in the Lake District.', 'Windermere, in the Lake District, is England\'s largest lake.');

  // Later terms: Romans (Spring) and Ancient Egypt (Summer) stay hidden until then.
  S.forEach(function (q) {
    if (/Egypt|pharaoh|pyramid|hieroglyph|the Nile/i.test(q.prompt + q.options.join(' ')) && q.topic === 'History') q.term = 4;
    else if (/Roman|Hadrian/.test(q.prompt) && q.topic === 'History') q.term = 2;
    else if (q.topic === 'History') q.topic = SA;
  });

  TOL.BANK = E.concat(S);

  // Reading stories with a Stone Age to Iron Age flavour (Autumn).
  [
    { title: 'The Cave Painting Room', s: ['Behind a heavy curtain, {name} found a room that looked just like a cave.', 'The walls were covered in paintings of deer, horses and a huge woolly mammoth.', 'Captain Cog explained that Stone Age people made paint from crushed rocks, charcoal and animal fat.', 'They painted by the flickering light of fires and simple lamps.', 'Some cave paintings are more than 15,000 years old!'],
      q: [['What was the paint made from?', ['crushed rocks, charcoal and animal fat', 'felt-tip pens', 'melted crayons', 'paint from a shop'], 2], ['Which huge animal was painted on the wall?', ['a woolly mammoth', 'an elephant', 'a lion', 'a whale'], 1]] },
    { title: 'The Time Window', s: ['In the Star Gallery there is a round window that shows the past.', '{name} peeped through and saw a village of stone houses on an island in Scotland.', 'This was Skara Brae, built about 5,000 years ago.', 'Inside each house were beds, shelves and a fireplace, all made of stone.', 'A great storm in 1850 blew away the sand and uncovered the village.'],
      q: [['What were the beds and shelves made of?', ['stone', 'wood', 'plastic', 'straw'], 3], ['How was the village uncovered?', ['A great storm blew away the sand', 'Robots dug it up', 'A volcano erupted', 'A river washed it clean'], 4]] },
    { title: 'Gizmo the Flint Knapper', s: ['Gizmo the robot wanted to make a tool the Stone Age way.', 'He picked up a shiny lump of flint and tapped it with a hard stone.', 'Sharp flakes chipped off, and slowly a hand axe appeared.', 'This careful chipping is called knapping.', '"Stone Age people were very skilful," beeped Gizmo, holding up his axe.'],
      q: [['What did Gizmo use to tap the flint?', ['a hard stone', 'a hammer', 'a spoon', 'his foot'], 1], ['What is the careful chipping called?', ['knapping', 'napping', 'painting', 'weaving'], 3]] },
    { title: 'The First Farmers', s: ['Long ago, people moved from place to place, hunting animals and gathering berries.', 'In the New Stone Age, people in Britain began to farm.', 'They planted wheat and barley and kept sheep, cows and pigs.', 'Because farmers stayed in one place, they built homes that lasted for years.', 'Nell the gardener robot thinks farming was the best idea ever.'],
      q: [['What did people do before farming?', ['hunted animals and gathered berries', 'built cities', 'drove cars', 'went to school'], 0], ['Why did farmers build homes that lasted?', ['They stayed in one place', 'They were bored', 'It was always raining', 'The robots told them to'], 3]] },
    { title: 'The Stonehenge Model', s: ['On the puzzle shelf sits a tiny model of Stonehenge.', 'The real Stonehenge stands in Wiltshire and was started about 5,000 years ago.', 'Some of its stones, called bluestones, were carried all the way from Wales.', 'On the longest day of summer, the sun rises in line with the stones.', 'Nobody knows for certain why it was built, which makes it a wonderful mystery.'],
      q: [['Where were the bluestones carried from?', ['Wales', 'France', 'London', 'Scotland'], 2], ['When does the sun rise in line with the stones?', ['on the longest day of summer', 'every Monday', 'at midnight', 'on the first day of school'], 3]] },
    { title: 'Shiny Bronze', s: ['In the Gear Room, {name} found a box of shiny, golden-brown tools.', '"These are made of bronze," said Captain Cog.', '"Bronze is made by mixing two metals, copper and tin."', 'In the Bronze Age, people melted the metals and poured them into moulds.', 'Bronze tools were stronger than stone and could be made sharper.'],
      q: [['Which two metals make bronze?', ['copper and tin', 'gold and silver', 'iron and steel', 'tin and gold'], 2], ['How were bronze tools made?', ['Melted metal was poured into moulds', 'They were carved from wood', 'They were painted', 'They grew on trees'], 3]] },
    { title: 'Bolt\'s Roundhouse', s: ['Bolt the robot built a model of an Iron Age roundhouse.', 'Its walls were made of woven sticks covered in mud and straw, called wattle and daub.', 'The roof was thatched and shaped like a big pointy hat.', 'A fire in the middle kept the family warm, and the smoke drifted out through the thatch.', 'Bolt was so proud that he put a tiny sheep outside the door.'],
      q: [['What is wattle and daub?', ['woven sticks covered in mud and straw', 'bricks and cement', 'glass and metal', 'wood and nails'], 1], ['Where was the fire?', ['in the middle', 'outside', 'on the roof', 'under the floor'], 3]] },
    { title: 'The Hill Fort', s: ['From the Cloud Balcony, {name} could see a model of a hill fort.', 'Iron Age tribes built forts on the tops of hills so they could see enemies coming.', 'They dug deep ditches and built high banks of earth all around.', 'Maiden Castle in Dorset is one of the biggest hill forts in Britain.', 'Inside the walls were roundhouses, animal pens and stores of grain.'],
      q: [['Why were forts built on hills?', ['to see enemies coming', 'to be near the sea', 'to keep cool', 'to grow flowers'], 1], ['Which hill fort is one of the biggest in Britain?', ['Maiden Castle', 'Windsor Castle', 'Edinburgh Castle', 'Big Ben'], 3]] }
  ].forEach(function (P) { P.term = 0; TOL.PASSAGES.push(P); });

  /* ---------- Rewards ---------- */
  TOL.ITEMS = {
    hat_explorer: { slot: 'hat', name: 'Explorer hat', color: '#A47148' },
    hat_wizard:   { slot: 'hat', name: 'Wizard hat', color: '#7C3AED' },
    hat_flowers:  { slot: 'hat', name: 'Flower crown', color: '#F472B6' },
    hat_cap:      { slot: 'hat', name: 'Lumen cap', color: '#2563EB' },
    glasses_round:{ slot: 'glasses', name: 'Round glasses', color: '#1F2A44' },
    glasses_star: { slot: 'glasses', name: 'Star glasses', color: '#F59E0B' },
    cape_red:     { slot: 'cape', name: 'Red cape', color: '#E11D48' },
    cape_star:    { slot: 'cape', name: 'Starry cape', color: '#4338CA' },
    cape_glow:    { slot: 'cape', name: 'Glow cape', color: '#FACC15' },
    shoes_gold:   { slot: 'shoes', name: 'Golden boots', color: '#EAB308' },
    shoes_green:  { slot: 'shoes', name: 'Frog wellies', color: '#22C55E' },
    pet_fox:      { slot: 'pet', name: 'Fox cub', color: '#F97316' },
    pet_owl:      { slot: 'pet', name: 'Owlet', color: '#A16207' },
    pet_dragon:   { slot: 'pet', name: 'Tiny dragon', color: '#14B8A6' },
    pet_cat:      { slot: 'pet', name: 'Kitten', color: '#FB923C' },
    pet_puppy:    { slot: 'pet', name: 'Puppy', color: '#A16207' },
    pet_penguin:  { slot: 'pet', name: 'Penguin', color: '#1F2A44' },
    pet_robodog:  { slot: 'pet', name: 'Robot dog', color: '#94A3B8' },
    pet_bunny:    { slot: 'pet', name: 'Bunny', color: '#F9A8D4' },
    hand_wand:      { slot: 'hand', name: 'Magic wand', color: '#7C3AED' },
    hand_football:  { slot: 'hand', name: 'Football', color: '#1F2A44' },
    hand_guitar:    { slot: 'hand', name: 'Guitar', color: '#EA580C' },
    hand_balloon:   { slot: 'hand', name: 'Balloon', color: '#F43F5E' },
    hand_kite:      { slot: 'hand', name: 'Kite', color: '#3B82F6' },
    hand_umbrella:  { slot: 'hand', name: 'Rainbow umbrella', color: '#22C55E' },
    hand_magnifier: { slot: 'hand', name: 'Magnifying glass', color: '#0EA5E9' },
    hand_teddy:     { slot: 'hand', name: 'Teddy bear', color: '#B45309' },
    hand_lantern:   { slot: 'hand', name: 'Little lantern', color: '#FACC15' }
  };

  TOL.STICKERS = [
    { id: 'lantern', name: 'Lantern', color: '#F59E0B' }, { id: 'key', name: 'Golden key', color: '#EAB308' },
    { id: 'moon', name: 'Moon', color: '#6366F1' }, { id: 'star', name: 'Star', color: '#FACC15' },
    { id: 'cog', name: 'Cog', color: '#64748B' }, { id: 'book', name: 'Book', color: '#B45309' },
    { id: 'cloud', name: 'Cloud', color: '#38BDF8' }, { id: 'heart', name: 'Heart', color: '#F43F5E' },
    { id: 'leaf', name: 'Leaf', color: '#22C55E' }, { id: 'map', name: 'Map', color: '#D97706' },
    { id: 'gem', name: 'Gem', color: '#A855F7' }, { id: 'sun', name: 'Sun', color: '#F97316' },
    { id: 'rocket', name: 'Rocket', color: '#EF4444' }, { id: 'shell', name: 'Shell', color: '#FB7185' },
    { id: 'crown', name: 'Crown', color: '#CA8A04' }, { id: 'rainbow', name: 'Rainbow', color: '#EC4899' },
    { id: 'tower', name: 'Tower', color: '#0EA5E9' }, { id: 'feather', name: 'Feather', color: '#14B8A6' },
    { id: 'snow', name: 'Snowflake', color: '#60A5FA' }, { id: 'bolt', name: 'Spark', color: '#EAB308' },
    { id: 'music', name: 'Music note', color: '#8B5CF6' }, { id: 'fish', name: 'Fish', color: '#06B6D4' },
    { id: 'flower', name: 'Flower', color: '#E879F9' }, { id: 'compass', name: 'Compass', color: '#0D9488' }
  ];

  // Fixed reward order: box N always gives REWARD_ORDER[N] plus a sticker, so nothing feels like a gamble.
  TOL.REWARD_ORDER = [
    { item: 'hat_explorer' }, { memory: 0 }, { item: 'pet_fox' }, { hints: 2 }, { item: 'glasses_round' }, { memory: 1 },
    { item: 'cape_red' }, { memory: 2 }, { item: 'hat_wizard' }, { hints: 2 }, { item: 'shoes_gold' }, { memory: 3 },
    { item: 'hand_wand' }, { item: 'pet_owl' }, { item: 'cape_star' }, { memory: 4 }, { item: 'hand_football' }, { item: 'hat_flowers' },
    { hints: 2 }, { item: 'pet_cat' }, { item: 'hand_guitar' }, { memory: 5 }, { item: 'glasses_star' }, { item: 'pet_dragon' },
    { item: 'hand_balloon' }, { item: 'shoes_green' }, { memory: 6 }, { item: 'pet_puppy' }, { item: 'hand_kite' }, { hints: 2 },
    { item: 'hat_cap' }, { memory: 7 }, { item: 'pet_penguin' }, { item: 'hand_umbrella' }, { hints: 2 }, { item: 'hand_magnifier' },
    { memory: 8 }, { item: 'pet_robodog' }, { item: 'hand_teddy' }, { hints: 2 }, { memory: 9 }, { item: 'pet_bunny' },
    { item: 'hand_lantern' }, { hints: 2 }
  ];

  TOL.MEMORIES = [
    'You remember a letter with a golden seal. It said: "Come to the Tower of Lumen. Bring your curiosity."',
    'You remember climbing into a hot-air balloon shaped like a light bulb, and clouds rushing past.',
    'You remember a kind voice: "The tower\'s lights are fading. Only a clever explorer can wake them."',
    'You remember round golden spectacles, slightly crooked, and a smile behind them. Professor Quill!',
    'You remember Captain Cog waving at you from the tower gate, holding a tiny key.',
    'You remember falling asleep on a soft cloud cushion while the lanterns hummed a lullaby.',
    'You remember a map with a staircase drawn all the way to the roof, and one word at the top: KEEPER.',
    'You remember Professor Quill saying: "Every answer you find makes the tower glow a little brighter."',
    'You remember a golden door at the very top of the tower, with your own name carved on it.',
    'You remember why you came. Professor Quill needs a new Keeper of the Tower... and she chose you.'
  ];

  TOL.TITLES = [
    { at: 0, name: 'Apprentice' }, { at: 800, name: 'Explorer' }, { at: 1800, name: 'Pathfinder' },
    { at: 3000, name: 'Lightbringer', item: 'cape_glow' }, { at: 5000, name: 'Keeper' }
  ];

  TOL.ROOM_NAMES = ['The Lantern Hall', 'The Map Room', 'The Clockwork Kitchen', 'The Echo Corridor', 'The Garden Room',
    'The Quiet Library', 'The Star Gallery', 'The Weather Room', 'The Singing Stairs', 'The Laundry Loft', 'The Telescope Nook',
    'The Puzzle Workshop', 'The Painting Room', 'The Kettle Corner', 'The Cloud Balcony', 'The Gear Room', 'The Feather Hall',
    'The Bubble Room', 'The Paper Plane Perch', 'The Music Box Room', 'The Moonlight Study', 'The Rainbow Pantry', 'The Snow Globe Room'];

  TOL.SKINS = ['#F9D9B8', '#EBB58A', '#C68A5A', '#8D5A3A', '#5C3A24'];
  TOL.HAIR_COLOURS = ['#2B1B10', '#7C3F1D', '#D4A04A', '#E2683C', '#1F2A44'];
  TOL.HAIR_STYLES = ['short', 'long', 'curly', 'bunches'];
  TOL.OUTFITS = ['#FACC15', '#3B82F6', '#EC4899', '#22C55E', '#A855F7', '#F97316'];
})();
