import type { Case } from '../../types'

const case002: Case = {
  id: 'case-002',
  title: 'The Last Note',
  subtitle: 'The music that never played',
  description:
    'Acclaimed composer Eduardo Vidal is found dead in his dressing room an hour before the premiere of his masterpiece. Police file it as a heart attack. You know something doesn\'t add up.',
  difficulty: 'Medio',
  location: 'Apolo Municipal Theater',
  date: 'April 22nd, 8:15 PM',
  thumbnail: '🎼',
  color: '#1a3a6b',
  intro:
    'Tonight, the Apolo Municipal Theater was supposed to be the stage of the century. Instead, it has become a crime scene. Eduardo Vidal, genius of contemporary composition, lies in his dressing room. His whiskey glass half-finished. His unfinished symphony on the music stand. Someone didn\'t want that music to play.',
  crimeSceneDescription:
    'The dressing room smells of whiskey and violets — Vidal\'s favorite perfume. The body has been removed, but his belongings remain untouched. The whiskey glass with residue. The music stand with the score. The wastebasket with crumpled papers. The filing cabinet, half open.',

  suspects: [
    {
      id: 'carmen-blanco',
      name: 'Carmen Blanco',
      age: 30,
      occupation: 'Composer / Former Student',
      description:
        'A brilliant young woman with an intense stare. She accuses Vidal of plagiarizing her musical thesis. She speaks with overflowing passion.',
      avatar: '🎻',
      motive:
        'She believes Vidal stole her graduate work to create his symphony. She wanted to destroy his reputation, not his life.',
      alibi: 'She was in the theater\'s back courtyard composing. No one can confirm it.',
      isGuilty: false,
      dialogues: [
        {
          id: 'c-q1',
          question: 'What was your relationship with Eduardo Vidal?',
          answer:
            'He was my mentor. Then my enemy. He stole three years of my work and turned it into his "masterpiece." This symphony is MINE, detective.',
          emotionalState: 'angry',
          revealedEvidenceIds: ['nota-musical'],
        },
        {
          id: 'c-q2',
          question: 'Where were you between 7:00 and 8:00 PM?',
          answer:
            'In the courtyard. Alone. I know it sounds suspicious, but it\'s the truth. I needed air before going in to watch them steal my applause.',
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
        {
          id: 'c-q3',
          question: 'Did you have reasons to want him dead?',
          answer:
            'I wanted to ruin him professionally, not kill him. If I\'d killed him before the premiere, his symphony would\'ve become a martyr. That would\'ve been worse for me.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'c-q4',
          question: 'Do you know anything about heart medication?',
          answer:
            'I\'m a composer, not a doctor. Although... wait. Lucía Méndez, his manager — she takes care of her mother, who has a heart condition. I know that because Eduardo mentioned it once.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['frasco-digoxina'],
        },
      ],
    },
    {
      id: 'roberto-santos',
      name: 'Roberto Santos',
      age: 45,
      occupation: 'Composer / Professional Rival',
      description:
        'A self-assured man, almost arrogant. He doesn\'t seem affected by Vidal\'s death. That, in itself, is suspicious.',
      avatar: '🎹',
      motive:
        'He was competing with Vidal for the National Music Prize. With Vidal dead, the prize is his.',
      alibi: 'He was in the theater lobby with the director and several music critics. Thoroughly corroborated.',
      isGuilty: false,
      dialogues: [
        {
          id: 'r-q1',
          question: 'Do you mourn Eduardo Vidal\'s death?',
          answer:
            'We\'re rivals, detective. It would be hypocritical to pretend I\'m grieving. But I didn\'t kill him either. I do have morals, though you doubt it.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'r-q2',
          question: 'The National Music Prize is now yours.',
          answer:
            'Yes. And I would\'ve won it either way, with Eduardo alive. My work is superior. Any critic with ears knows that. I didn\'t need him to die.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'r-q3',
          question: 'Can you prove you weren\'t in the dressing room?',
          answer:
            'Director Álvarez, three critics from El Arte newspaper, and the lobby barista. All of them can confirm I was there from 6:30 PM on. Pick whoever you like.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'r-q4',
          question: 'Did you notice anything unusual about Lucía Méndez\'s behavior tonight?',
          answer:
            'Lucía was... nervous. More than usual. I saw her leave Eduardo\'s dressing room around 7:15 PM. I figured it was premiere nerves. But that was before the production staff even arrived.',
          emotionalState: 'evasive',
          revealedEvidenceIds: ['registro-acceso'],
        },
      ],
    },
    {
      id: 'lucia-mendez',
      name: 'Lucía Méndez',
      age: 38,
      occupation: 'Personal Manager',
      description:
        'An organized, professional woman. But her eyes never stay still. She talks too fast when she gets nervous.',
      avatar: '📱',
      motive:
        'She had been embezzling funds from the Vidal Foundation for four years. Eduardo confronted her the night before with proof. It was get arrested, or silence him.',
      alibi: 'She says she was coordinating logistics on the main stage until 8:00 PM.',
      isGuilty: true,
      dialogues: [
        {
          id: 'l-q1',
          question: 'When was the last time you saw Eduardo Vidal alive?',
          answer:
            'At around... 7:00 PM. I brought him his usual whiskey, we talked about the program order. He was fine. Perfectly fine.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['vaso-residuos'],
        },
        {
          id: 'l-q2',
          question: 'The access log shows you entered the dressing room at 7:12 PM.',
          answer:
            'Yes, I already said that. I went to bring y— to bring him the whiskey. It\'s completely normal, it was part of my responsibilities.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['registro-acceso'],
        },
        {
          id: 'l-q3',
          question: 'What\'s in the Vidal Foundation\'s account statements?',
          answer:
            'I... that\'s not relevant to the investigation. I\'m the administrator, there are legitimate fund movements constantly.',
          emotionalState: 'evasive',
          revealedEvidenceIds: ['estados-cuenta'],
        },
        {
          id: 'l-q4',
          question: 'We found an email where Eduardo confronts you about the money.',
          answer:
            'That\'s... that\'s out of context! We had a misunderstanding, nothing more. Eduardo was a genius but he didn\'t understand finance. I handled everything for him.',
          emotionalState: 'angry',
          revealedEvidenceIds: ['correo-confrontacion'],
        },
        {
          id: 'l-q5',
          question: 'Why is there a bottle of digoxin in your purse?',
          answer:
            'It\'s my mother\'s. She has a heart condition. I... I always carry it just in case... No, you have no right to search my purse without a warrant.',
          emotionalState: 'angry',
          revealedEvidenceIds: [],
        },
        {
          id: 'l-q6',
          question: 'Did you forget something in the dressing room that night?',
          answer:
            'No... well, yes. My jacket. I left it hanging near the coat rack. With all this chaos I haven\'t been able to go back for it.',
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 'l-q7',
          question: 'We have records that you contacted a pharmacist on the night of the premiere asking for digoxin without a prescription.',
          answer:
            'That was afterward, for my mother, because the bottle... no. I\'m not saying anything else without a lawyer.',
          emotionalState: 'angry',
          revealedEvidenceIds: ['chat-farmacia'],
        },
      ],
    },
  ],

  evidence: [
    {
      id: 'vaso-residuos',
      name: 'Glass with Residue',
      description: 'A whiskey glass with residual liquid at the bottom.',
      type: 'physical',
      icon: '🥃',
      location: 'Dressing room vanity',
      isKey: true,
      analysis:
        'Toxicology detected digoxin at concentrations four times above the therapeutic range. This amount, in a person with no cardiac history, triggers a sudden heart attack that mimics natural death.',
    },
    {
      id: 'frasco-digoxina',
      name: 'Bottle of Digoxin',
      description: 'Heart medication with fingerprints.',
      type: 'physical',
      icon: '💊',
      location: "Lucía Méndez's purse",
      isKey: true,
      analysis:
        "Digoxin bottle prescribed under Lucía's mother's name, but with 40% of the pills missing — a larger amount than any normal medical dosage. Lucía's prints are on the bottle and the cap.",
    },
    {
      id: 'correo-confrontacion',
      name: 'Printed Email',
      description: 'Email from Eduardo Vidal to Lucía Méndez, dated the day before.',
      type: 'document',
      icon: '✉️',
      location: 'Dressing room filing cabinet',
      isKey: true,
      analysis:
        '"Lucía: I\'ve gone over the account statements with my accountant. $87,000 is missing in undocumented transfers. Tomorrow, before the premiere, I need a full explanation. If there isn\'t a satisfactory one, I\'ll speak with my lawyer. — Eduardo." This gave her a clear motive to act that night.',
    },
    {
      id: 'estados-cuenta',
      name: 'Account Statements',
      description: 'Vidal Foundation financial documents with irregularities.',
      type: 'document',
      icon: '📊',
      location: 'Dressing room filing cabinet',
      isKey: true,
      analysis:
        'Monthly transfers of between $1,500 and $3,000 over four years to a numbered account. Approximate total: $87,400. The transfers always happened while Vidal was on tour and unable to supervise.',
    },
    {
      id: 'registro-acceso',
      name: 'Access Log',
      description: "Digital log from the dressing room's door system.",
      type: 'digital',
      icon: '🔐',
      location: 'Theater security system',
      isKey: true,
      analysis:
        'Lucía Méndez accessed the dressing room at 7:12 PM and left at 7:18 PM. Eduardo Vidal was found dead at 8:15 PM. The medical examiner estimates death between 7:20 and 7:40 PM. No one else accessed the dressing room during that window.',
    },
    {
      id: 'nota-musical',
      name: "Carmen's Score",
      description: "Musical fragment in Carmen Blanco's handwriting, dated two years ago.",
      type: 'document',
      icon: '🎵',
      location: 'Dressing room wastebasket',
      isKey: false,
      analysis:
        "Musical draft by Carmen Blanco. Some melodic motifs are similar to Vidal's symphony, though not identical. Possible influence or inspiration — not outright plagiarism. The conflict between them was real, but it doesn't amount to a crime.",
    },
    {
      id: 'botella-whiskey',
      name: 'Whiskey Bottle',
      description: 'A sealed, unopened bottle next to the used glass.',
      type: 'physical',
      icon: '🍾',
      location: 'Dressing room shelf',
      isKey: false,
      analysis:
        "The bottle is sealed and unopened. This means the poisoned whiskey came from another container — someone either brought the glass already prepared, or added the poison directly to Vidal's glass.",
    },
    {
      id: 'guantes-papelera',
      name: 'Disposable Gloves',
      description: 'A pair of used surgical gloves in the restroom wastebasket.',
      type: 'physical',
      icon: '🧤',
      location: 'Shared restroom down the hall',
      isKey: false,
      analysis:
        'Disposable nitrile gloves. They contain traces of digoxin dissolved in alcohol. Whoever used them discarded them in the restroom adjacent to the dressing room — in the direction Lucía Méndez left that night.',
    },
    {
      id: 'chat-farmacia',
      name: "ChatVía Thread: 'Marta - Pharmacy'",
      description: "Conversation recovered from Lucía Méndez's phone with a pharmacist she knows.",
      type: 'digital',
      icon: '💊',
      location: "Lucía Méndez's phone, forgotten in a jacket in the dressing room",
      isKey: true,
      analysis:
        'That same night of the premiere, Lucía asked to be gotten digoxin without a prescription "before my mom notices pills are missing" — meaning she already knew exactly how many were missing from her mother\'s bottle, hours before any forensic analysis could have confirmed it.',
      digitalSourceId: 'msg-farmacia-4',
    },
  ],

  hotspots: [
    {
      id: 'tocador',
      x: 40,
      y: 50,
      label: 'Vanity with Glass',
      evidenceId: 'vaso-residuos',
      description: 'The vanity where Vidal got ready. The whiskey glass still has residue.',
      icon: '🪞',
    },
    {
      id: 'archivador',
      x: 72,
      y: 45,
      label: 'Filing Cabinet',
      evidenceId: 'correo-confrontacion',
      description: 'A half-open metal filing cabinet. Papers scattered inside.',
      icon: '🗄️',
    },
    {
      id: 'papelera',
      x: 20,
      y: 68,
      label: 'Wastebasket',
      evidenceId: 'nota-musical',
      description: 'A wastebasket with crumpled papers and an empty bottle.',
      icon: '🗑️',
    },
    {
      id: 'atril',
      x: 60,
      y: 30,
      label: 'Music Stand',
      evidenceId: null,
      description: "Vidal's unfinished symphony. The pages are crumpled, as if he'd gripped them.",
      icon: '🎼',
    },
    {
      id: 'estante',
      x: 82,
      y: 28,
      label: 'Drinks Shelf',
      evidenceId: 'botella-whiskey',
      description: "A shelf with the unopened whiskey bottle. Something doesn't add up.",
      icon: '🍶',
    },
    {
      id: 'perchero',
      x: 15,
      y: 35,
      label: 'Coat Rack',
      evidenceId: null,
      deviceId: 'phone-lucia',
      description: "A woman's jacket hangs on the rack, next to the vanity. Something buzzes in the inner pocket.",
      icon: '🧥',
    },
    {
      id: 'bano-pasillo',
      x: 50,
      y: 80,
      label: 'Hallway Restroom',
      evidenceId: 'guantes-papelera',
      description: 'The door to the shared restroom, right across from the dressing room, is ajar.',
      icon: '🚪',
    },
  ],

  digitalDevices: [
    {
      id: 'phone-lucia',
      ownerSuspectId: 'lucia-mendez',
      label: "Lucía Méndez's Phone",
      lockType: 'pattern',
      unlockCode: '1912',
      unlockHint:
        'The access log shows she entered the dressing room at 7:12 PM. She reuses that number for everything. Four digits, no spaces.',
      apps: ['chatvia', 'anotta'],
      threads: [
        {
          id: 'thread-farmacia',
          appId: 'chatvia',
          title: 'Marta - Pharmacy',
          participants: ['Lucía Méndez', 'Marta'],
          messages: [
            {
              id: 'msg-farmacia-1',
              sender: 'Lucía Méndez',
              timestamp: 'today, 9:40 PM',
              text: 'Marta, I need an urgent favor. Can you get me digoxin tonight? Without a prescription if you have to.',
            },
            {
              id: 'msg-farmacia-2',
              sender: 'Marta',
              timestamp: 'today, 9:43 PM',
              text: 'Lucía, I can\'t just give you that, I need to see your mom\'s prescription.',
            },
            {
              id: 'msg-farmacia-3',
              sender: 'Lucía Méndez',
              timestamp: 'today, 9:45 PM',
              text: 'Please. Her bottle broke, she can\'t go a single night without her medicine. I\'ll make it up to you, whatever it takes.',
            },
            {
              id: 'msg-farmacia-4',
              sender: 'Marta',
              timestamp: 'today, 9:52 PM',
              text: 'Fine, for old times\' sake. I\'ll leave half a bottle for you at the pharmacy, come by before it closes. But this can\'t happen again.',
              evidenceId: 'chat-farmacia',
            },
          ],
        },
      ],
      notes: [
        {
          id: 'nota-borrador-lucia',
          appId: 'anotta',
          title: 'Untitled',
          isDeleted: true,
          body:
            "Eduardo, I know how this looks but I can explain everything. The numbers add up if you let me show you the full balance. Don't talk to your lawyer yet, give me one more day—\n\n(the draft was never sent)",
        },
      ],
    },
  ],

  tensionEvents: [
    {
      id: 'tension-002-hint',
      triggerActionCount: 6,
      message: "You feel like there's something else in the dressing room you haven't checked.",
      effect: {
        revealHint: "The jacket left near the coat rack might not just be clothing — check if it has something inside.",
      },
    },
    {
      id: 'tension-002-lock',
      triggerActionCount: 14,
      message:
        "It's too late now — Lucía's thread with the pharmacy vanished, along with the draft she never sent.",
      effect: {
        lockThreadIds: ['thread-farmacia'],
        lockNoteIds: ['nota-borrador-lucia'],
      },
    },
  ],

  correctConnections: [
    { fromId: 'frasco-digoxina', toId: 'lucia-mendez' },
    { fromId: 'correo-confrontacion', toId: 'lucia-mendez' },
    { fromId: 'estados-cuenta', toId: 'lucia-mendez' },
    { fromId: 'registro-acceso', toId: 'lucia-mendez' },
    { fromId: 'guantes-papelera', toId: 'lucia-mendez' },
    { fromId: 'chat-farmacia', toId: 'lucia-mendez' },
    { fromId: 'nota-musical', toId: 'carmen-blanco' },
  ],

  solution: {
    guiltyId: 'lucia-mendez',
    explanation:
      "Lucía Méndez, Eduardo Vidal's trusted manager, had been stealing money from his foundation for four years. When Eduardo discovered the irregularities and confronted her by email the night before the premiere, Lucía knew she had only hours to act. She dissolved digoxin pills in isopropyl alcohol, put on surgical gloves, and entered the dressing room at 7:12 PM with the whiskey glass already prepared. After 6 minutes, she left Eduardo drinking his poisoned drink and walked out. The heart attack was nearly immediate. She discarded the gloves in the hallway restroom.",
    timeline: [
      { time: 'One day before', description: 'Eduardo discovers the irregularities and sends the confrontation email to Lucía.' },
      { time: '6:00 PM', description: "Lucía buys additional digoxin (or takes it from her mother's bottle)." },
      { time: '7:00 PM', description: 'Lucía prepares the whiskey glass with the dissolved poison.' },
      { time: '7:12 PM', description: 'She enters Eduardo\'s dressing room with the "courtesy" drink.' },
      { time: '7:18 PM', description: 'She leaves the dressing room. Eduardo starts drinking.' },
      { time: '7:19 PM', description: 'She discards the gloves in the hallway restroom.' },
      { time: '7:30 PM', description: 'Eduardo Vidal dies of a digoxin-induced heart attack.' },
      { time: '8:15 PM', description: 'The production assistant finds the body.' },
    ],
    proof: {
      means: ['frasco-digoxina', 'guantes-papelera', 'chat-farmacia'],
      motive: ['correo-confrontacion', 'estados-cuenta'],
      opportunity: ['registro-acceso'],
    },
  },
}

export default case002
