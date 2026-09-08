import { VisualStep, VisualMaterial } from '../types';

export interface GameVisualProfile {
  visualMaterials: VisualMaterial[];
  visualSteps: VisualStep[];
  shortBondTip: string;
  shortRewardTip: string;
  speechScript: string[]; // 3 spoken lines for Audio Narration
}

export const VISUAL_GAME_PROFILES: Record<string, GameVisualProfile> = {
  'snuffle-mat-dig': {
    visualMaterials: [
      { icon: '🛏️', label: 'Snuffle Mat or Towel' },
      { icon: '🎾', label: 'Toy / Mini Squeaker' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🛏️ ⬇️ 🎾',
        action: '1. Bury the Loot',
        detail: 'Tuck toy into fabric folds',
        cue: 'Hide deep',
      },
      {
        stepNumber: 2,
        icon: '👃 🐕 💨',
        action: '2. Say "Find It!"',
        detail: 'Let nose do all work',
        cue: '"Find it!"',
      },
      {
        stepNumber: 3,
        icon: '👏 🎉 🐕',
        action: '3. Cheer & Clap!',
        detail: 'Soft praise for every find',
        cue: 'Big happy cuddle',
      },
    ],
    shortBondTip: '🤝 Cheer together on the floor like teammates!',
    shortRewardTip: '🎾 Squeak favorite toy when discovered!',
    speechScript: [
      'Step 1: Tuck the toy deep into the fabric folds.',
      'Step 2: Point and say: Find it! Let your pup sniff.',
      'Step 3: Celebrate every discovery with happy cheers!',
    ],
  },

  'box-sniff-outs': {
    visualMaterials: [
      { icon: '📦', label: '3 Cardboard Boxes' },
      { icon: '🧻', label: 'Crumpled Scrap Paper' },
      { icon: '🎾', label: 'Prized Squeaky Toy' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '📦 ⬇️ 🎾',
        action: '1. Scatter Boxes',
        detail: 'Hide toy under paper inside one box',
        cue: 'Leave flaps open',
      },
      {
        stepNumber: 2,
        icon: '🐕 👃 📦',
        action: '2. Release Detective',
        detail: 'Pup sniffs from box to box',
        cue: '"Where is it?"',
      },
      {
        stepNumber: 3,
        icon: '💥 🎊 🏆',
        action: '3. Jackpot Party!',
        detail: 'Rip paper and celebrate wildly',
        cue: 'High energy praise!',
      },
    ],
    shortBondTip: '❤️ Sit on the floor right beside the boxes!',
    shortRewardTip: '⚡ Instant squeaky tug party when found!',
    speechScript: [
      'Step 1: Scatter delivery boxes. Hide a toy in one box under paper.',
      'Step 2: Let your pup investigate and sniff the boxes.',
      'Step 3: When they find the right box, celebrate with a victory party!',
    ],
  },

  'muffin-tin-scent-puzzle': {
    visualMaterials: [
      { icon: '🧁', label: 'Muffin Baking Tin' },
      { icon: '🎾', label: '6 Tennis Balls' },
      { icon: '⭐', label: 'Toy / Dry Scent' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🧁 ⬇️ 🎾',
        action: '1. Load & Cover',
        detail: 'Place prize in cups, cover with balls',
        cue: 'All cups look same',
      },
      {
        stepNumber: 2,
        icon: '🐾 👃 🎾',
        action: '2. Knock the Balls',
        detail: 'Pup uses nose or paw to toss ball',
        cue: '"Solve it!"',
      },
      {
        stepNumber: 3,
        icon: '🥇 🐕 ❤️',
        action: '3. Reset & Cheer',
        detail: 'Shuffle positions for round 2',
        cue: 'Gentle chin scratches',
      },
    ],
    shortBondTip: '🤝 Hold the tray steady while making fun eye contact!',
    shortRewardTip: '🎾 Use their favorite ball right in the muffin cup!',
    speechScript: [
      'Step 1: Put the prize in muffin cups, then cover with tennis balls.',
      'Step 2: Place it down. Let your dog nose the balls out of the way.',
      'Step 3: High five, reset, and play another round!',
    ],
  },

  'the-hidden-trail-scavenger': {
    visualMaterials: [
      { icon: '🛋️', label: 'Living Room Furniture' },
      { icon: '🧸', label: 'Squeaky Plush Toy' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🐾 🙈 🛋️',
        action: '1. Pup Waits / Stays',
        detail: 'Rub toy along carpet, hide behind sofa',
        cue: 'Sneaky trail',
      },
      {
        stepNumber: 2,
        icon: '👃 👣 🐕',
        action: '2. Call "Search!"',
        detail: 'Give hot & cold voice hints',
        cue: 'Whisper when close',
      },
      {
        stepNumber: 3,
        icon: '🎉 🪢 🐶',
        action: '3. Victory Tug!',
        detail: 'Immediate lively tug of war',
        cue: 'Big victory dance',
      },
    ],
    shortBondTip: '🗣️ Use your voice as a playful hot-and-cold compass!',
    shortRewardTip: '🪢 Reward with an instant 30-second tug game!',
    speechScript: [
      'Step 1: Have your dog wait while you drag a toy along the floor and hide it.',
      'Step 2: Say search! Use your voice to guide them warmer or colder.',
      'Step 3: When they find it, launch into a joyful tug game!',
    ],
  },

  'cup-shuffle': {
    visualMaterials: [
      { icon: '🥤', label: '3 Plastic Cups' },
      { icon: '🎾', label: '1 Ball or Toy' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🥤 ⬇️ 🎾',
        action: '1. Cover the Prize',
        detail: 'Pop cup upside down over toy',
        cue: 'Pup watches closely',
      },
      {
        stepNumber: 2,
        icon: '🔄 🥤 🥤',
        action: '2. Slide & Shuffle',
        detail: 'Swap cup spots slowly on the floor',
        cue: '"Which one is it?"',
      },
      {
        stepNumber: 3,
        icon: '🐾 🥤 🏆',
        action: '3. Paw to Win!',
        detail: 'Lift cup when pawed & celebrate',
        cue: 'Dramatic victory lift',
      },
    ],
    shortBondTip: '🎩 Narrate dramatically like a funny carnival host!',
    shortRewardTip: '⚡ Immediate toss of the ball when guessed right!',
    speechScript: [
      'Step 1: Put the ball under one cup in front of your dog.',
      'Step 2: Slowly slide and swap the cups across the floor.',
      'Step 3: When your pup taps the winning cup, lift it with a huge cheer!',
    ],
  },

  'frozen-kong-fortress': {
    visualMaterials: [
      { icon: '🦴', label: 'Rubber Kong or Lick Mat' },
      { icon: '🍌', label: 'Mashed Banana / Broth' },
      { icon: '🧊', label: 'Freezer (Optional)' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🦴 ⬇️ 🍌',
        action: '1. Pack the Puzzle',
        detail: 'Fill inside with tasty layers',
        cue: 'Freeze for extra calm',
      },
      {
        stepNumber: 2,
        icon: '🤝 👅 🐕',
        action: '2. Hold & Start',
        detail: 'Hold steady for first few licks',
        cue: 'Calm breathing',
      },
      {
        stepNumber: 3,
        icon: '😌 💤 ❤️',
        action: '3. Happy Zen Dog',
        detail: 'Releases natural relaxation hormones',
        cue: 'Soft petting',
      },
    ],
    shortBondTip: '🤝 Sit beside them and hold the toy gently at first!',
    shortRewardTip: '🧊 Freezing broth cubes makes it 100% treat-free fun!',
    speechScript: [
      'Step 1: Stuff the toy with healthy fillings or broth ice.',
      'Step 2: Hold it steady while your pup gets the first licks.',
      'Step 3: Relax together as licking triggers natural canine calm.',
    ],
  },

  'towel-burrito-unroll': {
    visualMaterials: [
      { icon: '🧣', label: '1 Clean Bath Towel' },
      { icon: '🧸', label: 'Rope Toy or Ball' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🧣 🌀 🧸',
        action: '1. Roll the Burrito',
        detail: 'Roll towel loosely with toy inside',
        cue: 'Roll loose on round 1',
      },
      {
        stepNumber: 2,
        icon: '👃 ➡️ 🧣',
        action: '2. Nose Unroll',
        detail: 'Pup pushes towel roll with snout',
        cue: '"Unroll it!"',
      },
      {
        stepNumber: 3,
        icon: '🎉 🐕 🐾',
        action: '3. Core Discovery!',
        detail: 'Burrito opens to reveal jackpot',
        cue: 'Full body wiggles',
      },
    ],
    shortBondTip: '🎳 Cheer every roll like getting a bowling strike!',
    shortRewardTip: '🪢 Tug the rope toy the second it unravels!',
    speechScript: [
      'Step 1: Place a toy in a bath towel and roll it loosely like a burrito.',
      'Step 2: Put it on the floor. Let your dog boop and unroll it with their nose.',
      'Step 3: Cheer with excitement when the towel unrolls to the center!',
    ],
  },

  'bottle-spinner-contraption': {
    visualMaterials: [
      { icon: '🍾', label: 'Plastic Water Bottle' },
      { icon: '🥢', label: 'Wooden Stick / Dowel' },
      { icon: '📦', label: '2 Support Chairs/Boxes' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🍾 🥢 📦',
        action: '1. Hang the Bottle',
        detail: 'Thread stick through bottle to spin',
        cue: 'Cap removed safely',
      },
      {
        stepNumber: 2,
        icon: '🐾 🔄 🍾',
        action: '2. Bat with Paw',
        detail: 'Pup slaps bottle to spin upside down',
        cue: '"Spin it!"',
      },
      {
        stepNumber: 3,
        icon: '💥 🎁 🐕',
        action: '3. Payload Drops!',
        detail: 'Contents tumble onto floor',
        cue: 'Massive victory cuddle',
      },
    ],
    shortBondTip: '👉 Point to the bottle encouragingly: "You got this!"',
    shortRewardTip: '🔔 Put jingle bells or bouncy balls inside for great sound!',
    speechScript: [
      'Step 1: Put a stick through a plastic bottle so it spins between two chairs.',
      'Step 2: Drop small bouncy balls or kibble inside.',
      'Step 3: Show your pup how batting the bottle flips it and drops the prizes!',
    ],
  },

  'broomstick-limbo-hurdles': {
    visualMaterials: [
      { icon: '🧹', label: '1 Light Broomstick' },
      { icon: '📚', label: '4 Thick Books or Yoga Blocks' },
      { icon: '🎾', label: 'Target Toy' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🧹 📚 ⬇️',
        action: '1. Set Low Hurdle',
        detail: 'Rest stick on books 8 cm off floor',
        cue: 'Must fall easily if tapped',
      },
      {
        stepNumber: 2,
        icon: '🏃 🐕 ⬆️',
        action: '2. Call "Hop Over!"',
        detail: 'Lead pup over bar with your body',
        cue: '"Hop!"',
      },
      {
        stepNumber: 3,
        icon: '⚡ 🏅 🐕',
        action: '3. Limbo or Zoomie!',
        detail: 'Hold high for ducking or raise for jumping',
        cue: 'Olympic champion cheers',
      },
    ],
    shortBondTip: '🏃 Jump over the broomstick WITH them like pack runners!',
    shortRewardTip: '⚡ Wiggle a tug rope on the far side to invite big hops!',
    speechScript: [
      'Step 1: Balance a light broomstick on a few books about 8 cm high.',
      'Step 2: Run beside your pup and shout: Hop! as they clear the bar.',
      'Step 3: Celebrate every leap like an Olympic steeplechase champion!',
    ],
  },

  'backyard-obstacle-dash': {
    visualMaterials: [
      { icon: '🛋️', label: '3 Couch Cushions' },
      { icon: '🧺', label: '1 Laundry Basket' },
      { icon: '🧸', label: 'Pacing Toy' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🛋️ ➡️ 🧺 ➡️ 🪑',
        action: '1. Build 3 Stations',
        detail: 'Station 1: Stepping stones. Station 2: Loop basket.',
        cue: 'Clear non-slip path',
      },
      {
        stepNumber: 2,
        icon: '🏃 🐕 💨',
        action: '2. Practice Lap',
        detail: 'Jog course together guiding each turn',
        cue: '"Step! Step! Turn!"',
      },
      {
        stepNumber: 3,
        icon: '⏱️ 🥇 🎊',
        action: '3. Speed Time Trial!',
        detail: 'Full tilt run side by side!',
        cue: 'Floor tumble cuddles',
      },
    ],
    shortBondTip: '🏃 Match their speed and laugh out loud as you dash!',
    shortRewardTip: '🧸 Electric 20-second tug session at the finish line!',
    speechScript: [
      'Step 1: Set out 3 cushions to step on and a basket to run around.',
      'Step 2: Walk the course together so your dog learns the loop.',
      'Step 3: Count down 3, 2, 1, DASH! Run full speed side-by-side!',
    ],
  },

  'hula-hoop-portal': {
    visualMaterials: [
      { icon: '⭕', label: '1 Plastic Hula Hoop' },
      { icon: '🎾', label: 'Favorite Toy' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '⭕ ⬇️ 🐕',
        action: '1. Touch Ground',
        detail: 'Hold hoop upright touching floor',
        cue: 'Keep hoop steady',
      },
      {
        stepNumber: 2,
        icon: '👉 ⭕ 🐕',
        action: '2. Say "Through!"',
        detail: 'Reach toy through center opening',
        cue: '"Step through!"',
      },
      {
        stepNumber: 3,
        icon: '🚀 ⭕ 🏆',
        action: '3. Airborne Leap!',
        detail: 'Lift hoop 8 cm for graceful jump',
        cue: 'Circus star applause',
      },
    ],
    shortBondTip: '😊 Frame your smiling face in the hoop when calling them!',
    shortRewardTip: '🎾 Toss ball straight through the center for them to catch!',
    speechScript: [
      'Step 1: Hold the hula hoop upright with the bottom touching the carpet.',
      'Step 2: Reach a toy through the hoop and call: Through!',
      'Step 3: Once they love it, lift the hoop 8 to 10 cm for an airborne leap!',
    ],
  },

  'weave-pole-slalom': {
    visualMaterials: [
      { icon: '🧴', label: '5 Water Bottles / Cones' },
      { icon: '🎾', label: 'Target Toy' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🧴 🧴 🧴 🧴',
        action: '1. Line Up 5 Poles',
        detail: 'Space 60 cm apart in a straight line',
        cue: 'Fill bottles with water',
      },
      {
        stepNumber: 2,
        icon: '〰️ 🐕 〰️',
        action: '2. Serpentine Weave',
        detail: 'Lure in smooth "S" wave curve',
        cue: '"In, out, in, out!"',
      },
      {
        stepNumber: 3,
        icon: '💨 ⚡ 🏆',
        action: '3. Flow & Release',
        detail: 'Speed up jog and celebrate at exit',
        cue: 'Victory sprint',
      },
    ],
    shortBondTip: '💃 Sway your shoulders in rhythm with their turns like dance partners!',
    shortRewardTip: '⚡ Instant chase sprint when they exit the last pole!',
    speechScript: [
      'Step 1: Line up 5 water bottles on the floor, spaced 60 cm apart.',
      'Step 2: Guide your dog in an S-curve: in, out, in, out.',
      'Step 3: Pick up speed and burst into a victory sprint at the end!',
    ],
  },

  'secret-blanket-burrito': {
    visualMaterials: [
      { icon: '🛏️', label: '1 Bed Sheet or Blanket' },
      { icon: '🪑', label: '2 Dining Chairs' },
      { icon: '🔦', label: 'Flashlight or Toy' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🛏️ 🪑 ⛺',
        action: '1. Drape the Tunnel',
        detail: 'Sheet forms gentle tent over chairs',
        cue: 'Open bright exits',
      },
      {
        stepNumber: 2,
        icon: '👀 🗣️ 🐕',
        action: '2. Call from Exit',
        detail: 'Peek in with huge smile: "Come find me!"',
        cue: '"Over here!"',
      },
      {
        stepNumber: 3,
        icon: '🚀 🎊 🫂',
        action: '3. Burst & Hug!',
        detail: 'Catch pup emerging in gentle bear hug',
        cue: 'Happy belly laughs',
      },
    ],
    shortBondTip: '😄 Giggle when their nose pushes the sheet out!',
    shortRewardTip: '🔦 Squeak toy and shine flashlight softly through tunnel!',
    speechScript: [
      'Step 1: Drape a bed sheet over two chairs to make a secret tunnel.',
      'Step 2: Peek through the exit and call your dog with a big smile.',
      'Step 3: Catch them in a joyful cuddle as they zoom through the fabric!',
    ],
  },

  'secret-sock-detective': {
    visualMaterials: [
      { icon: '🧦', label: '3 Clean Rolled Sock Balls' },
      { icon: '👃', label: '1 Worn Sock (Your Scent!)' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '🧦 👃 🐕',
        action: '1. Scent Imprint',
        detail: 'Pup sniffs your rolled sock ball',
        cue: '"My sock! Smell it!"',
      },
      {
        stepNumber: 2,
        icon: '🧦 ➡️ 🛋️ 🚪',
        action: '2. Hide 3 Socks',
        detail: 'Hide your sock & 2 decoy socks in room',
        cue: '"Find my sock!"',
      },
      {
        stepNumber: 3,
        icon: '🏆 🤝 🐶',
        action: '3. Trade & Praise',
        detail: 'Trade sock for chin scratches & hugs',
        cue: '"Thank you, Detective!"',
      },
    ],
    shortBondTip: '🤝 Thank them with gratitude instead of chasing to stop sock theft!',
    shortRewardTip: '❤️ Your personal human scent is their #1 prized scent!',
    speechScript: [
      'Step 1: Let your dog sniff your clean rolled sock.',
      'Step 2: Hide your sock and two decoy socks in different corners.',
      'Step 3: When your detective delivers your sock, trade with loving praise!',
    ],
  },
};

// Fallback generator if a custom game id is supplied
export function getVisualProfileForGame(gameId: string, title?: string): GameVisualProfile {
  if (VISUAL_GAME_PROFILES[gameId]) {
    return VISUAL_GAME_PROFILES[gameId];
  }

  return {
    visualMaterials: [
      { icon: '🎾', label: 'Favorite Toy' },
      { icon: '📦', label: 'Household Object' },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        icon: '📦 ⬇️ 🎾',
        action: '1. Set Up',
        detail: 'Arrange items on the floor',
      },
      {
        stepNumber: 2,
        icon: '🐕 👃 ⚡',
        action: '2. Ready, Set, Go!',
        detail: 'Guide pup with voice & gestures',
      },
      {
        stepNumber: 3,
        icon: '🎉 👏 🏆',
        action: '3. Huge Celebration!',
        detail: 'Cheer, high five, and cuddle',
      },
    ],
    shortBondTip: '❤️ Share the floor and cheer like proud teammates!',
    shortRewardTip: '🎾 Squeak their favorite toy when discovered!',
    speechScript: [
      'Step 1: Set up the play area on the floor.',
      'Step 2: Call your pup and guide them with enthusiasm.',
      'Step 3: Celebrate their effort with high-fives and cuddles!',
    ],
  };
}
