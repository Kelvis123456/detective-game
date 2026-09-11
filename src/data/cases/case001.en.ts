import type { Case } from '../../types'

const case001: Case = {
  id: 'case-001',
  title: 'The Red Diamond',
  subtitle: 'A jewel worth a life',
  description:
    'During a lavish gala at the Grand Palace Hotel, the legendary "Blood Fire" diamond vanishes from its display case. Collector Reginald Whitmore is furious. Someone at that party knows where the jewel is.',
  difficulty: 'Fácil',
  location: 'Grand Palace Hotel',
  date: 'March 15th, 11:47 PM',
  thumbnail: '💎',
  color: '#8b1a1a',
  intro:
    'Rain hammers the windows of the Grand Palace while the echo of the gala\'s music still lingers in the halls. The "Blood Fire" diamond — appraised at three million dollars — has vanished. The display case wasn\'t forced open. Someone had the keys. You have until dawn to solve it.',
  crimeSceneDescription:
    'The exhibition hall smells of expensive perfume and betrayal. The central display case stands open, its pedestal empty. The marble floor gleams under the emergency lights. An overturned wine glass. The trash bin in the corner. The security camera, blinking.',

  suspects: [
    {
      id: 'valentina-cruz',
      name: 'Valentina Cruz',
      age: 40,
      occupation: 'Hotel Manager',
      description:
        'An elegant woman with dark hair. Nervous since you arrived. Her hands tremble slightly when she speaks.',
      avatar: '👩‍💼',
      motive:
        'Debts to dangerous loan sharks. She needed money urgently to pay up — or risk her life.',
      alibi: 'She says she was at the front desk all night, coordinating the event.',
      isGuilty: false,
      dialogues: [
        {
          id: 'v-q1',
          question: 'Where were you when the robbery happened?',
          answer:
            'At the front desk, detective. I have fifty employees who can confirm that. This gala required my constant attention.',
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 'v-q2',
          question: 'Who had access to the display case keys?',
          answer:
            'Mr. Delgado used them for the official appraisal. We keep the duplicate in the management safe. Only I know the combination... well, and Mr. Whitmore.',
          emotionalState: 'calm',
          revealedEvidenceIds: ['ficha-evaluacion'],
        },
        {
          id: 'v-q3',
          question: 'I have information that you have serious debts.',
          answer:
            "That's my private life! It has nothing to do with this case. My finances are my problem, not yours.",
          emotionalState: 'angry',
          revealedEvidenceIds: ['nota-amenaza'],
        },
        {
          id: 'v-q4',
          question: 'Did you notice anything unusual during the night?',
          answer:
            'Mr. Delgado was in the exhibition hall longer than usual. I thought it was professional dedication. Now I wonder...',
          emotionalState: 'evasive',
          revealedEvidenceIds: [],
        },
      ],
    },
    {
      id: 'marco-delgado',
      name: 'Marco Delgado',
      age: 55,
      occupation: 'Gemology Expert',
      description:
        'An older man with a refined appearance. Impeccable suit. He answers with excessive calm, almost rehearsed.',
      avatar: '🧐',
      motive:
        'A black-market buyer already paid. He crafted a perfect replica and swapped it for the real diamond during the official appraisal.',
      alibi: 'He says he was at the buffet with other guests until 11:00 PM.',
      isGuilty: true,
      dialogues: [
        {
          id: 'm-q1',
          question: 'When was the last time you saw the diamond?',
          answer:
            'During the official appraisal, four days before the gala. Everything was in perfect condition — I guarantee it with my professional reputation.',
          emotionalState: 'calm',
          revealedEvidenceIds: ['ficha-evaluacion'],
        },
        {
          id: 'm-q2',
          question: 'Can you show me your hands?',
          answer:
            "Of course... what exactly are you looking for? I work with my hands, it's normal for them to look like this.",
          emotionalState: 'nervous',
          revealedEvidenceIds: ['guante-trabajo'],
        },
        {
          id: 'm-q3',
          question: 'What do you know about manufacturing gem replicas?',
          answer:
            "That's my field, detective. Any experienced gemologist could... well, technically speaking... I don't understand where you're going with this.",
          emotionalState: 'evasive',
          revealedEvidenceIds: [],
        },
        {
          id: 'm-q4',
          question: 'We found a gemology supplies receipt in your name.',
          answer:
            "That's... for my regular work! I buy materials constantly. You can't accuse me without concrete proof!",
          emotionalState: 'angry',
          revealedEvidenceIds: ['recibo-materiales'],
        },
        {
          id: 'm-q5',
          question: 'Do you know anyone in the black-market jewelry trade?',
          answer:
            "I don't... that's a very serious accusation. I demand to speak with my lawyer immediately.",
          emotionalState: 'angry',
          revealedEvidenceIds: [],
        },
        {
          id: 'm-q6',
          question: 'A private buyer already paid you an advance for the diamond. Who is it?',
          answer:
            "I'm not going to give names. But yes, there was a buyer. An advance already collected. The rest is paid on delivery. That's where I stop talking.",
          emotionalState: 'angry',
          revealedEvidenceIds: ['chat-comprador'],
        },
      ],
    },
    {
      id: 'sofia-reyes',
      name: 'Sofía Reyes',
      age: 28,
      occupation: 'Socialite / Businesswoman',
      description:
        'A glamorous young woman. Whitmore\'s ex-girlfriend. She seems emotionally affected, but is it real or an act?',
      avatar: '💃',
      motive:
        'Revenge against Whitmore for a public humiliation. But she never went through with it — she only thought about stealing it.',
      alibi: 'She says she went to the restroom and took 30 minutes. There are no witnesses for that time.',
      isGuilty: false,
      dialogues: [
        {
          id: 's-q1',
          question: 'What is your relationship with Mr. Whitmore?',
          answer:
            "Ex-girlfriend. We broke up six months ago. I came to this gala because... well, because I wanted to show him I'm fine without him.",
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
        {
          id: 's-q2',
          question: 'Half an hour in the restroom is a long time, Miss Reyes.',
          answer:
            'I was crying, detective. Is that a crime? Seeing him with someone else affected me more than I expected. You can check my smeared makeup if you want.',
          emotionalState: 'sad',
          revealedEvidenceIds: ['copa-vino'],
        },
        {
          id: 's-q3',
          question: 'Did you want to steal the diamond for revenge?',
          answer:
            "I thought about it. I won't lie to you. But I didn't do it. I'm impulsive, not a criminal. There's a difference.",
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 's-q4',
          question: 'Did you see anyone near the exhibition hall?',
          answer:
            'Mr. Delgado. He was leaving with a briefcase when I was heading to the restrooms. I thought it was odd at that hour, but I didn\'t think much of it.',
          emotionalState: 'calm',
          revealedEvidenceIds: ['camara-seguridad', 'maletin-fotos'],
        },
      ],
    },
  ],

  evidence: [
    {
      id: 'fragmento-cristal',
      name: 'Glass Fragment',
      description: 'A small fragment of the display case glass.',
      type: 'physical',
      icon: '🔬',
      location: 'Central display case',
      isKey: false,
      analysis:
        'The glass was cleanly cut with a specialized tool, not broken. Whoever did it knew exactly how to open the case. We found a partial fingerprint on the inner edge.',
    },
    {
      id: 'ficha-evaluacion',
      name: 'Appraisal Form',
      description: 'Official diamond appraisal document, signed by Marco Delgado.',
      type: 'document',
      icon: '📋',
      location: 'Appraisal desk',
      isKey: true,
      analysis:
        'The form confirms that Marco Delgado had exclusive access to the diamond for 4 hours for its "technical appraisal." He also held the display case keys during that period. No one else had that access.',
    },
    {
      id: 'recibo-materiales',
      name: 'Special Jewelry Supplies Receipt',
      description: 'Purchase of high-quality resins, red pigments, and precision tools.',
      type: 'document',
      icon: '🧾',
      location: 'Corner trash bin',
      isKey: true,
      analysis:
        'Receipt under the name of Marco Delgado, dated three weeks before the gala. The materials are exactly what\'s needed to craft a convincing replica of a high-quality diamond. Total price: $4,200.',
    },
    {
      id: 'camara-seguridad',
      name: 'Security Photograph',
      description: 'Blurry image of a figure leaving the exhibition hall with a briefcase.',
      type: 'digital',
      icon: '📷',
      location: 'Security system',
      isKey: true,
      analysis:
        "The image shows an older male figure leaving the hall at 11:31 PM. He's carrying a brown leather briefcase — matching the one Delgado had at the gala. The angle doesn't show his face, but the silhouette and the briefcase are consistent.",
    },
    {
      id: 'guante-trabajo',
      name: 'Work Glove',
      description: 'Disposable surgical glove, size large.',
      type: 'physical',
      icon: '🧤',
      location: "Marco Delgado's hands, shown during the interrogation",
      isKey: true,
      analysis:
        'Disposable nitrile glove, size L. No external prints, but the inside has traces of gem dust and synthetic resin — the same materials from the purchase receipt. Delgado wears size L according to his purchase profile.',
    },
    {
      id: 'nota-amenaza',
      name: 'Anonymous Note',
      description: 'Threatening message addressed to "V.C." demanding immediate payment.',
      type: 'document',
      icon: '📝',
      location: "Valentina's purse",
      isKey: false,
      analysis:
        'A typewritten note threatening serious consequences if a debt isn\'t paid. The initials "V.C." point to Valentina Cruz. This confirms her debts but doesn\'t directly connect her to the robbery.',
    },
    {
      id: 'copa-vino',
      name: 'Wine Glass',
      description: 'Glass with blood-red lipstick marks, overturned near the display case.',
      type: 'physical',
      icon: '🍷',
      location: 'Side table next to the display case',
      isKey: false,
      analysis:
        "The lipstick matches the shade Sofía Reyes is wearing tonight. It confirms she was near the display case, but not at the time of the robbery. It could be from earlier in the gala.",
    },
    {
      id: 'maletin-fotos',
      name: 'Briefcase Photos',
      description: "Stills from different cameras showing Delgado's briefcase throughout the night.",
      type: 'digital',
      icon: '🗂️',
      location: 'Security system',
      isKey: false,
      analysis:
        "Four separate images show Marco Delgado's briefcase. At 9:00 PM it looks empty. At 11:35 PM, as he leaves the hotel, it looks considerably heavier. Something was added during the night.",
    },
    {
      id: 'chat-comprador',
      name: "ChatVía Thread: 'Private Collector'",
      description:
        'Conversation recovered from Marco Delgado\'s phone with a contact saved as "Private Collector."',
      type: 'digital',
      icon: '💬',
      location: "Marco Delgado's phone, forgotten in the coat check",
      isKey: true,
      analysis:
        'The conversation confirms the diamond swap was planned weeks in advance and that a buyer with an agreed payment already existed. Delgado promised to delete the thread after the gala — NubePlus\'s automatic backup kept it anyway.',
      digitalSourceId: 'msg-comprador-4',
    },
  ],

  hotspots: [
    {
      id: 'vitrina',
      x: 48,
      y: 40,
      label: 'Empty Display Case',
      evidenceId: 'fragmento-cristal',
      description: 'The central display case where the diamond once rested. The velvet pedestal is empty.',
      icon: '🔲',
    },
    {
      id: 'escritorio',
      x: 75,
      y: 55,
      label: 'Appraisal Desk',
      evidenceId: 'ficha-evaluacion',
      description: 'The table where the official appraiser did his work. Papers scattered about.',
      icon: '🗃️',
    },
    {
      id: 'basurero',
      x: 20,
      y: 70,
      label: 'Corner Trash Bin',
      evidenceId: 'recibo-materiales',
      description: 'A small metal trash bin. Someone tried to get rid of something.',
      icon: '🗑️',
    },
    {
      id: 'camara',
      x: 85,
      y: 15,
      label: 'Security Camera',
      evidenceId: 'camara-seguridad',
      description: 'The camera covering the exit door. The footage is available in the system.',
      icon: '📹',
    },
    {
      id: 'mesa-buffet',
      x: 30,
      y: 45,
      label: 'Table with Glass',
      evidenceId: 'copa-vino',
      description: 'A side table with an overturned glass and leftover appetizers.',
      icon: '🍽️',
    },
    {
      id: 'guardarropa',
      x: 60,
      y: 78,
      label: 'Coat Check',
      evidenceId: null,
      deviceId: 'phone-delgado',
      description: 'A phone was left forgotten among the coats in the coat check near the hall.',
      icon: '🧥',
    },
  ],

  digitalDevices: [
    {
      id: 'phone-delgado',
      ownerSuspectId: 'marco-delgado',
      label: "Marco Delgado's Phone",
      lockType: 'pin',
      unlockCode: '1103',
      unlockHint: 'The date of his official diamond appraisal was "four days before the gala." Day and month, no spaces.',
      apps: ['chatvia', 'anotta'],
      threads: [
        {
          id: 'thread-comprador',
          appId: 'chatvia',
          title: 'Private Collector',
          participants: ['Marco Delgado', 'Private Collector'],
          isDeleted: true,
          messages: [
            {
              id: 'msg-comprador-1',
              sender: 'Private Collector',
              timestamp: '6 days ago, 10:14 PM',
              text: 'Will the piece be ready for the gala?',
            },
            {
              id: 'msg-comprador-2',
              sender: 'Marco Delgado',
              timestamp: '6 days ago, 10:20 PM',
              text: "It'll be ready. The swap was already made during the official appraisal. No one noticed.",
            },
            {
              id: 'msg-comprador-3',
              sender: 'Private Collector',
              timestamp: '6 days ago, 10:21 PM',
              text: 'The second payment is on delivery. No photos, no messages after tonight.',
            },
            {
              id: 'msg-comprador-4',
              sender: 'Marco Delgado',
              timestamp: '6 days ago, 10:25 PM',
              text: "Understood. I'll delete this conversation after the gala.\n\n[Forensic note: the conversation was not deleted — NubePlus's automatic backup preserved it.]",
              evidenceId: 'chat-comprador',
            },
          ],
        },
      ],
      notes: [
        {
          id: 'nota-borrador-delgado',
          appId: 'anotta',
          title: 'Untitled',
          isDeleted: true,
          body:
            "Thirty years of a career so that an idiot like Whitmore can buy what he doesn't know how to appreciate. He can't even tell an excellent cut from a mediocre one. He deserves the replica. I deserve—\n\n(the note ends there, the last changes never saved)",
        },
      ],
    },
  ],

  tensionEvents: [
    {
      id: 'tension-001-hint',
      triggerActionCount: 6,
      message: "Something tells you you haven't finished going through Delgado's belongings.",
      effect: {
        revealHint:
          "You feel like you're missing something about the phone left in the coat check — maybe you should check it before making an accusation.",
      },
    },
    {
      id: 'tension-001-lock',
      triggerActionCount: 14,
      message:
        "It's too late now — Delgado's thread with the buyer vanished from the phone, along with the note he never saved.",
      effect: {
        lockThreadIds: ['thread-comprador'],
        lockNoteIds: ['nota-borrador-delgado'],
      },
    },
  ],

  correctConnections: [
    { fromId: 'ficha-evaluacion', toId: 'marco-delgado' },
    { fromId: 'recibo-materiales', toId: 'marco-delgado' },
    { fromId: 'guante-trabajo', toId: 'marco-delgado' },
    { fromId: 'camara-seguridad', toId: 'marco-delgado' },
    { fromId: 'chat-comprador', toId: 'marco-delgado' },
    { fromId: 'nota-amenaza', toId: 'valentina-cruz' },
    { fromId: 'copa-vino', toId: 'sofia-reyes' },
  ],

  solution: {
    guiltyId: 'marco-delgado',
    explanation:
      'Marco Delgado, the expert gemologist, planned the theft for weeks. Using his official access as appraiser, he crafted a perfect replica of the diamond and swapped it during the technical appraisal four days before the gala. The night of the event, he simply collected his "work" from the display case using the keys he still had in his possession. The disposable gloves, the materials receipt, and the security camera give him away. He had a black-market buyer with an advance already collected.',
    timeline: [
      { time: 'Three weeks ago', description: 'Delgado buys materials to craft the replica.' },
      { time: 'Four days ago', description: 'During the official appraisal, he swaps the real diamond for the replica.' },
      { time: '9:00 PM', description: 'He arrives at the gala with the briefcase (apparently empty).' },
      { time: '11:28 PM', description: 'He puts on gloves in the restroom and heads to the exhibition hall.' },
      { time: '11:32 PM', description: 'He opens the case, takes the real diamond, closes the case.' },
      { time: '11:35 PM', description: 'He leaves the hotel with the loaded briefcase. The camera catches him.' },
      { time: '12:15 AM', description: 'The robbery is discovered when Whitmore goes to show the jewel to his guests.' },
    ],
    proof: {
      means: ['recibo-materiales', 'guante-trabajo'],
      motive: ['chat-comprador'],
      opportunity: ['ficha-evaluacion'],
    },
  },
}

export default case001
