import { Game } from '../types';

export const GAMES_DATA: Game[] = [
  // CURIOSITY (4 Games)
  {
    id: 'snuffle-mat-dig',
    title: 'Snuffle Mat Treasure Dig',
    tagline: 'Unleash the ultimate 300-million scent receptor power!',
    category: 'curiosity',
    energyLevel: 'low',
    environment: 'indoor',
    skillBuilds: ['Olfactory Stimulation', 'Calm Focus', 'Stress Reduction'],
    durationMinutes: 8,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['sniffing', 'food', 'toys_fetch'],
    nonFoodAlternative: 'Hide tiny crinkly squeaker bits, cut fleece strips scented with dried herbs/lavender, or mini plushies instead of treats!',
    materials: ['A snuffle mat (or a rolled/folded plush blanket or bath towel)', 'Smelly dry treats or mini favorite soft toys'],
    steps: [
      {
        stepNumber: 1,
        title: 'Bury the loot',
        instruction: 'Tuck high-value rewards or mini squeakers deep within the fabric folds while your pup watches with anticipation.',
        proTip: 'Start with 2-3 pieces sitting on top so they understand the mission immediately.'
      },
      {
        stepNumber: 2,
        title: 'Release cue: "Find it!"',
        instruction: 'Point to the mat with a cheery "Find it!" and let their nose do the heavy lifting. Step back and give them space.',
        proTip: 'Resist the urge to help right away—their nose is 10,000x stronger than yours.'
      },
      {
        stepNumber: 3,
        title: 'The celebratory clap',
        instruction: 'When they excavate each hidden treasure, offer a joyful soft cheer or chin tickle without interrupting the sniff zone.',
        proTip: 'Sniffing lowers canine heart rates—expect a content, sleepy doggy afterwards!'
      }
    ],
    bondTip: 'Cheer them on with an animated whisper ("Oooh, what is in there?!"). You are their enthusiastic treasure-hunting teammate, not an examiner grading a test!',
    funnyQuote: 'Humans watch Netflix to unwind; dogs decode 84 scent storylines buried in a fleece rug.',
    illustrationKey: 'snuffle_mat'
  },
  {
    id: 'box-sniff-outs',
    title: 'Cardboard Box Sniff-Out',
    tagline: 'Russian nesting boxes meets canine detective squad.',
    category: 'curiosity',
    energyLevel: 'medium',
    environment: 'both',
    skillBuilds: ['Independent Scent Searching', 'Bravery & Exploration', 'Tactile Confidence'],
    durationMinutes: 10,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['sniffing', 'food', 'toys_fetch'],
    nonFoodAlternative: 'Place a vigorously rubbed tennis ball or squeaky toy inside that smells like excitement!',
    materials: ['3 to 5 clean cardboard delivery boxes of varying sizes', 'Scrap packing paper', 'Favorite rewards or toys'],
    steps: [
      {
        stepNumber: 1,
        title: 'Build the maze',
        instruction: 'Scatter empty delivery boxes on the floor. In just ONE or TWO boxes, tuck the reward under loosely crumpled paper.',
        proTip: 'Leave box flaps open at first; close them loosely once your dog is hooked.'
      },
      {
        stepNumber: 2,
        title: 'The mystery reveal',
        instruction: 'Let your dog explore the cardboard forest. Watch their tail wag furiously as the nose locks onto the winning box.',
        proTip: 'If your pup is hesitant of box crinkles, step in and hold the box steady together.'
      },
      {
        stepNumber: 3,
        title: 'Jackpot explosion',
        instruction: 'When they discover the right box, celebrate wildly! Allow them to happily rip or toss the paper if they love shredding.',
        proTip: 'Supervise to ensure paper is merely shredded, not snacked on.'
      }
    ],
    bondTip: 'Crouch on the floor beside the boxes! Lean in excitedly whenever they investigate a box. Sharing the floor puts you on eye-level and strengthens reciprocal trust.',
    funnyQuote: 'Amazon packages are great for humans, but for dogs, the empty cardboard box is the true five-star luxury gift.',
    illustrationKey: 'box_sniff'
  },
  {
    id: 'muffin-tin-scent-puzzle',
    title: 'Muffin Tin Scent Puzzle',
    tagline: '12 holes, 12 tennis balls, and one very determined detective.',
    category: 'curiosity',
    energyLevel: 'low',
    environment: 'indoor',
    skillBuilds: ['Fine Motor Coordination', 'Discrimination Sniffing', 'Impulse Control'],
    durationMinutes: 7,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['sniffing', 'toys_fetch', 'food'],
    nonFoodAlternative: 'Rub an extra stinky toy or scent drop into only 3 muffin wells, or use colorful pom-poms they love removing!',
    materials: ['Standard 6 or 12-cup muffin tin', '6 to 12 tennis balls (or plush toy balls)', 'Smelly treats or prized scented items'],
    steps: [
      {
        stepNumber: 1,
        title: 'Load the mystery cups',
        instruction: 'Drop treats or scented charms into 3 or 4 random muffin slots. Cover ALL slots with tennis balls so they look identical.',
        proTip: 'Show them you dropping one ball so they grasp the mechanism.'
      },
      {
        stepNumber: 2,
        title: 'Nose or paw removal',
        instruction: 'Place the tray down. Some dogs push balls with their snout, others paw them across the kitchen like air hockey pucks.',
        proTip: 'Cheer for any tennis ball knocked loose—every action is a learning win!'
      },
      {
        stepNumber: 3,
        title: 'Reset & shuffle',
        instruction: 'Switch which holes have treats while holding their attention. Repeat for 3 quick, stimulating rounds.',
        proTip: 'Keep sessions under 10 minutes so their brain stays fresh and eager.'
      }
    ],
    bondTip: 'Hold the tin steady with your hands while looking right into your dog\'s eyes with a conspiratorial grin. You\'re the game master and their co-pilot!',
    funnyQuote: 'They say you can\'t teach an old dog new tricks, but hand them 12 tennis balls on a muffin tin and watch Mensa apply.',
    illustrationKey: 'muffin_tin'
  },
  {
    id: 'the-hidden-trail-scavenger',
    title: 'The Living Room Scent Trail',
    tagline: 'Track the secret trail through the furniture wilderness.',
    category: 'curiosity',
    energyLevel: 'medium',
    environment: 'both',
    skillBuilds: ['Tracking Persistence', 'Spatial Memory', 'Confidence Building'],
    durationMinutes: 12,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['sniffing', 'chase_speed', 'toys_fetch'],
    nonFoodAlternative: 'Drag their favorite squeaker toy along the floor surface to create a physical scent trail leading to an elevated hiding spot!',
    materials: ['A favorite squeaker or scented reward', 'Living room furniture or garden bushes'],
    steps: [
      {
        stepNumber: 1,
        title: 'Wait & Wonder',
        instruction: 'Have a family member gently hold your dog (or practice a gentle "Stay") while you walk through the room rubbing the toy/treat on low spots.',
        proTip: 'Make theatrical footsteps and whisper dramatically to ramp up the anticipation!'
      },
      {
        stepNumber: 2,
        title: 'Release the Hound',
        instruction: 'Say "Seek!" and watch them lock their nose to the carpet, retracing your stealthy steps curve by curve.',
        proTip: 'Give warm/cold vocal cues: soft whispers when they are far, higher energy when they are close.'
      },
      {
        stepNumber: 3,
        title: 'Grand Finale Discovery',
        instruction: 'When they locate the prize under a chair cushion or behind a plant pot, burst into a victory party dance together!',
        proTip: 'Immediately follow up with a 30-second celebratory play or belly rub.'
      }
    ],
    bondTip: 'Act as the "hot/cold" compass! Use your voice pitch like a metal detector—warming up with thrilled giggles as their nose zeroes in on the hiding spot.',
    funnyQuote: 'A dog\'s nose has 50 times more scent receptors than humans. They basically smell in high-definition 4K Dolby Atmos.',
    illustrationKey: 'scent_trail'
  },

  // PROBLEM-SOLVING (4 Games)
  {
    id: 'cup-shuffle',
    title: 'The Great Cup Shuffle',
    tagline: 'The classic Vegas shell game, canine edition.',
    category: 'problem_solving',
    energyLevel: 'low',
    environment: 'indoor',
    skillBuilds: ['Visual Tracking', 'Critical Thinking', 'Patience & Focus'],
    durationMinutes: 8,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['food', 'toys_fetch', 'praise_affection'],
    nonFoodAlternative: 'Hide a miniature squeaker or their favorite bouncy ball under the cup—dogs can hear and smell the rubber easily!',
    materials: ['3 opaque plastic cups (or clean flower pots/tupperware)', 'High-value treat or mini ball'],
    steps: [
      {
        stepNumber: 1,
        title: 'The single-cup intro',
        instruction: 'Place one cup upside down over the prize. Teach your pup that lifting or knocking the cup yields glory.',
        proTip: 'Once they tip it over easily with nose or paw, bring in cup #2.'
      },
      {
        stepNumber: 2,
        title: 'The two-cup shuffle',
        instruction: 'Place two cups down. Hide the prize under one right in front of them. Slowly slide the cups to swap their positions.',
        proTip: 'Watch their ears and eyes track the prize cup. Ask: "Which one is it?!"'
      },
      {
        stepNumber: 3,
        title: 'The triple-cup grandmaster',
        instruction: 'Add the third cup! Slide them around in gentle arcs. When your dog paws or boops the winning cup, lift it with a victorious gasp!',
        proTip: 'Even if they guess wrong, lift the empty cup gently, show it\'s empty, and invite them to try the other one without frustration.'
      }
    ],
    bondTip: 'Narrate like a fast-talking carnival ringmaster! The comedic drama in your voice is what turns a plastic cup into an epic shared battle of wits.',
    funnyQuote: 'If your dog consistently wins this game, keep an eye on your car keys and credit cards.',
    illustrationKey: 'cup_shuffle'
  },
  {
    id: 'frozen-kong-fortress',
    title: 'The Kong / Lickie Brain Fortress',
    tagline: 'A puzzle disguised as an irresistible puzzle toy.',
    category: 'problem_solving',
    energyLevel: 'low',
    environment: 'both',
    skillBuilds: ['Long-term Problem Solving', 'Endorphin Lick Release', 'Independent Problem Solving'],
    durationMinutes: 15,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['food', 'sniffing', 'toys_fetch'],
    nonFoodAlternative: 'Stuff with soft fabric strips that have a toy tucked inside, or make ice cubes infused with safe beef or bone broth for hot day chewing!',
    materials: ['Rubber Kong or textured puzzle toy / Lick mat', 'Broth ice, plain Greek yogurt, banana mash, peanut butter or kibble', 'Chew stick or toy'],
    steps: [
      {
        stepNumber: 1,
        title: 'Layer the challenge',
        instruction: 'Create alternating layers: loose dry items near the opening, sticky pastes in the middle, and a frozen stopper at the bottom.',
        proTip: 'Freeze it for 2 hours to transform a 2-minute snack into a 20-minute mental workout.'
      },
      {
        stepNumber: 2,
        title: 'Present the trophy',
        instruction: 'Hold the toy while your pup gets the first few easy licks so they get the momentum going.',
        proTip: 'Licking activates the canine parasympathetic nervous system, releasing natural calming hormones.'
      },
      {
        stepNumber: 3,
        title: 'Tactical cheers',
        instruction: 'When they figure out how to bounce the rubber toy on the floor to dislodge stubborn inner bits, celebrate their engineering genius!',
        proTip: 'Dogs love showing off their prize—pet them and admire their technique.'
      }
    ],
    bondTip: 'Sit on the rug right beside them during the first 5 minutes. Hold one end of the toy gently while they work, turning it into a collaborative cooperative activity.',
    funnyQuote: 'Thirty minutes of intense licking burns more mental energy than a half-hour sprint around the block.',
    illustrationKey: 'frozen_kong'
  },
  {
    id: 'towel-burrito-unroll',
    title: 'The Towel Burrito Unroll',
    tagline: 'Can your pup decipher the sacred linen scroll?',
    category: 'problem_solving',
    energyLevel: 'medium',
    environment: 'indoor',
    skillBuilds: ['Nose-Boop Dexterity', 'Sequential Logic', 'Frustration Tolerance'],
    durationMinutes: 6,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['food', 'toys_fetch', 'sniffing'],
    nonFoodAlternative: 'Roll a favorite rope toy or squeaky hedgehog into the very center of the towel so they have to unroll it to reach playtime!',
    materials: ['1 regular bath towel or fleece blanket', 'Tug toy, squeaker, or kibble/treats'],
    steps: [
      {
        stepNumber: 1,
        title: 'Lay flat and seed',
        instruction: 'Lay the towel flat. Scatter treats or small toys along its length. Begin rolling the towel like a giant sushi roll or burrito.',
        proTip: 'Roll loosely on the first try. Tighten the roll as your dog becomes a master chef.'
      },
      {
        stepNumber: 2,
        title: 'The nose nudge',
        instruction: 'Place the rolled towel before your dog. Encourage them to boop and roll it with their snout or paw it open section by section.',
        proTip: 'If they get stuck, gently nudge open one fold to keep their curiosity ignited.'
      },
      {
        stepNumber: 3,
        title: 'The victory unravel',
        instruction: 'Watch the joyful frenzy as the towel completely unfolds to reveal the jackpot at the center core!',
        proTip: 'Toss the towel in the air like confetti for an extra burst of giggles.'
      }
    ],
    bondTip: 'Cheer each unroll like a bowling strike! "Push it, push it, YES!" Your vocal enthusiasm provides the rhythm and validation they crave.',
    funnyQuote: 'Every dog is secretly an archaeologist searching for ancient artifacts inside folded laundry.',
    illustrationKey: 'towel_burrito'
  },
  {
    id: 'bottle-spinner-contraption',
    title: 'The DIY Bottle Spinner',
    tagline: 'Gravity meets canine ingenuity in a simple flip.',
    category: 'problem_solving',
    energyLevel: 'medium',
    environment: 'both',
    skillBuilds: ['Mechanical Causality', 'Paw-Eye Coordination', 'Persistence'],
    durationMinutes: 10,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['food', 'toys_fetch', 'praise_affection'],
    nonFoodAlternative: 'Fill the bottle with small jingle bells or colorful bouncy balls that clatter excitedly and pop out when inverted!',
    materials: ['Empty clean plastic water bottle', 'Wooden dowel, smooth stick, or string/wire', 'Two chairs or shoeboxes to suspend it'],
    steps: [
      {
        stepNumber: 1,
        title: 'Suspend the bottle',
        instruction: 'Poke holes through the sides of the bottle and thread the dowel or string through so it spins freely like a rotisserie.',
        proTip: 'Remove the bottle cap and label completely for safety.'
      },
      {
        stepNumber: 2,
        title: 'Load the payload',
        instruction: 'Drop treats or lightweight bouncy balls inside. When the bottle is upright, nothing falls out; spin it upside down, and out they tumble!',
        proTip: 'Gently spin it once yourself to show how the magic happens.'
      },
      {
        stepNumber: 3,
        title: 'The eureka moment',
        instruction: 'Your dog will bat at it with paws or push with their muzzle. Once it flips 180 degrees, the reward drops onto the floor!',
        proTip: 'Celebrate their very first spin with an almighty victory cuddle.'
      }
    ],
    bondTip: 'Hold the base stable with both hands so it feels sturdy and safe. When they look up at you for guidance, point to the bottle and say "You got this!"',
    funnyQuote: 'Sir Isaac Newton discovered gravity with an apple; dogs rediscover it by slapping a plastic bottle for snacks.',
    illustrationKey: 'bottle_spinner'
  },

  // AGILITY (4 Games)
  {
    id: 'broomstick-limbo-hurdles',
    title: 'Broomstick Limbo & Hurdles',
    tagline: 'Olympic steeplechase in your living room or hallway.',
    category: 'agility',
    energyLevel: 'high',
    environment: 'both',
    skillBuilds: ['Body Awareness (Proprioception)', 'Rear End Control', 'Spacial Estimation'],
    durationMinutes: 8,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['toys_fetch', 'tug', 'chase_speed', 'praise_affection'],
    nonFoodAlternative: 'Wiggle a tug rope or plush toy on the other side of the broomstick to invite a joyful bounding jump!',
    materials: ['A standard broomstick or wrapping paper roll', '2 stacks of books, yoga blocks, or low laundry baskets'],
    steps: [
      {
        stepNumber: 1,
        title: 'Set ground level',
        instruction: 'Start with the broomstick flat on the floor or resting just 5 cm off the ground on low books.',
        proTip: 'Safety first: never use heavy or fixed bars. The stick must easily dislodge if touched.'
      },
      {
        stepNumber: 2,
        title: 'The joyful hop',
        instruction: 'Lead your dog over the hurdle with your body movement, toy lure, or enthusiastic step-through. Shout "Hop!" or "Over!" as they cross.',
        proTip: 'Raise it 5 cm at a time, keeping it well below your dog\'s elbow height for comfort.'
      },
      {
        stepNumber: 3,
        title: 'The Limbo reversal',
        instruction: 'Hold the broomstick at chest height with chairs on either side. Lure them to duck underneath: "Limbo low!"',
        proTip: 'Ducking under stretches their spine and promotes incredible body awareness.'
      }
    ],
    bondTip: 'Jump over the broomstick WITH them! Dogs are copycat pack animals—when they see their human teammate jump, their eyes sparkle with shared adventure.',
    funnyQuote: 'Who needs high-end gym equipment when a $4 broom and two stacks of cookbooks make an Olympic stadium?',
    illustrationKey: 'broomstick_hurdle'
  },
  {
    id: 'backyard-obstacle-dash',
    title: 'The Living Room & Yard Dash',
    tagline: 'The ultimate DIY canine American Ninja Warrior course.',
    category: 'agility',
    energyLevel: 'high',
    environment: 'both',
    skillBuilds: ['Cardiovascular Fitness', 'Agility & Direction Shifts', 'Handler Focus'],
    durationMinutes: 12,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['chase_speed', 'tug', 'toys_fetch', 'praise_affection'],
    nonFoodAlternative: 'Run through the course holding their absolute favorite squeaker or tug toy, ending with an electric 20-second tug celebration!',
    materials: ['3 couch cushions or pillows', 'A low coffee table or tunnel sheet', 'Laundry basket or chair to circle around'],
    steps: [
      {
        stepNumber: 1,
        title: 'Design the 3-station circuit',
        instruction: 'Station 1: Pillow stepping stones. Station 2: Blanket tunnel under two dining chairs. Station 3: 360° spin around a laundry basket.',
        proTip: 'Keep pathways clear and use rugs or lawn to prevent slipping.'
      },
      {
        stepNumber: 2,
        title: 'The test lap',
        instruction: 'Guide them through each obstacle one by one with big hand targets and high-energy verbal encouragement.',
        proTip: 'Praise their paws touching every cushion: "Step! Step! Good dog!"'
      },
      {
        stepNumber: 3,
        title: 'Full speed time trial!',
        instruction: 'Run the circuit side by side! Count down: "3, 2, 1, DASH!" Time their run or record a hilarious slow-mo video of their floppy ears in action.',
        proTip: 'End on a high note before they get overtired.'
      }
    ],
    bondTip: 'Run full tilt with them! Match their footwork, pump your arms, and laugh out loud. Your pure kinetic joy is the greatest motivator on earth.',
    funnyQuote: 'Crufts agility champions train for years; your dog just cleared the couch cushions and scored 10/10 in pure heart.',
    illustrationKey: 'obstacle_dash'
  },
  {
    id: 'hula-hoop-portal',
    title: 'The Hula Hoop Portal',
    tagline: 'Step through the magical hoop into supreme glory.',
    category: 'agility',
    energyLevel: 'medium',
    environment: 'both',
    skillBuilds: ['Spatial Confidence', 'Target Stepping', 'Trust Under Guidance'],
    durationMinutes: 7,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['toys_fetch', 'praise_affection', 'food', 'chase_speed'],
    nonFoodAlternative: 'Throw a tennis ball or toss a favorite soft toy gently straight through the center of the hoop so they chase it through!',
    materials: ['1 plastic hula hoop (or a soft coiled garden hose / pool noodle loop)', 'High-value toy or treat'],
    steps: [
      {
        stepNumber: 1,
        title: 'Rest on the grass/carpet',
        instruction: 'Rest the hoop vertically with its bottom edge touching the ground. You are on one side; your dog is on the other.',
        proTip: 'Hold the hoop completely still so it doesn\'t wobble and startle them.'
      },
      {
        stepNumber: 2,
        title: 'Step into the portal',
        instruction: 'Extend your hand or toy through the center of the hoop. Gently invite them: "Through!" Celebrate as their front paws step across.',
        proTip: 'Never pull or drag. Let their own curiosity propel them through the portal.'
      },
      {
        stepNumber: 3,
        title: 'The airborne leap',
        instruction: 'Once confident, lift the hoop 5 to 10 cm off the turf. Watch them spring gracefully through like a circus superstar!',
        proTip: 'Always maintain generous clearance for their tail and rear legs.'
      }
    ],
    bondTip: 'Frame your face inside the hoop and smile warmly when calling them through. Seeing your loving expression framed by the hoop builds irresistible pull!',
    funnyQuote: 'To humans, it is a $2 plastic toy; to dogs, it is a Stargate portal to cuddles and treats.',
    illustrationKey: 'hula_hoop'
  },
  {
    id: 'weave-pole-slalom',
    title: 'The Kitchen Weave Pole Slalom',
    tagline: 'Snake through the slalom like an agility pro.',
    category: 'agility',
    energyLevel: 'high',
    environment: 'both',
    skillBuilds: ['Spine Flexibility', 'Rapid Direction Shifts', 'Handler Following'],
    durationMinutes: 9,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['chase_speed', 'toys_fetch', 'tug', 'praise_affection'],
    nonFoodAlternative: 'Use a favorite squeaker or tug toy as the lure, keeping it at their nose height while zigzagging through the markers!',
    materials: ['4 to 6 tall objects: water bottles, traffic cones, yoga mats rolled upright, or boots', 'Spacious hallway, living room rug, or lawn'],
    steps: [
      {
        stepNumber: 1,
        title: 'Line up the slalom',
        instruction: 'Place the markers in a straight line spaced roughly 60 to 90 cm apart (wider for larger dogs).',
        proTip: 'Fill water bottles with tap water so they don\'t easily topple if brushed.'
      },
      {
        stepNumber: 2,
        title: 'The serpentine dance',
        instruction: 'Lure your dog through the markers: around the right of pole 1, left of pole 2, right of pole 3 in a smooth \'S\' wave.',
        proTip: 'Use fluid body language and chant: "Weave! In, out, in, out!"'
      },
      {
        stepNumber: 3,
        title: 'Speed weave & release',
        instruction: 'Gradually increase your walking/jogging speed until your dog flows through the slalom like water.',
        proTip: 'Reward instantly at the exit gate with an explosive game of tug or chase.'
      }
    ],
    bondTip: 'You and your dog are dance partners here. Sway your hips and shoulders in sync with their turns. The physical rhythm mirrors pack coordination in the wild!',
    funnyQuote: 'Watching a dog weave through 5 water bottles with wagging tail is 100% certified pure serotonin.',
    illustrationKey: 'weave_slalom'
  },

  // BONUS SECRET UNLOCKABLE GAMES (Embedded Virality)
  {
    id: 'secret-blanket-burrito',
    title: 'The Magic Sheet Ghost Tunnel',
    tagline: '🌟 Secret Bonus Game: An enchanted fabric crawl adventure!',
    category: 'agility',
    energyLevel: 'medium',
    environment: 'indoor',
    skillBuilds: ['Sensory Bravery', 'Claustrophobia Resistance', 'Deep Bond Trust'],
    durationMinutes: 8,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['praise_affection', 'toys_fetch', 'chase_speed'],
    nonFoodAlternative: 'Squeak a toy at the far end of the sheet tunnel and shine a flashlight softly through the fabric!',
    materials: ['A lightweight fitted bed sheet or duvet cover', 'Two dining chairs or a coffee table'],
    steps: [
      {
        stepNumber: 1,
        title: 'Drape the canopy',
        instruction: 'Drape the sheet over two chairs so it forms a gentle tent with open ends on both sides.',
        proTip: 'Make sure it is bright and airy inside so they see the light at the other end.'
      },
      {
        stepNumber: 2,
        title: 'Call through the tunnel',
        instruction: 'Wait at the exit end, peek in with a huge grin, and call: "Come find me!"',
        proTip: 'Reach your hands in halfway to meet them and guide their paws.'
      },
      {
        stepNumber: 3,
        title: 'The cuddle eruption',
        instruction: 'As they burst through the fluttery fabric, catch them in a gentle bear hug with cheers and giggles!',
        proTip: 'This builds bulletproof trust between dog and owner.'
      }
    ],
    bondTip: 'Giggle when their little nose pushes the sheet out. Your laughter signals safety and playfulness.',
    funnyQuote: 'Is it a ghost? Is it a superhero in a cape? No, it\'s your dog wearing a bedsheet with utter pride.',
    illustrationKey: 'sheet_tunnel',
    isSecret: true
  },
  {
    id: 'secret-sock-detective',
    title: 'The Missing Sock Scent Heist',
    tagline: '🌟 Secret Bonus Game: Turn their shoe/sock obsession into a legitimate crime-solving game!',
    category: 'curiosity',
    energyLevel: 'medium',
    environment: 'indoor',
    skillBuilds: ['Odor Discrimination', 'Fetch & Deliver', 'Playful Retrieval'],
    durationMinutes: 9,
    suitableSizes: ['small', 'medium', 'large', 'giant'],
    primaryMotivations: ['sniffing', 'toys_fetch', 'praise_affection'],
    nonFoodAlternative: 'Use a freshly worn clean cotton gym sock rolled into a soft ball—it carries your personal scent (which dogs love more than ribeye steak!).',
    materials: ['3 clean rolled-up pairs of socks (one worn recently by you)', 'An innocent smile'],
    steps: [
      {
        stepNumber: 1,
        title: 'The scent imprint',
        instruction: 'Let your dog sniff your sock ball. Say "My sock! Can you find it?"',
        proTip: 'Your scent is their favorite aroma in the entire galaxy.'
      },
      {
        stepNumber: 2,
        title: 'The decoy spread',
        instruction: 'Toss two unwashed/fresh socks and YOUR sock in different corners of the room.',
        proTip: 'Watch them smell each one and instantly target YOUR personal sock.'
      },
      {
        stepNumber: 3,
        title: 'Trade & Celebrate',
        instruction: 'When they bring your sock back, trade for a game of keep-away or soft belly rubs!',
        proTip: 'No scolding—this reframes sock-stealing into an authorized, bonded game!'
      }
    ],
    bondTip: 'Say "Thank you for finding my sock, Detective!" Taking the sock with gratitude instead of chasing them turns theft into teamwork.',
    funnyQuote: 'The washing machine didn\'t eat your left sock. Your dog was just saving it for the scent championship.',
    illustrationKey: 'sock_heist',
    isSecret: true
  }
];

export const POPULAR_BREEDS: { breed: string; typicalSize: 'small' | 'medium' | 'large' | 'giant'; typicalEnergy: 'low' | 'medium' | 'high' }[] = [
  { breed: 'Golden Retriever', typicalSize: 'large', typicalEnergy: 'high' },
  { breed: 'French Bulldog', typicalSize: 'small', typicalEnergy: 'low' },
  { breed: 'Border Collie', typicalSize: 'medium', typicalEnergy: 'high' },
  { breed: 'Labrador Retriever', typicalSize: 'large', typicalEnergy: 'high' },
  { breed: 'German Shepherd', typicalSize: 'large', typicalEnergy: 'high' },
  { breed: 'Jack Russell Terrier', typicalSize: 'small', typicalEnergy: 'high' },
  { breed: 'Poodle (Toy/Mini)', typicalSize: 'small', typicalEnergy: 'medium' },
  { breed: 'Poodle (Standard)', typicalSize: 'large', typicalEnergy: 'high' },
  { breed: 'Dachshund', typicalSize: 'small', typicalEnergy: 'medium' },
  { breed: 'Corgi', typicalSize: 'medium', typicalEnergy: 'high' },
  { breed: 'Beagle', typicalSize: 'medium', typicalEnergy: 'medium' },
  { breed: 'Husky', typicalSize: 'large', typicalEnergy: 'high' },
  { breed: 'Chihuahua', typicalSize: 'small', typicalEnergy: 'medium' },
  { breed: 'Australian Shepherd', typicalSize: 'medium', typicalEnergy: 'high' },
  { breed: 'Great Dane', typicalSize: 'giant', typicalEnergy: 'low' },
  { breed: 'Boxer', typicalSize: 'large', typicalEnergy: 'high' },
  { breed: 'Cavalier King Charles', typicalSize: 'small', typicalEnergy: 'low' },
  { breed: 'Whippet / Greyhound', typicalSize: 'medium', typicalEnergy: 'medium' },
  { breed: 'Rescue / Mixed Breed (Supermutt)', typicalSize: 'medium', typicalEnergy: 'medium' }
];

export const MOTIVATION_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
  food: { label: 'Treats & Food', icon: '🥩', desc: 'Loves tasty snacks, kibble, and peanut butter' },
  toys_fetch: { label: 'Toys & Balls', icon: '🎾', desc: 'Obsessed with tennis balls, squeakers, and plushies' },
  tug: { label: 'Tug-of-War', icon: '🪢', desc: 'Craves high-energy rope pulling and resistance' },
  praise_affection: { label: 'Praise & Cuddles', icon: '❤️', desc: 'Melts for excited owner cheers, scritches, and cuddles' },
  chase_speed: { label: 'Chase & Sprint', icon: '⚡', desc: 'Driven by zoomies, movement, and running fast' },
  sniffing: { label: 'Sniffing & Scents', icon: '👃', desc: 'Curious nose always glued to the ground and breeze' }
};
