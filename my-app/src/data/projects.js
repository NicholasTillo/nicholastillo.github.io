// Every project on the Projects tab. Featured entries show `summary` on the tab, the
// rest become flip cards showing `keywords`. Anything with `text` gets a /projects/:slug
// page; an entry with `href` links there instead (Fluffycraft goes to the showcase).

export const currentlyWorkingOn = 'Learning voxel based 3D models, and an arcade repeatable game with a unique style';

export const categories = [
  { id: 'game-design', title: 'Game Design' },
  { id: 'professional-projects', title: 'Professional Projects' },
];

export const projects = [
  {
    slug: 'x-souls',
    title: 'X Souls',
    category: 'game-design',
    featured: true,
    stats: { Role: 'Solo Developer', Team: 'Solo', Stack: 'Godot 4', Focus: 'Genre-Swapping Puzzles', Context: 'DreamLayer Jam · 17th of 61 in Creativity' },
    summary: 'A totally regular souls-like experience, and my solo entry to the DreamLayer Jam, where it placed 17th of 61 for Creative Use of DreamLayer. You jump between six different souls-like games to solve puzzles, from an action RPG to a deckbuilder and a rhythm game.',
    text: `A totally regular souls-like experience, and my solo submission to the DreamLayer Jam, where it placed 17th of 61 entries for Creative Use of DreamLayer and 27th for Visual World & Art Direction. Built in Godot 4 and playable in the browser on itch.io, X Souls wraps every possible souls-like game into one: the protagonist gains the power to jump into six different souls-like games to solve puzzles, from an action RPG (Action Souls), to a deckbuilder (Full Souls Deluxe), an auto battler (Autosouls), a horror game (Soul Alone), a 2D platformer (Super Soul Brothers), and a rhythm game (Rhythm of the Soul).`,
    images: [
      require('../Assets/XSoulsTitle.gif'),
      require('../Assets/XSoulsMainCharacter.png'),
      require('../Assets/XSoulsSoulAlone.png'),
      require('../Assets/XSoulsAutosouls.png'),
    ],
    embed: { id: '5146795', url: 'https://nicholastillo.itch.io/x-souls', label: 'X Souls by NicholasTillo' },
  },
  {
    slug: 'meaning-of-life',
    title: 'The Game Of The Meaning Of Life',
    category: 'game-design',
    featured: true,
    stats: { Role: 'Solo Developer & Artist', Team: 'Solo', Stack: 'Godot · Aseprite', Focus: 'Systems Design · Pixel Art', Context: 'itch.io' },
    summary: "A sci-fi survival/arcade twist on John Conway's Game Of Life, where you play as a ship carrying 32,934 human explorers to the edge of the universe. I was the sole developer, designer, and asset creator, and turned a 0-player simulation into a game with real player agency.",
    text: `I was the sole developer, sole designer, and sole asset creator for this game. Using Godot, I expanded on Conway's original rules to transform a 0-player simulation into a game with real player agency, designing the population, profession, and resource systems, the upgrade-driven progression loop, and the random events that keep each run unpredictable. I also created all of the pixel art for the ships, stations, and effects in Aseprite, and released the game playable in the browser on itch.io.`,
    textAfter: `The fully automated Titan's Wake carries 32,934 human explorers to the edge of the universe, as generations pass in the search for the Meaning Of Life. A sci-fi survival/arcade twist on John Conway's Game Of Life, players take the role of the ship, managing its populations, their professions, and resources, upgrading the ship with every failed attempt to reach further generations while random events throw their plans into chaos.`,
    images: [
      require('../Assets/MeaningOfLife3.png'),
      require('../Assets/MeaningOfLife1.png'),
      require('../Assets/MeaningOfLife2.png'),
    ],
    embed: { id: '5010332', url: 'https://nicholastillo.itch.io/the-game-of-the-meaning-of-life', label: 'The Game Of The Meaning Of Life by NicholasTillo' },
  },
  {
    slug: 'extraterrestrial-entertainment',
    title: 'Extraterrestrial Entertainment',
    category: 'game-design',
    featured: true,
    stats: { Role: 'Gameplay & AI Developer', Team: '3', Stack: 'Unity 6 · C#', Focus: '4 State Machines · Joke System · Alien Language', Context: 'CISC 486' },
    summary: 'A game about aliens, language, and jokes. I built all 4 of its finite state machines and designed the joke-slot structure, with over 100,000 possible jokes built from a 36-word alien vocabulary.',
    text: `A course project for CISC 486 - Game Development: a game about aliens, language, and jokes. I was the main designer and developer for the behavioral AI for the aliens, and the main gameplay loop, building all 4 of the game's finite state machines: player movement, the joke manager, alien emotion, and alien movement. I designed the joke-slot structure that gives players a sense of unknown language while still being able to piece together meaning: 16 joke templates with 1 to 3 word slots, filled from a 36-word alien vocabulary across 4 humour genres, for over 100,000 possible jokes. I applied Norman's principles of interaction design, creating visible feedback, and clear cues to ensure player retention and reduce confusion.`,
    links: [
      ['GitHub Link', 'https://github.com/kabeeradil03/CISC486GD-extraterrestrial-entertainment'],
      ['Video Of Player Movement and Aliens', 'https://youtu.be/yV3j3jQtLQs'],
      ['Demo of Gameplay and FSM Logic', 'https://youtu.be/9dVxzEknoJY'],
      ['Video Of Pathfinding and Behaviour Tree', 'https://www.youtube.com/watch?v=O5wmU3lJKOU'],
      ['Final Powerpoint Presentation', require('../Assets/CISC 486 - Group 6 Presentation.pptx')],
    ],
    images: [
      require('../Assets/ExtraterrestrialEntertainment.png'),
      require('../Assets/EEBehaviourTree.png'),
    ],
  },
  {
    slug: 'geomancers-escape',
    title: "The Geomancer's Escape",
    category: 'game-design',
    stats: { Role: 'Sole Developer', Team: '3', Stack: 'Unity · C#', Focus: '2D/3D Dimension Mechanics · Enemy AI', Context: 'CISC 223 · itch.io' },
    keywords: ['Unity', 'C#', '2D/3D Dimension Mechanics', 'Enemy AI'],
    text: `I was the sole developer in a team of 3, creating a Unity game for a course project, CISC 223 - Game Design. A game about a 2D player attempting to return to three dimensions, fighting through worlds, exploring, and dodging enemies that are able to move between the 2D and 3D realms. As the team's only developer, I built the "hook" of the interaction between 3D and 2D space. I also created the core gameplay loop, designed the enemies and their unique behaviours, and created interesting puzzles that utilize the unique domain of multiple dimensions.`,
    links: [
      ['Repository Link', 'https://github.com/NicholasTillo/TheGeomancersEscape'],
      ['Itch Link', 'https://nicholastillo.itch.io/the-geomancers-escape'],
    ],
    images: [
      require('../Assets/geomancersEscape.png'),
      require('../Assets/GeomancerEscape.png'),
    ],
  },
  {
    slug: 'fluffycraft',
    title: 'Fluffycraft',
    category: 'game-design',
    keywords: ['Blockbench', 'Java', 'NeoForge 1.21.1', 'Minecraft Mod'],
    href: '/assets',
    images: [require('../Assets/fluffycraft/capybara.png')],
  },
  {
    slug: 'reason-codes',
    title: 'Reason Codes for Mobile Point Of Sale System',
    category: 'professional-projects',
    featured: true,
    stats: { Role: 'Mobile App Developer', Team: 'Jonas Software', Stack: 'Objective-C (iOS) · Java (Android)', Focus: 'Database Design · API Integration · Audit Trails', Context: 'Shipped to Production' },
    summary: 'A reason-code system for the mobile-POS system at Jonas Software, letting managers define required reasons for voids and other managerial overrides. I owned the feature end to end, and it now gives managers an audit trail for every override.',
    text: `As a Mobile App Developer at Jonas Software, I designed and built a reason-code system for the mobile-POS system, letting managers define and manage required reasons for voids and other managerial overrides. Before this, overrides weren't tracked, which made auditing difficult. I owned the feature end to end: I pitched early designs to the team for feedback, built a prototype branch for review, and took it through QA to release. Built with Objective-C for iOS and Java for Android, it now gives managers an audit trail for every override.`,
    images: [
      require('../Assets/ReasonCodes1.png'),
      require('../Assets/ReasonCodes2.png'),
    ],
    imageClass: 'portrait',
  },
  {
    slug: 'gitaxian-probe',
    title: 'Gitaxian Probe & Strategic Sorcery - AI Models for Magic: The Gathering',
    category: 'professional-projects',
    featured: true,
    stats: { Role: 'Main Developer', Team: '2', Stack: 'Python · PDDL · Keras', Focus: 'Automated Planning · Bayes Nets · Deep Learning', Context: 'ICAPS 2024 Demo' },
    summary: 'AI models for Magic: The Gathering. We modelled 10 cards across 4 game scenarios, and the planner finds winning lines up to 200 steps long. I presented this work as a demo at the ICAPS 2024 conference.',
    text: `I was the main developer for an MTG-inspired course project. I explored and evaluated different AI models and their applicability in the Magic: The Gathering domain to solve the teaching problem of high complexity within the game. I created Naive Bayes nets to understand the factors behind victory in an MTG game. We eventually expanded on this topic, specifically the automated planning section: we modelled 10 cards across 4 game scenarios, and the planner finds winning lines up to 200 steps long. I presented this work as a demo at the ICAPS 2024 conference.`,
    links: [
      ['Project Link', 'https://github.com/NicholasTillo/Gitaxian-Probe'],
      ['ICAPS 2024 Paper Link', 'https://openreview.net/pdf?id=bZeQ7DB0T9'],
    ],
    images: [
      require('../Assets/GitProbe1.png'),
      require('../Assets/GitProbePresentation.jpg'),
    ],
  },
  {
    slug: 'counterfactual',
    title: 'CounterFactual MAP-Elites Algorithm',
    category: 'professional-projects',
    featured: true,
    stats: { Role: 'Sole Developer', Team: 'Solo', Stack: 'Python · Keras', Focus: 'Explainable ML · MAP-Elites · 3 Datasets', Context: 'Research Proof of Concept' },
    summary: 'A Quality Diversity counterfactual generation proof of concept using the MAP-Elites algorithm, with a GUI for exploring diverse, actionable explanations for machine learning models. I tested it on 3 datasets: penguin species, loan applications, and two-year recidivism.',
    text: `A Quality Diversity counterfactual generation proof of concept using the MAP-Elites algorithm. I created a Python-based project featuring a GUI for generating diverse, actionable counterfactual explanations for machine learning models. Users can preprocess data, configure parameters, and interactively explore counterfactuals through a visual grid-based interface, generating a user-defined X by X grid of counterfactuals in a single run. I tested it on 3 datasets: penguin species, loan applications, and two-year recidivism. This program aims to illuminate the "Why" behind machine learning decisions, and to show the "What could have been different" situations that lead to different outcomes.`,
    links: [['Repository Link', 'https://github.com/NicholasTillo/CounterFactual']],
    images: [require('../Assets/CounterFactual.png')],
  },
  {
    slug: 'mulab-capstone',
    title: 'Capstone Project - Computational Artwork for the MuLab',
    category: 'professional-projects',
    stats: { Role: 'Artist', Stack: 'Acrylic · Spray Paint · Mixed Media', Focus: 'Epistemic Planning · Graph Theory · Spacecraft Safety', Context: 'Capstone · MuLab' },
    keywords: ['Acrylic', 'Mixed Media', 'Epistemic Planning', 'Graph Theory'],
    text: `This project was a set of 3 full-sized canvases meant to spread the research of the graduate students within the MuLab and present the key concepts in a novel way. The 3 art pieces contain a mix of acrylic paintings, spray coloured mediums and mixed media elements. The first concept covered was RP-BDI planning, a multi-agent epistemic planning model aimed to make planning more human. Next was a novel neural net approach to the classic cops and robbers graph theory problem. Finally, the last piece was regarding using AI automated planning for safety features on spacecraft.`,
    links: [['Final Report For The Project', 'https://drive.google.com/file/d/110QHDawwi864MMwkK79G3pvBGZB0s9WW/view?usp=sharing']],
    images: [
      require('../Assets/IMG_0478.PNG'),
      require('../Assets/FinishedComputationalArtworks.png'),
      require('../Assets/IMG_0462.PNG'),
    ],
  },
  {
    slug: 'game-of-life-solver',
    title: "Conway's Game Of Life Solver",
    category: 'professional-projects',
    stats: { Role: 'Solver Architect', Stack: 'Python · Bauhaus · Kissat SAT', Focus: 'Logic Modelling · SAT Solving', Context: 'CISC/CMPE 204' },
    keywords: ['Python', 'Kissat SAT', 'Logic Modelling', 'SAT Solving'],
    text: `A course project using Python to model the zero-player Game Of Life. Given a fully initialized starting state, it will attempt to solve whether or not the pattern will result in a stable state. It uses Python and the Kissat SAT solver to search the state space set up in the model. I designed the architecture for the solver as well as ensured its functionality was efficient enough to solve higher order situations.`,
    links: [
      ['Repository Link', 'https://github.com/NicholasTillo/GameOfLifeSolver'],
      ['Documentation Link', 'https://github.com/NicholasTillo/GameOfLifeSolver/blob/main/documents/final/GRP_13%20ModellingProject%20-%20Documentation.pdf'],
    ],
    images: [require('../Assets/GameOfLife.png')],
  },
];
