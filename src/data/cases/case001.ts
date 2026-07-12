import type { Case } from '../../types'

const case001: Case = {
  id: 'case-001',
  title: 'El Diamante Rojo',
  subtitle: 'Una joya que vale una vida',
  description:
    'Durante una lujosa gala en el Hotel Grand Palace, el legendario diamante "Sangre de Fuego" desaparece de su vitrina. El coleccionista Reginald Whitmore está furioso. Alguien en esa fiesta sabe dónde está la joya.',
  difficulty: 'Fácil',
  location: 'Hotel Grand Palace',
  date: '15 de marzo, 23:47',
  thumbnail: '💎',
  color: '#8b1a1a',
  intro:
    'La lluvia golpea las ventanas del Grand Palace mientras el eco de la música de la gala aún resuena en los pasillos. El diamante "Sangre de Fuego" — tasado en tres millones de dólares — ha desaparecido. La vitrina no fue forzada. Alguien tenía las llaves. Tienes hasta el amanecer para resolverlo.',
  crimeSceneDescription:
    'La sala de exposición huele a perfume caro y traición. La vitrina central está abierta, el pedestal vacío. El suelo de mármol brilla bajo las luces de emergencia. Una copa de vino volcada. El basurero del rincón. La cámara de seguridad parpadeante.',

  suspects: [
    {
      id: 'valentina-cruz',
      name: 'Valentina Cruz',
      age: 40,
      occupation: 'Gerente del Hotel',
      description:
        'Mujer elegante de cabello oscuro. Nerviosa desde que llegaste. Sus manos tiemblan levemente al hablar.',
      avatar: '👩‍💼',
      motive:
        'Deudas con prestamistas peligrosos. Necesitaba dinero urgente para pagar o arriesgar su vida.',
      alibi: 'Dice que estuvo en recepción toda la noche coordinando el evento.',
      isGuilty: false,
      dialogues: [
        {
          id: 'v-q1',
          question: '¿Dónde estaba cuando ocurrió el robo?',
          answer:
            'En recepción, detective. Tengo cincuenta empleados que pueden confirmarlo. Esta gala requería mi atención constante.',
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 'v-q2',
          question: '¿Quién tenía acceso a las llaves de la vitrina?',
          answer:
            'El señor Delgado las usó para la evaluación oficial. Nosotros guardamos el duplicado en la caja fuerte de gerencia. Solo yo conozco la combinación... bueno, y el señor Whitmore.',
          emotionalState: 'calm',
          revealedEvidenceIds: ['ficha-evaluacion'],
        },
        {
          id: 'v-q3',
          question: 'Tengo información de que usted tiene deudas graves.',
          answer:
            '¡Eso es mi vida privada! No tiene nada que ver con este caso. Mis finanzas son mi problema, no el suyo.',
          emotionalState: 'angry',
          revealedEvidenceIds: ['nota-amenaza'],
        },
        {
          id: 'v-q4',
          question: '¿Notó algo inusual durante la noche?',
          answer:
            'El señor Delgado estuvo en la sala de exposición más tiempo del habitual. Pensé que era por devoción profesional. Ahora me pregunto...',
          emotionalState: 'evasive',
          revealedEvidenceIds: [],
        },
      ],
    },
    {
      id: 'marco-delgado',
      name: 'Marco Delgado',
      age: 55,
      occupation: 'Experto en Gemología',
      description:
        'Hombre mayor de aspecto refinado. Traje impecable. Responde con excesiva calma, casi ensayada.',
      avatar: '🧐',
      motive:
        'Comprador en el mercado negro ya pagado. Fabricó una réplica perfecta y sustituyó el diamante real durante la evaluación oficial.',
      alibi: 'Dice que estuvo en el buffet con otros invitados hasta las 23:00.',
      isGuilty: true,
      dialogues: [
        {
          id: 'm-q1',
          question: '¿Cuándo fue la última vez que vio el diamante?',
          answer:
            'Durante la evaluación oficial, cuatro días antes de la gala. Todo estaba en perfecto estado, lo garantizo con mi reputación profesional.',
          emotionalState: 'calm',
          revealedEvidenceIds: ['ficha-evaluacion'],
        },
        {
          id: 'm-q2',
          question: '¿Puede mostrarme sus manos?',
          answer:
            'Por supuesto... ¿Qué busca exactamente? Trabajo con mis manos, es normal que estén así.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['guante-trabajo'],
        },
        {
          id: 'm-q3',
          question: '¿Qué sabe sobre la fabricación de réplicas de gemas?',
          answer:
            'Es mi campo, detective. Cualquier gemólogo experimentado podría... bueno, técnicamente hablando... No entiendo a dónde quiere llegar.',
          emotionalState: 'evasive',
          revealedEvidenceIds: [],
        },
        {
          id: 'm-q4',
          question: 'Encontramos un recibo de materiales de gemología a su nombre.',
          answer:
            '¡Eso es... para mi trabajo habitual! Compro materiales constantemente. ¡No puede acusarme sin pruebas concretas!',
          emotionalState: 'angry',
          revealedEvidenceIds: ['recibo-materiales'],
        },
        {
          id: 'm-q5',
          question: '¿Conoce a alguien en el mercado negro de joyas?',
          answer:
            'Yo no... eso es una acusación muy grave. Exijo hablar con mi abogado inmediatamente.',
          emotionalState: 'angry',
          revealedEvidenceIds: [],
        },
      ],
    },
    {
      id: 'sofia-reyes',
      name: 'Sofía Reyes',
      age: 28,
      occupation: 'Socialité / Empresaria',
      description:
        'Joven glamorosa. Ex-novia de Whitmore. Parece afectada emocionalmente, pero ¿es real o teatro?',
      avatar: '💃',
      motive:
        'Venganza contra Whitmore por una humillación pública. Pero no llegó a actuar: solo pensó en robarlo.',
      alibi: 'Dice que fue al baño y tardó 30 minutos. No hay testigos de ese tiempo.',
      isGuilty: false,
      dialogues: [
        {
          id: 's-q1',
          question: '¿Cuál es su relación con el señor Whitmore?',
          answer:
            'Exnovia. Terminamos hace seis meses. Vine a esta gala porque... bueno, porque quería demostrarle que estoy bien sin él.',
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
        {
          id: 's-q2',
          question: 'Media hora en el baño es mucho tiempo, señorita Reyes.',
          answer:
            'Estaba llorando, detective. ¿Eso es un crimen? Verlo con otra persona me afectó más de lo que esperaba. Puede revisar mi maquillaje corrido si quiere.',
          emotionalState: 'sad',
          revealedEvidenceIds: ['copa-vino'],
        },
        {
          id: 's-q3',
          question: '¿Quería robar el diamante para vengarse?',
          answer:
            'Lo pensé. No voy a mentirle. Pero no lo hice. Soy impulsiva, no criminal. Hay una diferencia.',
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 's-q4',
          question: '¿Vio a alguien cerca de la sala de exposición?',
          answer:
            'Al señor Delgado. Salía con un maletín cuando fui hacia los baños. Pensé que era raro a esas horas, pero no le di importancia.',
          emotionalState: 'calm',
          revealedEvidenceIds: ['camara-seguridad'],
        },
      ],
    },
  ],

  evidence: [
    {
      id: 'fragmento-cristal',
      name: 'Fragmento de Cristal',
      description: 'Pequeño fragmento del vidrio de la vitrina.',
      type: 'physical',
      icon: '🔬',
      location: 'Vitrina central',
      isKey: false,
      analysis:
        'El vidrio fue cortado limpiamente con una herramienta especializada, no roto. Quien lo hizo sabía exactamente cómo abrir la vitrina. Encontramos una huella dactilar parcial en el borde interior.',
    },
    {
      id: 'ficha-evaluacion',
      name: 'Ficha de Evaluación',
      description: 'Documento oficial de evaluación del diamante, firmado por Marco Delgado.',
      type: 'document',
      icon: '📋',
      location: 'Escritorio de evaluación',
      isKey: true,
      analysis:
        'La ficha confirma que Marco Delgado tuvo acceso exclusivo al diamante durante 4 horas para su "evaluación técnica". También tenía las llaves de la vitrina durante ese período. Nadie más tuvo ese acceso.',
    },
    {
      id: 'recibo-materiales',
      name: 'Recibo de Joyería Especial',
      description: 'Compra de resinas de alta calidad, pigmentos rojos y herramientas de precisión.',
      type: 'document',
      icon: '🧾',
      location: 'Basurero del rincón',
      isKey: true,
      analysis:
        'Recibo a nombre de Marco Delgado, fechado tres semanas antes de la gala. Los materiales son exactamente los necesarios para fabricar una réplica convincente de un diamante de alta calidad. Precio total: $4,200.',
    },
    {
      id: 'camara-seguridad',
      name: 'Fotografía de Seguridad',
      description: 'Imagen borrosa de una figura saliendo de la sala de exposición con maletín.',
      type: 'digital',
      icon: '📷',
      location: 'Sistema de seguridad',
      isKey: true,
      analysis:
        'La imagen muestra una figura masculina de complexión adulta mayor saliendo de la sala a las 23:31. Lleva un maletín de cuero marrón — igual al que Delgado tenía en la gala. El ángulo no muestra el rostro, pero la silueta y el maletín son consistentes.',
    },
    {
      id: 'guante-trabajo',
      name: 'Guante de Trabajo',
      description: 'Guante quirúrgico descartable de talla grande.',
      type: 'physical',
      icon: '🧤',
      location: 'Basurero del rincón',
      isKey: true,
      analysis:
        'Guante desechable de nitrilo, talla L. No tiene huellas externas, pero el interior tiene trazas de polvo de gemas y resina sintética — los mismos materiales del recibo de compra. Delgado usa talla L según su perfil de compras.',
    },
    {
      id: 'nota-amenaza',
      name: 'Nota Anónima',
      description: 'Mensaje amenazante dirigido a "V.C." exigiendo pago inmediato.',
      type: 'document',
      icon: '📝',
      location: 'Bolso de Valentina',
      isKey: false,
      analysis:
        'Nota escrita a máquina amenazando con consecuencias graves si no se paga una deuda. Las iniciales "V.C." apuntan a Valentina Cruz. Esto confirma sus deudas pero no la conecta con el robo directamente.',
    },
    {
      id: 'copa-vino',
      name: 'Copa de Vino',
      description: 'Copa con lápiz de labios color rojo sangre, volcada cerca de la vitrina.',
      type: 'physical',
      icon: '🍷',
      location: 'Mesa auxiliar junto a la vitrina',
      isKey: false,
      analysis:
        'El lápiz de labios coincide con el tono que usa Sofía Reyes esta noche. Confirma que estuvo cerca de la vitrina, pero no a la hora del robo. Podría ser del inicio de la gala.',
    },
    {
      id: 'maletín-fotos',
      name: 'Fotos del Maletín',
      description: 'Capturas de distintas cámaras mostrando el maletín de Delgado en la noche.',
      type: 'digital',
      icon: '🗂️',
      location: 'Sistema de seguridad',
      isKey: false,
      analysis:
        'Cuatro imágenes distintas muestran el maletín de Marco Delgado. A las 21:00 parece vacío. A las 23:35, al salir del hotel, parece considerablemente más pesado. Algo fue añadido durante la noche.',
    },
  ],

  hotspots: [
    {
      id: 'vitrina',
      x: 48,
      y: 40,
      label: 'Vitrina Vacía',
      evidenceId: 'fragmento-cristal',
      description: 'La vitrina central donde reposaba el diamante. El pedestal de terciopelo está vacío.',
      icon: '🔲',
    },
    {
      id: 'escritorio',
      x: 75,
      y: 55,
      label: 'Escritorio de Evaluación',
      evidenceId: 'ficha-evaluacion',
      description: 'Mesa donde el evaluador oficial realizó su trabajo. Papeles dispersos.',
      icon: '🗃️',
    },
    {
      id: 'basurero',
      x: 20,
      y: 70,
      label: 'Basurero del Rincón',
      evidenceId: 'recibo-materiales',
      description: 'Pequeño basurero metálico. Alguien intentó deshacerse de algo.',
      icon: '🗑️',
    },
    {
      id: 'camara',
      x: 85,
      y: 15,
      label: 'Cámara de Seguridad',
      evidenceId: 'camara-seguridad',
      description: 'Cámara que cubre la puerta de salida. La imagen está disponible en el sistema.',
      icon: '📹',
    },
    {
      id: 'mesa-buffet',
      x: 30,
      y: 45,
      label: 'Mesa con Copa',
      evidenceId: 'copa-vino',
      description: 'Mesa auxiliar con una copa volcada y restos de bocadillos.',
      icon: '🍽️',
    },
  ],

  solution: {
    guiltyId: 'marco-delgado',
    explanation:
      'Marco Delgado, el experto gemólogo, planeó el robo durante semanas. Aprovechando su acceso oficial como evaluador, fabricó una réplica perfecta del diamante y la sustituyó durante la evaluación técnica cuatro días antes de la gala. La noche del evento, simplemente recogió su "trabajo" de la vitrina usando las llaves que aún tenía en su poder. Los guantes desechables, el recibo de materiales y la cámara de seguridad lo delatan. Tenía un comprador en el mercado negro con un adelanto ya cobrado.',
    timeline: [
      { time: 'Hace 3 semanas', description: 'Delgado compra materiales para fabricar la réplica.' },
      { time: 'Hace 4 días', description: 'Durante la evaluación oficial, sustituye el diamante real por la réplica.' },
      { time: '21:00', description: 'Llega a la gala con el maletín (aparentemente vacío).' },
      { time: '23:28', description: 'Se pone los guantes en el baño y va a la sala de exposición.' },
      { time: '23:32', description: 'Abre la vitrina, recoge el diamante real, cierra la vitrina.' },
      { time: '23:35', description: 'Sale del hotel con el maletín cargado. La cámara lo capta.' },
      { time: '00:15', description: 'El robo es descubierto cuando Whitmore va a mostrar la joya a sus invitados.' },
    ],
  },
}

export default case001
