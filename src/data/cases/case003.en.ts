import type { Case } from '../../types'

const case003: Case = {
  id: 'case-003',
  title: 'Shadows on the Harbor',
  subtitle: 'The sea keeps secrets',
  description:
    'Captain Armando Fuentes is found dead in the cargo hold of his ship at the Port of San Marcos. Police call it a "workplace accident." The marks on his body say otherwise.',
  difficulty: 'Difícil',
  location: 'Port of San Marcos',
  date: 'May 8th, 3:22 AM',
  thumbnail: '⚓',
  color: '#1a4a2e',
  intro:
    'The Port of San Marcos sleeps under a thick fog. Only the sound of water against metal hulls breaks the silence. Armando Fuentes — a sailor for 20 years, a respected captain — lies at the foot of a loading platform. His partners say he slipped. But slips don\'t leave marks like that. Someone pushed him. And someone is covering it up.',
  crimeSceneDescription:
    'The cargo hold of the ship "Estrella del Sur" smells of salt and diesel engine. Marks on the floor suggest a struggle. The upper handrail is loose. Business documents sit on the navigation table. The ship\'s GPS tracker was disabled.',

  suspects: [
    {
      id: 'diego-navarro',
      name: 'Diego Navarro',
      age: 42,
      occupation: 'Businessman / Business Partner',
      description:
        'An elegant man, out of place at a port. Expensive suit, expensive watch, answers that are too carefully prepared.',
      avatar: '🤵',
      motive:
        "Fuentes's partner in a smuggling network. He wanted to keep 100% of the business and eliminate the only witness who could sink him.",
      alibi: 'He says he was at a hotel in the city. The check-in log puts him arriving at 3:15 AM — after the death.',
      isGuilty: true,
      dialogues: [
        {
          id: 'd-q1',
          question: 'What was your relationship with Captain Fuentes?',
          answer:
            'Business partners. We imported raw materials from abroad. All completely legal and documented.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'd-q2',
          question: 'The hotel log puts you arriving at 3:15. The death was at 3:22.',
          answer:
            'I must have mixed up the time. I arrived earlier, surely. The hotel staff isn\'t always careful. It\'s a logging error.',
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 'd-q3',
          question: 'We found a life insurance policy with you as the beneficiary.',
          answer:
            "That's... standard practice between business partners. If one dies, the other needs compensation to keep the business running. It's completely normal.",
          emotionalState: 'evasive',
          revealedEvidenceIds: ['poliza-seguro'],
        },
        {
          id: 'd-q4',
          question: 'What was the ship carrying on its last voyage?',
          answer:
            "Raw materials. I already said that. I don't keep the manifests in my head, that's what the documents are for.",
          emotionalState: 'evasive',
          revealedEvidenceIds: ['cargamento-sospechoso'],
        },
        {
          id: 'd-q5',
          question: 'We have a photograph of you with Fuentes and undeclared merchandise.',
          answer:
            "That photo is out of context. I... I demand a lawyer. I'm not saying anything else.",
          emotionalState: 'angry',
          revealedEvidenceIds: ['fotografia-contrabando'],
        },
        {
          id: 'd-q6',
          question: 'What happened to your phone that night?',
          answer:
            "I dropped it leaving the ship, near the gangway. I didn't have time to look for it, I needed to get to the hotel as soon as possible.",
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 'd-q7',
          question: "We audited the hotel's records. There's an undeclared payment to the concierge that early morning.",
          answer:
            "I don't know anything about that. If the concierge took money, that's his problem, not mine.",
          emotionalState: 'angry',
          revealedEvidenceIds: ['chat-alibi-comprado'],
        },
      ],
    },
    {
      id: 'isabel-reyes',
      name: 'Isabel Reyes',
      age: 35,
      occupation: 'Trader? (Undercover Agent)',
      description:
        'A guarded woman with a calculating stare. She gives minimal answers. She seems to know more than she says.',
      avatar: '🕵️',
      motive:
        "She's been investigating the smuggling network for 8 months. She was at the port that night to document, not to kill.",
      alibi: 'She was photographing the ship from a nearby pier. She has time-stamped photos.',
      isGuilty: false,
      dialogues: [
        {
          id: 'i-q1',
          question: 'What were you doing at the port at 3 in the morning?',
          answer:
            "I'm not obligated to answer that. I have my reasons.",
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'i-q2',
          question: 'This is a homicide investigation. I need you to cooperate.',
          answer:
            "Fine. You can call the number on this card. It'll confirm my identity and clearance. I work for someone who's been investigating Fuentes and Navarro for months.",
          emotionalState: 'calm',
          revealedEvidenceIds: ['credencial-agente'],
        },
        {
          id: 'i-q3',
          question: 'Did you see Diego Navarro that night?',
          answer:
            "Yes. I saw him board the ship at 2:47 AM. Alone. He left at 3:18. I have photos. I'll give them to you — Navarro is the target, not me.",
          emotionalState: 'calm',
          revealedEvidenceIds: ['fotos-vigilancia'],
        },
        {
          id: 'i-q4',
          question: "Why didn't you call the police when you saw Navarro?",
          answer:
            "Because my operation didn't have enough evidence yet. A premature arrest would've destroyed eight months of work. I didn't know he was going to kill someone that night.",
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
      ],
    },
    {
      id: 'rafael-moreno',
      name: 'Rafael Moreno',
      age: 28,
      occupation: 'Dockworker',
      description:
        'A strong young man with visible scars on his arms. Nervous. Clearly afraid of something, or someone.',
      avatar: '⚓',
      motive:
        'He owed Fuentes $15,000 from a gambling debt. He has motive, but he didn\'t carry out the crime.',
      alibi: 'He was at "El Ancla" bar until 2:00 AM. Two bartenders confirm it.',
      isGuilty: false,
      dialogues: [
        {
          id: 'ra-q1',
          question: 'Did you know Captain Fuentes well?',
          answer:
            'I worked on his ship two years ago. Good boss. Demanding but fair.',
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
        {
          id: 'ra-q2',
          question: 'We know about the $15,000 debt you had with Fuentes.',
          answer:
            "Yes. I owe him money. But that doesn't mean I killed him. Why would I kill the one person who could actually collect from me? That doesn't make sense.",
          emotionalState: 'nervous',
          revealedEvidenceIds: ['deuda-escrita'],
        },
        {
          id: 'ra-q3',
          question: 'What are those scars from?',
          answer:
            "From a fight three months ago. Nothing to do with this. The guy who did it is in prison.",
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 'ra-q4',
          question: 'Did you notice anything unusual at the port these past few weeks?',
          answer:
            "Fuentes's partner — Navarro — came to the ship at odd hours. And once I heard Fuentes tell him he \"didn't want to continue the deal anymore.\" Navarro didn't take it well.",
          emotionalState: 'evasive',
          revealedEvidenceIds: ['mensaje-borrado'],
        },
      ],
    },
  ],

  evidence: [
    {
      id: 'huella-pasamanos',
      name: 'Handrail Print',
      description: 'A complete fingerprint on the upper platform handrail.',
      type: 'physical',
      icon: '🖐️',
      location: 'Upper cargo platform',
      isKey: true,
      analysis:
        "A perfectly preserved fingerprint on the upper handrail — the only spot from which someone could have pushed Fuentes. The print belongs to Diego Navarro, per commercial police records (he has one on file from an earlier civil dispute).",
    },
    {
      id: 'poliza-seguro',
      name: 'Life Insurance Policy',
      description: 'A recent policy with Diego Navarro as sole beneficiary.',
      type: 'document',
      icon: '📄',
      location: "Captain's filing cabinet",
      isKey: true,
      analysis:
        'A $500,000 life insurance policy under the name of Armando Fuentes, with Diego Navarro named as beneficiary. Issue date: exactly 14 days ago. This policy didn\'t exist a month ago. Navarro signed it as "designated business partner."',
    },
    {
      id: 'fotos-vigilancia',
      name: 'Surveillance Photos',
      description: 'Time-stamped photographs of Navarro entering and leaving the ship.',
      type: 'digital',
      icon: '📸',
      location: "Isabel Reyes's phone",
      isKey: true,
      analysis:
        'A series of photographs with verifiable metadata: Navarro boards the ship at 2:47 AM, leaves at 3:18 AM. Fuentes\'s death occurred at 3:22 AM per the medical examiner. Navarro was on the ship right up until the death.',
    },
    {
      id: 'mensaje-borrado',
      name: 'Recovered Text Message',
      description: 'A fragment of a deleted conversation between Fuentes and Navarro.',
      type: 'digital',
      icon: '📱',
      location: "Victim's phone",
      isKey: true,
      analysis:
        'Forensic phone recovery: "...I don\'t care what you say, I\'m out of this. If that\'s a problem, talk to [DELETED]... tomorrow on the ship and we settle this once and for all. I\'ve already decided." — Fuentes to Navarro, 11:45 PM the day before. Fuentes wanted to leave the business.',
    },
    {
      id: 'cargamento-sospechoso',
      name: 'Altered Manifest',
      description: 'Cargo document with suspicious corrections and overwrites.',
      type: 'document',
      icon: '📦',
      location: 'Navigation table',
      isKey: false,
      analysis:
        "The manifest for the last voyage lists 2.3 tons of \"decorative ceramics.\" But the ship's draft, per port records, indicates an actual weight of 4.1 tons. The undeclared difference matches high-value black-market cargo.",
    },
    {
      id: 'credencial-agente',
      name: 'Official Credentials',
      description: 'Undercover agent identification from the Customs Agency.',
      type: 'document',
      icon: '🪪',
      location: 'Isabel Reyes (when questioned)',
      isKey: false,
      analysis:
        "Verified, active credentials showing Isabel Reyes as a special agent with the Customs Anti-Smuggling Unit. Her presence at the port that night was part of an 8-month operation. She's not a suspect — she's an unexpected ally.",
    },
    {
      id: 'deuda-escrita',
      name: "Rafael Moreno's IOU",
      description: 'A signed document acknowledging the $15,000 debt.',
      type: 'document',
      icon: '📝',
      location: "Captain's desk drawer",
      isKey: false,
      analysis:
        "IOU signed by Rafael Moreno. The motive exists, but Moreno's alibi (confirmed by two witnesses at the bar) rules him out as the perpetrator. The debt gives context but doesn't point to the killer.",
    },
    {
      id: 'fotografia-contrabando',
      name: 'Compromising Photograph',
      description: 'A photo of Navarro and Fuentes next to unlabeled merchandise.',
      type: 'physical',
      icon: '🖼️',
      location: "Ship's hidden compartment",
      isKey: false,
      analysis:
        'A polaroid photograph showing Navarro and Fuentes smiling next to unmarked crates in a different port warehouse. Date written on the back: 8 months ago. It confirms the criminal partnership between the two, and Navarro\'s motive to silence Fuentes.',
    },
    {
      id: 'chat-alibi-comprado',
      name: "ChatVía Thread: 'Malecón Hotel Concierge'",
      description: "Conversation recovered from Diego Navarro's phone with the hotel concierge.",
      type: 'digital',
      icon: '🏨',
      location: "Diego Navarro's phone, found on the outer pier",
      isKey: true,
      analysis:
        "In the early hours of the crime, minutes after 3:22 AM, Navarro paid the concierge to alter the hotel's check-in log. The \"official\" 3:15 AM time backing his alibi was fabricated that same night, after Fuentes's death.",
      digitalSourceId: 'msg-conserje-4',
    },
  ],

  hotspots: [
    {
      id: 'pasamanos',
      x: 55,
      y: 22,
      label: 'Upper Handrail',
      evidenceId: 'huella-pasamanos',
      description: 'The metal handrail on the loading platform. It\'s slightly loose.',
      icon: '🔩',
    },
    {
      id: 'archivador-barco',
      x: 72,
      y: 54,
      label: "Captain's Filing Cabinet",
      evidenceId: 'poliza-seguro',
      description: 'A rusty filing cabinet with personal and business documents.',
      icon: '🗂️',
    },
    {
      id: 'mesa-navegacion',
      x: 35,
      y: 52,
      label: 'Navigation Table',
      evidenceId: 'cargamento-sospechoso',
      description: 'A table with nautical charts, a logbook, and cargo manifests.',
      icon: '🗺️',
    },
    {
      id: 'telefono-victima',
      x: 25,
      y: 70,
      label: "Victim's Phone",
      evidenceId: 'mensaje-borrado',
      description: "Fuentes's cell phone, screen cracked. Needs forensic extraction.",
      icon: '📱',
    },
    {
      id: 'compartimiento',
      x: 86,
      y: 76,
      label: 'Hidden Compartment',
      evidenceId: 'fotografia-contrabando',
      description: 'A loose metal panel in the cargo hold wall. It\'s hiding something.',
      icon: '🚪',
    },
    {
      id: 'muelle-exterior',
      x: 68,
      y: 78,
      label: 'Outer Pier',
      evidenceId: null,
      deviceId: 'phone-navarro',
      description: "Next to the ship's exit gangway, a phone with a shattered screen lies among the ropes.",
      icon: '📱',
    },
  ],

  digitalDevices: [
    {
      id: 'phone-navarro',
      ownerSuspectId: 'diego-navarro',
      label: "Diego Navarro's Phone",
      lockType: 'pin',
      unlockCode: '2404',
      unlockHint:
        'The insurance policy was issued "exactly 14 days" before the crime — May 8th. Count 14 days back. Day and month, no spaces.',
      apps: ['chatvia', 'vozal'],
      threads: [
        {
          id: 'thread-conserje',
          appId: 'chatvia',
          title: 'Malecón Hotel Concierge',
          participants: ['Diego Navarro', 'Concierge'],
          isDeleted: true,
          messages: [
            {
              id: 'msg-conserje-1',
              sender: 'Diego Navarro',
              timestamp: 'today, 3:25 AM',
              text: 'I need my check-in tonight logged before 3. It\'s important.',
            },
            {
              id: 'msg-conserje-2',
              sender: 'Concierge',
              timestamp: 'today, 3:27 AM',
              text: 'Mr. Navarro, the shift audit cutoff already passed. I can try to move it, but it\'s not free.',
            },
            {
              id: 'msg-conserje-3',
              sender: 'Diego Navarro',
              timestamp: 'today, 3:29 AM',
              text: 'Whatever it takes. Double transfer first thing tomorrow. I need this fixed now.',
            },
            {
              id: 'msg-conserje-4',
              sender: 'Concierge',
              timestamp: 'today, 3:41 AM',
              text: "Done. It's logged at 3:15 — that's the earliest I could move it without tripping an alert. Don't ask about this again, and don't message me here again.",
              evidenceId: 'chat-alibi-comprado',
            },
          ],
        },
        {
          id: 'thread-buzon',
          appId: 'vozal',
          title: 'Voicemail: Puerto Norte',
          participants: ['Diego Navarro', 'Puerto Norte'],
          messages: [
            {
              id: 'msg-buzon-1',
              sender: 'Puerto Norte',
              timestamp: '2 days ago, 11:10 PM',
              text: '[Automatic transcription] "Diego, Thursday\'s cargo can\'t be delayed again. If Fuentes keeps having doubts, you handle it. You know how this ends if it doesn\'t arrive on time."',
            },
          ],
        },
      ],
      notes: [],
    },
  ],

  tensionEvents: [
    {
      id: 'tension-003-hint',
      triggerActionCount: 6,
      message: "Something doesn't add up in Navarro's alibi — maybe he left something behind.",
      effect: {
        revealHint: "Check the outer pier, near the ship's exit gangway.",
      },
    },
    {
      id: 'tension-003-lock',
      triggerActionCount: 14,
      message:
        "It's too late now — the thread with the hotel concierge vanished from Navarro's phone, along with the voicemail.",
      effect: {
        lockThreadIds: ['thread-conserje', 'thread-buzon'],
      },
    },
  ],

  correctConnections: [
    { fromId: 'huella-pasamanos', toId: 'diego-navarro' },
    { fromId: 'poliza-seguro', toId: 'diego-navarro' },
    { fromId: 'fotos-vigilancia', toId: 'diego-navarro' },
    { fromId: 'mensaje-borrado', toId: 'diego-navarro' },
    { fromId: 'fotografia-contrabando', toId: 'diego-navarro' },
    { fromId: 'chat-alibi-comprado', toId: 'diego-navarro' },
    { fromId: 'credencial-agente', toId: 'isabel-reyes' },
    { fromId: 'deuda-escrita', toId: 'rafael-moreno' },
  ],

  solution: {
    guiltyId: 'diego-navarro',
    explanation:
      "Diego Navarro killed Captain Fuentes to protect his smuggling network and collect the life insurance. When Fuentes told him by message that he wanted to leave the business, Navarro understood he was a liability: he could talk to the authorities. He went to the ship at 2:47 AM, they argued on the upper platform, and Navarro pushed him. He forgot to wipe his print from the handrail — the one mistake in an otherwise calculated plan. Agent Isabel Reyes photographed him without knowing she had just documented a killer.",
    timeline: [
      { time: '11:45 PM (the day before)', description: 'Fuentes sends Navarro a message: he wants out of the business.' },
      { time: '2:47 AM', description: 'Navarro boards the ship. Isabel Reyes photographs him from the pier.' },
      { time: '2:50 AM', description: 'Navarro and Fuentes argue on the upper platform.' },
      { time: '3:20 AM', description: 'Navarro pushes Fuentes off the platform. Print left on the handrail.' },
      { time: '3:18 AM', description: 'Navarro leaves the ship. Photographed on his way out.' },
      { time: '3:22 AM', description: "Fuentes's body is found by a night watchman." },
      { time: '3:45 AM', description: 'Navarro arrives at the hotel and checks in. A late-fabricated alibi.' },
    ],
    proof: {
      means: ['huella-pasamanos'],
      motive: ['poliza-seguro', 'fotografia-contrabando'],
      opportunity: ['fotos-vigilancia', 'chat-alibi-comprado'],
    },
  },
}

export default case003
