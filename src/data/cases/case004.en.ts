import type { Case } from '../../types'

const case004: Case = {
  id: 'case-004',
  title: 'Forty-Eight Hours',
  subtitle: "What she deleted didn't disappear",
  description:
    "Valeria Ontiveros, a 26-year-old influencer, is found dead in her apartment after a fall from the balcony. Police close it as an accident. Her best friend doesn't believe it, and hands you Valeria's phone before the police can check it. You have 48 hours before the case is closed for good.",
  difficulty: 'Medio',
  location: 'Torre Cielo, Apartment 14B',
  date: 'September 3rd, 11:58 PM',
  thumbnail: '📱',
  color: '#5b2c8f',
  intro:
    "Valeria Ontiveros's apartment still has the lights from her last live stream on. She fell from the 14th-floor balcony two nights ago. Seven hundred thousand people followed her online; none of them were watching when it happened. Her best friend, Renata, snuck into the apartment before the police sealed it off and rescued the only thing that matters: Valeria's phone, unlocked, screen still on. What's on it doesn't add up to an accident.",
  crimeSceneDescription:
    "Valeria's apartment is a showcase of her own life: walls with framed brand photos, a ring light for streaming still mounted on the tripod, an unfinished glass of wine on the coffee table. The balcony's sliding door is still open. Her phone, handed over by Renata, sits on the bed. The real crime scene isn't this room. It's what's on the screen.",

  suspects: [
    {
      id: 'renata-cifuentes',
      name: 'Renata Cifuentes',
      age: 27,
      occupation: 'Best friend and content manager',
      description:
        "Devastated but functional. She knows every one of Valeria's passwords and her voice doesn't waver admitting it.",
      avatar: '💻',
      motive:
        "She managed Valeria's finances and was taking a growing percentage of her sponsorship income; they argued about money last week.",
      alibi: 'She says she was at her own apartment editing video until past midnight.',
      isGuilty: false,
      dialogues: [
        {
          id: 'ren-q1',
          question: "Why did you have the victim's phone before the police did?",
          answer:
            "Because I know all her passwords, detective, I set them up myself a year ago. And because I don't trust the police to look properly. They already decided it was an accident without checking anything.",
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 'ren-q2',
          question: 'Is it true you argued about money last week?',
          answer:
            "Yes. I raised my commission from 15 to 20 percent. She got mad. Every manager argues with their clients about money, that doesn't mean they throw them off a balcony.",
          emotionalState: 'evasive',
          revealedEvidenceIds: ['nota-comision'],
        },
        {
          id: 'ren-q3',
          question: 'Did you know Valeria was being harassed?',
          answer:
            'I knew. I begged her to make the complaint against him public. She refused, said she was going to "handle it herself." I wish she\'d listened to me.',
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
        {
          id: 'ren-q4',
          question: 'Where exactly were you between 11:00 PM and midnight?',
          answer:
            "At my apartment, fifteen minutes from here, editing the next day's video. The files have save timestamps, check them.",
          emotionalState: 'calm',
          revealedEvidenceIds: ['metadata-edicion'],
        },
        {
          id: 'ren-q5',
          question: 'A message from you says "this is getting out of hand." What were you referring to?',
          answer:
            'To the stalker, not to Valeria. She told me everything he sent her. I was terrified for her, not against her.',
          emotionalState: 'angry',
          revealedEvidenceIds: [],
        },
        {
          id: 'ren-q6',
          question: 'What was the last thing Valeria wrote you that night?',
          answer:
            "That someone was ringing the doorbell, odd at that hour, that she'd write me back. She never wrote back. I checked the chat a thousand times that night thinking she'd just gotten caught up in something silly.",
          emotionalState: 'sad',
          revealedEvidenceIds: ['chat-renata-valeria'],
        },
      ],
    },
    {
      id: 'bruno-salcedo',
      name: 'Bruno Salcedo',
      age: 31,
      occupation: 'Ex-partner',
      description:
        "A recent, public breakup. He talks about Valeria with a mix of resentment and guilt that doesn't quite add up.",
      avatar: '🕴️',
      motive: 'Valeria had hinted online that she was going to "tell the truth" about him.',
      alibi: 'He says he was on a flight that night, landing at 11:40 PM.',
      isGuilty: false,
      dialogues: [
        {
          id: 'bru-q1',
          question: 'Your relationship with the victim ended a month ago, publicly and badly.',
          answer:
            'She made it public, not me. She posted subtweets for weeks. I just wanted it to stop.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['posts-indirectas'],
        },
        {
          id: 'bru-q2',
          question: 'Your flight landed at 11:40 PM. She died at 11:58 PM. Where were you those eighteen minutes?',
          answer:
            "At the airport, getting my luggage. I didn't go to her apartment, if that's what you're implying.",
          emotionalState: 'evasive',
          revealedEvidenceIds: ['ubicacion-taxi'],
        },
        {
          id: 'bru-q3',
          question: 'Valeria said online she was going to "tell the truth" about you. The truth about what?',
          answer:
            "Nothing illegal, if that's what you're thinking. Relationship stuff, embarrassing, not criminal. I didn't kill her over that.",
          emotionalState: 'angry',
          revealedEvidenceIds: [],
        },
        {
          id: 'bru-q4',
          question: 'We found insistent messages from you sent that same night.',
          answer:
            "I was drunk and sad, I wasn't threatening her. Anyone can send pathetic texts to their ex without being a murderer.",
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
      ],
    },
    {
      id: 'ismael-duarte',
      name: 'Ismael Duarte',
      age: 24,
      occupation: 'Fan community administrator',
      description:
        "He talks about Valeria with a familiarity no one asked for. Careful with every word — until he isn't.",
      avatar: '🎭',
      motive:
        'Unrequited obsession; Valeria blocked him and reported his behavior, which threatened to expose him and cost him his role as moderator.',
      alibi: 'He says he was "home, online," and that it can be verified with his activity.',
      isGuilty: true,
      dialogues: [
        {
          id: 'ism-q1',
          question: 'How did you know Valeria Ontiveros?',
          answer:
            "I'm... I was the administrator of her biggest fan community. I knew her better than her own family, in a way.",
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'ism-q2',
          question: 'She blocked you and reported your account ten days ago. Why?',
          answer:
            "It was a misunderstanding. I sent her too many messages, maybe. I was worried about her. That's not a crime, detective.",
          emotionalState: 'nervous',
          revealedEvidenceIds: ['denuncia-valeria'],
        },
        {
          id: 'ism-q3',
          question: 'Your alibi says you were "online" all night. Explain that.',
          answer:
            "I scheduled posts to look automatic... for an alibi, yes. But that doesn't prove anything, it only proves I'm careful.",
          emotionalState: 'evasive',
          revealedEvidenceIds: ['actividad-programada'],
        },
        {
          id: 'ism-q4',
          question: 'Your phone was in the Torre Cielo area that night, according to the cell tower log.',
          answer:
            "That doesn't prove I went up to her apartment! I can be in the area without having entered the building. You need more than that!",
          emotionalState: 'angry',
          revealedEvidenceIds: ['triangulacion-celular'],
        },
        {
          id: 'ism-q5',
          question: 'We recovered your never-sent draft: "if you\'re not going to listen to me, I\'m coming up anyway."',
          answer:
            "I never sent her that! It was just to vent, I was never going to hurt her, I loved her, she didn't understand—!",
          emotionalState: 'angry',
          revealedEvidenceIds: ['borrador-ismael'],
        },
        {
          id: 'ism-q6',
          question: "We recovered audio from Valeria's live stream right before her death.",
          answer:
            "That doesn't prove it was me! A voice isn't a face, it could've been anyone!",
          emotionalState: 'angry',
          revealedEvidenceIds: ['video-eliminado-recuperado'],
        },
      ],
    },
    {
      id: 'karina-ossa',
      name: 'Karina Ossa',
      age: 35,
      occupation: 'Sponsor brand manager',
      description: 'Professional even in grief. She calculates every answer in terms of reputational risk.',
      avatar: '👔',
      motive:
        "Valeria was threatening to break her exclusivity contract after learning the brand knew about the complaints against Ismael and hadn't acted.",
      alibi: 'Corporate dinner with six witnesses until 1 AM.',
      isGuilty: false,
      dialogues: [
        {
          id: 'kar-q1',
          question: 'What relationship did the brand have with Ismael Duarte?',
          answer:
            'He was a volunteer moderator for our official community. We didn\'t have formal contracts with moderators, so technically he wasn\'t "ours." A technicality I\'m now ashamed of.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'kar-q2',
          question: 'Valeria was threatening to break her exclusivity contract.',
          answer:
            "Yes. And rightly so, honestly. We knew about the complaints against Ismael for weeks and didn't act fast. That would've cost us a lot of money, I won't deny it.",
          emotionalState: 'nervous',
          revealedEvidenceIds: ['correo-contrato'],
        },
        {
          id: 'kar-q3',
          question: "Did you know about Ismael's behavior toward her?",
          answer:
            "I knew there were internal complaints. I didn't know it was that serious. If I'd truly known, I would've removed him from the community immediately.",
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
        {
          id: 'kar-q4',
          question: 'Where were you the night she died?',
          answer:
            'At the quarterly dinner with the brand team, until one in the morning. Six people and a time-stamped receipt can confirm it.',
          emotionalState: 'calm',
          revealedEvidenceIds: ['recibo-cena'],
        },
      ],
    },
  ],

  evidence: [
    {
      id: 'copa-vino-valeria',
      name: 'Wine Glass',
      description: 'An unfinished glass of wine on the coffee table.',
      type: 'physical',
      icon: '🍷',
      location: 'Coffee table',
      isKey: false,
      analysis:
        "Low blood alcohol level despite the glass; Valeria wasn't as drunk as initially assumed in the police report.",
    },
    {
      id: 'puerta-balcon',
      name: 'Balcony Sliding Door',
      description: 'The door leading to the balcony she fell from.',
      type: 'physical',
      icon: '🚪',
      location: 'Balcony',
      isKey: true,
      analysis:
        'The latch was forced from the outer track, suggesting someone entered from the adjoining balcony or forced it open without using the inside handle.',
    },
    {
      id: 'tripode-luz',
      name: 'Tripod with Ring Light',
      description: 'A toppled tripod, still on when the body was found.',
      type: 'physical',
      icon: '💡',
      location: 'Main room',
      isKey: false,
      analysis:
        'It was on and recording at the moment of the fall, but the file of that specific stream was remotely deleted minutes later.',
    },
    {
      id: 'chat-renata-valeria',
      name: 'ChatVía Thread: Renata and Valeria',
      description: 'The last messages between Valeria and her best friend before she died.',
      type: 'digital',
      icon: '💬',
      location: "Valeria's phone",
      isKey: true,
      analysis:
        'Valeria mentions that Ismael messaged her again from a new account. The last message she sent, at 11:41 PM, says someone is ringing the doorbell. She never wrote again.',
      digitalSourceId: 'msg-renata-5',
    },
    {
      id: 'video-eliminado-recuperado',
      name: 'Deleted Stream Fragment',
      description: 'Recovered from the backup server — the live stream Valeria was recording when she died.',
      type: 'digital',
      icon: '🎥',
      location: 'Backup server, recovered with a court order',
      isKey: true,
      analysis:
        "You can hear Valeria interrupt the stream for the doorbell, a low male voice, a brief struggle, and a metallic clang before silence. The signal was manually cut 6 minutes later from an administrative account that was never revoked — activated that night at 11:52 PM, eight minutes before the signal was cut.",
      digitalSourceId: 'note-video-1',
    },
    {
      id: 'nota-comision',
      name: "Renata's Anotta Note",
      description: 'A note about the commission dispute with Valeria.',
      type: 'digital',
      icon: '🗒️',
      location: "Renata's phone",
      isKey: false,
      analysis: "Confirms the recent financial dispute, but there's nothing to suggest violence — just money.",
    },
    {
      id: 'metadata-edicion',
      name: 'Editing File Metadata',
      description: "Save log for Renata's video files.",
      type: 'digital',
      icon: '📁',
      location: "Renata's laptop",
      isKey: true,
      analysis:
        "The files show constant saves between 11:05 PM and 12:20 AM, consistent with her alibi. Renata didn't leave her apartment that night.",
    },
    {
      id: 'posts-indirectas',
      name: 'Archived Posts',
      description: "Screenshots of Valeria's public posts about Bruno.",
      type: 'digital',
      icon: '📲',
      location: 'NubePlus backup',
      isKey: false,
      analysis: "Public subtweets aimed at Bruno in the weeks before Valeria's death.",
    },
    {
      id: 'ubicacion-taxi',
      name: 'Ride Log',
      description: 'A ride-hailing app record used by Bruno that night.',
      type: 'digital',
      icon: '🚕',
      location: "Bruno's phone",
      isKey: true,
      analysis:
        'The record confirms Bruno went straight from the airport to his home, no detours toward Torre Cielo. His alibi is verified.',
    },
    {
      id: 'denuncia-valeria',
      name: 'Internal Complaint Report',
      description: 'The complaint Valeria filed against Ismael in the fan community.',
      type: 'document',
      icon: '📄',
      location: 'Community admin panel',
      isKey: true,
      analysis:
        'Valeria reported repeated harassment by Ismael ten days before she died, and requested his administrative access be revoked. It was never carried out.',
    },
    {
      id: 'actividad-programada',
      name: 'Scheduled Posts Log',
      description: "Automatic posts on Ismael's account during the night of the crime.",
      type: 'digital',
      icon: '⏲️',
      location: "Ismael's account",
      isKey: true,
      analysis:
        "That night's posts were scheduled in advance, not written in real time — a fabricated alibi to simulate an online presence.",
    },
    {
      id: 'triangulacion-celular',
      name: 'Cell Tower Triangulation',
      description: 'A phone company record, obtained with a court order.',
      type: 'digital',
      icon: '📡',
      location: 'Phone company',
      isKey: true,
      analysis:
        'Ismael\'s phone was in the Torre Cielo area between 11:30 PM and 12:10 AM that night, contradicting his alibi of being "at home."',
    },
    {
      id: 'borrador-ismael',
      name: 'Never-Sent Draft',
      description: "Anotta note from Ismael's phone, seized under a search warrant.",
      type: 'digital',
      icon: '📝',
      location: "Ismael's phone",
      isKey: true,
      analysis:
        '"If you\'re not going to listen to me, I\'m coming up anyway." Written and never sent, the same night Valeria died.',
    },
    {
      id: 'correo-contrato',
      name: 'Internal Brand Email',
      description: "Email about Valeria's exclusivity contract.",
      type: 'document',
      icon: '✉️',
      location: "Karina's laptop",
      isKey: false,
      analysis: "Confirms the brand knew about the risk of losing Valeria's contract because of the complaints against Ismael.",
    },
    {
      id: 'recibo-cena',
      name: 'Restaurant Receipt',
      description: 'Receipt and time-stamped group photos from the corporate dinner.',
      type: 'digital',
      icon: '🧾',
      location: "Karina's phone",
      isKey: false,
      analysis: "Confirms Karina's alibi: corporate dinner until one in the morning, with six witnesses.",
    },
  ],

  hotspots: [
    {
      id: 'balcon',
      x: 50,
      y: 20,
      label: 'Balcony',
      evidenceId: 'puerta-balcon',
      description: 'The balcony she fell from. The sliding door is still open.',
      icon: '🌆',
    },
    {
      id: 'mesa-centro',
      x: 30,
      y: 55,
      label: 'Coffee Table',
      evidenceId: 'copa-vino-valeria',
      description: 'A coffee table with the half-finished glass of wine.',
      icon: '🍷',
    },
    {
      id: 'tripode',
      x: 70,
      y: 40,
      label: 'Streaming Tripod',
      evidenceId: 'tripode-luz',
      description: 'The streaming ring light, still mounted, now knocked over.',
      icon: '🎬',
    },
    {
      id: 'cama-telefono',
      x: 25,
      y: 75,
      label: "Valeria's Phone",
      evidenceId: null,
      deviceId: 'phone-valeria',
      description: 'The phone Renata rescued before the police arrived.',
      icon: '📱',
    },
    {
      id: 'escritorio-valeria',
      x: 80,
      y: 65,
      label: 'Desk',
      evidenceId: null,
      description: 'A desk with brand awards and framed photos from past campaigns.',
      icon: '🖼️',
    },
  ],

  digitalDevices: [
    {
      id: 'phone-valeria',
      ownerSuspectId: null,
      label: "Valeria Ontiveros's Phone",
      lockType: 'none',
      apps: ['chatvia', 'nubeplus'],
      threads: [
        {
          id: 'thread-renata-valeria',
          appId: 'chatvia',
          title: 'Renata ❤️',
          participants: ['Valeria', 'Renata'],
          messages: [
            {
              id: 'msg-renata-1',
              sender: 'Valeria',
              timestamp: '11:20 PM',
              text: 'Ismael messaged me again from a new account. Says he\'s going to "post something" if I don\'t answer him.',
            },
            {
              id: 'msg-renata-2',
              sender: 'Renata',
              timestamp: '11:22 PM',
              text: 'Report him NOW. By name. Stop protecting him out of pity.',
            },
            {
              id: 'msg-renata-3',
              sender: 'Valeria',
              timestamp: '11:24 PM',
              text: 'Tomorrow. Tonight I just want to finish the stream and sleep.',
            },
            {
              id: 'msg-renata-4',
              sender: 'Renata',
              timestamp: '11:25 PM',
              text: 'Valeria please. This is getting out of hand.',
            },
            {
              id: 'msg-renata-5',
              sender: 'Valeria',
              timestamp: '11:41 PM',
              text: "Someone's ringing the doorbell. Odd at this hour. I'll write you back in a sec.\n\n(no further messages sent by Valeria after 11:41 PM)",
              evidenceId: 'chat-renata-valeria',
            },
          ],
        },
      ],
      notes: [
        {
          id: 'note-video-1',
          appId: 'nubeplus',
          title: 'Recovered fragment — deleted stream',
          body:
            'Partial transcript — minute 47:12 of the stream:\n\nVALERIA: "...sorry, someone\'s knocking, I\'ll be right back, don\'t go anywhere—"\n(footsteps, a door, a low, inaudible male voice)\nVALERIA: "How did you get in? This isn\'t okay, you need to leave—"\n(sound of a brief struggle, a metallic clang, and silence)\n(the stream continues for 40 more seconds showing an empty room before the signal is manually cut from the account\'s admin panel)',
          evidenceId: 'video-eliminado-recuperado',
        },
      ],
    },
  ],

  tensionEvents: [
    {
      id: 'tension-004-hint',
      triggerActionCount: 6,
      message: "The 48-hour clock is still running. You feel like you're missing something on Valeria's phone.",
      effect: {
        revealHint: "Check the NubePlus app on Valeria's phone — there's a recovered fragment you might not have seen.",
      },
    },
    {
      id: 'tension-004-lock',
      triggerActionCount: 16,
      message:
        "The 48 hours are almost up — the recovered stream fragment was purged from the backup, along with the conversation with Renata.",
      effect: {
        lockNoteIds: ['note-video-1'],
        lockThreadIds: ['thread-renata-valeria'],
      },
    },
  ],

  correctConnections: [
    { fromId: 'triangulacion-celular', toId: 'ismael-duarte' },
    { fromId: 'actividad-programada', toId: 'ismael-duarte' },
    { fromId: 'borrador-ismael', toId: 'ismael-duarte' },
    { fromId: 'denuncia-valeria', toId: 'ismael-duarte' },
    { fromId: 'video-eliminado-recuperado', toId: 'ismael-duarte' },
    { fromId: 'puerta-balcon', toId: 'ismael-duarte' },
    { fromId: 'tripode-luz', toId: 'ismael-duarte' },
    { fromId: 'chat-renata-valeria', toId: 'ismael-duarte' },
    { fromId: 'nota-comision', toId: 'renata-cifuentes' },
    { fromId: 'metadata-edicion', toId: 'renata-cifuentes' },
    { fromId: 'posts-indirectas', toId: 'bruno-salcedo' },
    { fromId: 'ubicacion-taxi', toId: 'bruno-salcedo' },
    { fromId: 'correo-contrato', toId: 'karina-ossa' },
    { fromId: 'recibo-cena', toId: 'karina-ossa' },
  ],

  solution: {
    guiltyId: 'ismael-duarte',
    explanation:
      'Ismael Duarte, obsessed with Valeria and about to be exposed and removed as moderator following her internal complaint, scheduled automatic posts to simulate being "online" all night while he traveled to Torre Cielo. He entered the building through the adjoining balcony, accessible from an empty unit under renovation, and confronted Valeria while she was live-streaming, unaware. He forced the balcony door, they argued, and he pushed her in the struggle — the stream captured the sound but not the image. Using the administrative access that was never revoked from his time as moderator, he cut and deleted the stream eight minutes later, not knowing the backup server had preserved it.',
    timeline: [
      { time: 'Ten days ago', description: 'Valeria reports Ismael internally; the brand starts a review that never gets completed.' },
      { time: '11:00 PM', description: 'Ismael activates scheduled posts to simulate being online.' },
      { time: '11:20 PM', description: 'Valeria tells Renata that Ismael messaged her again.' },
      { time: '11:41 PM', description: 'Valeria hears the doorbell during her live stream.' },
      { time: '11:44 PM', description: 'Ismael enters through the balcony of the adjoining empty unit.' },
      { time: '11:58 PM', description: 'A struggle on the balcony; Valeria falls.' },
      { time: '12:06 AM', description: 'The stream is cut and deleted from an administrative account that was never revoked.' },
      { time: '12:15 AM', description: 'A neighbor reports finding the body on the ground floor.' },
    ],
    proof: {
      means: ['puerta-balcon', 'triangulacion-celular'],
      motive: ['denuncia-valeria', 'borrador-ismael'],
      opportunity: ['actividad-programada', 'video-eliminado-recuperado'],
    },
  },
}

export default case004
