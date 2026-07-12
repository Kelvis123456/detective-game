import type { Case } from '../../types'

const case002: Case = {
  id: 'case-002',
  title: 'La Última Nota',
  subtitle: 'La música que nunca sonó',
  description:
    'El aclamado compositor Eduardo Vidal es encontrado muerto en su camerino una hora antes del estreno de su obra maestra. La policía lo cataloga como paro cardíaco. Tú sabes que algo no encaja.',
  difficulty: 'Medio',
  location: 'Teatro Municipal Apolo',
  date: '22 de abril, 20:15',
  thumbnail: '🎼',
  color: '#1a3a6b',
  intro:
    'El Teatro Municipal Apolo debía ser esta noche el escenario del siglo. En cambio, se ha convertido en escena del crimen. Eduardo Vidal, genio de la composición contemporánea, yace en su camerino. Su copa de whiskey a medio terminar. Su sinfonía inconclusa sobre el atril. Alguien no quería que esa música sonara.',
  crimeSceneDescription:
    'El camerino huele a whiskey y a violetas — el perfume favorito de Vidal. El cuerpo fue retirado, pero quedan sus pertenencias intactas. El vaso de whiskey con residuos. El atril con la partitura. La papelera con papeles arrugados. El archivador entreabierto.',

  suspects: [
    {
      id: 'carmen-blanco',
      name: 'Carmen Blanco',
      age: 30,
      occupation: 'Compositora / Ex-alumna',
      description:
        'Joven brillante con mirada intensa. Acusa a Vidal de haber plagiado su tesis musical. Habla con pasión desbordante.',
      avatar: '🎻',
      motive:
        'Cree que Vidal robó su obra de grado para crear su sinfonía. Quería destruir su reputación, no su vida.',
      alibi: 'Estaba en el patio trasero del teatro componiendo. Nadie puede confirmarlo.',
      isGuilty: false,
      dialogues: [
        {
          id: 'c-q1',
          question: '¿Cuál era su relación con Eduardo Vidal?',
          answer:
            'Era mi maestro. Después mi enemigo. Me robó tres años de trabajo y los convirtió en su "obra maestra". Esta sinfonía es MÍA, detective.',
          emotionalState: 'angry',
          revealedEvidenceIds: ['nota-musical'],
        },
        {
          id: 'c-q2',
          question: '¿Dónde estaba entre las 19:00 y las 20:00?',
          answer:
            'En el patio. Sola. Sé que suena sospechoso pero es la verdad. Necesitaba aire antes de entrar a ver cómo robaban mis aplausos.',
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
        {
          id: 'c-q3',
          question: '¿Tenía razones para querer matarlo?',
          answer:
            'Quería arruinarlo profesionalmente, no matarlo. Si lo hubiera matado antes del estreno, su sinfonía habría sido un mártir. Eso habría sido peor para mí.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'c-q4',
          question: '¿Sabe algo sobre medicamentos cardíacos?',
          answer:
            'Soy compositora, no médica. Aunque... espere. Lucía Méndez, su mánager — ella cuida a su madre enferma del corazón. Eso lo sé porque Eduardo lo mencionó una vez.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['frasco-digoxina'],
        },
      ],
    },
    {
      id: 'roberto-santos',
      name: 'Roberto Santos',
      age: 45,
      occupation: 'Compositor / Rival Profesional',
      description:
        'Hombre seguro de sí mismo, casi arrogante. No parece afectado por la muerte de Vidal. Eso, de por sí, es sospechoso.',
      avatar: '🎹',
      motive:
        'Competía con Vidal por el Premio Nacional de Música. Con Vidal muerto, el premio le corresponde a él.',
      alibi: 'Estaba en el lobby del teatro con el director y varios críticos musicales. Perfectamente corroborado.',
      isGuilty: false,
      dialogues: [
        {
          id: 'r-q1',
          question: '¿Lamenta la muerte de Eduardo Vidal?',
          answer:
            'Somos rivales, detective. Sería hipócrita fingir que lloro su muerte. Pero tampoco lo maté. Tengo moral, aunque usted lo dude.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'r-q2',
          question: 'El Premio Nacional de Música ahora le corresponde a usted.',
          answer:
            'Sí. Y lo habría ganado igual con Eduardo vivo. Mi obra es superior. Eso lo sabe cualquier crítico con oídos. No necesitaba que muriera.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'r-q3',
          question: '¿Puede probar que no estuvo en el camerino?',
          answer:
            'El director Álvarez, tres críticos del diario El Arte y el barista del lobby. Todos pueden confirmar que estuve ahí desde las 18:30. Elija a quien quiera.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'r-q4',
          question: '¿Notó algo inusual en el comportamiento de Lucía Méndez esta noche?',
          answer:
            'Lucía estaba... nerviosa. Más de lo normal. Vi que salió del camerino de Vidal como a las 19:15. Pensé que era por los nervios del estreno. Pero fue antes de que llegara el personal de producción.',
          emotionalState: 'evasive',
          revealedEvidenceIds: ['registro-acceso'],
        },
      ],
    },
    {
      id: 'lucia-mendez',
      name: 'Lucía Méndez',
      age: 38,
      occupation: 'Mánager Personal',
      description:
        'Mujer organizada, profesional. Pero sus ojos no se quedan quietos. Habla demasiado rápido cuando se pone nerviosa.',
      avatar: '📱',
      motive:
        'Llevaba cuatro años malversando fondos de la Fundación Vidal. Eduardo la confrontó la noche anterior con pruebas. Era arrestarla o silenciarlo.',
      alibi: 'Dice que estuvo coordinando logística en el escenario principal hasta las 20:00.',
      isGuilty: true,
      dialogues: [
        {
          id: 'l-q1',
          question: '¿Cuándo fue la última vez que vio a Eduardo Vidal vivo?',
          answer:
            'A las... 19:00, más o menos. Le llevé su whiskey habitual, hablamos del orden del programa. Estaba bien. Perfectamente bien.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['vaso-residuos'],
        },
        {
          id: 'l-q2',
          question: 'El registro de acceso muestra que usted entró al camerino a las 19:12.',
          answer:
            'Sí, ya lo dije. Fui a llevarte... llevarle el whiskey. Es completamente normal, era parte de mis responsabilidades.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['registro-acceso'],
        },
        {
          id: 'l-q3',
          question: '¿Qué hay en los estados de cuenta de la Fundación Vidal?',
          answer:
            'Yo... eso no es relevante para la investigación. Soy la administradora, hay movimientos legítimos de fondos constantemente.',
          emotionalState: 'evasive',
          revealedEvidenceIds: ['estados-cuenta'],
        },
        {
          id: 'l-q4',
          question: 'Encontramos un correo donde Eduardo la confronta sobre el dinero.',
          answer:
            '¡Eso es... eso está fuera de contexto! Teníamos un malentendido, nada más. Eduardo era un genio pero no entendía de finanzas. Yo lo hacía todo por él.',
          emotionalState: 'angry',
          revealedEvidenceIds: ['correo-confrontacion'],
        },
        {
          id: 'l-q5',
          question: '¿Qué hace un frasco de digoxina en su bolso?',
          answer:
            'Es de mi madre. Ella tiene una condición cardíaca. Yo... siempre lo llevo por si acaso... No, no tienen derecho a revisar mi bolso sin orden judicial.',
          emotionalState: 'angry',
          revealedEvidenceIds: [],
        },
      ],
    },
  ],

  evidence: [
    {
      id: 'vaso-residuos',
      name: 'Vaso con Residuos',
      description: 'Copa de whiskey con líquido residual en el fondo.',
      type: 'physical',
      icon: '🥃',
      location: 'Tocador del camerino',
      isKey: true,
      analysis:
        'El análisis toxicológico detectó digoxina en concentraciones cuatro veces superiores al rango terapéutico. Esta cantidad en una persona sin historial cardíaco provoca un paro cardíaco fulminante que imita una muerte natural.',
    },
    {
      id: 'frasco-digoxina',
      name: 'Frasco de Digoxina',
      description: 'Medicamento cardíaco con huellas dactilares.',
      type: 'physical',
      icon: '💊',
      location: 'Bolso de Lucía Méndez',
      isKey: true,
      analysis:
        'Frasco de digoxina prescrito a nombre de la madre de Lucía, pero con el 40% de las pastillas faltantes — una cantidad mayor a cualquier dosificación médica normal. Las huellas de Lucía están en el frasco y en la tapa.',
    },
    {
      id: 'correo-confrontacion',
      name: 'Correo Impreso',
      description: 'Email de Eduardo Vidal a Lucía Méndez, fechado el día anterior.',
      type: 'document',
      icon: '✉️',
      location: 'Archivador del camerino',
      isKey: true,
      analysis:
        '"Lucía: He revisado los estados de cuenta con mi contador. Faltan $87,000 en transferencias no documentadas. Mañana, antes del estreno, necesito una explicación completa. Si no hay una satisfactoria, hablaré con mi abogado. — Eduardo." Esto le daba un motivo claro para actuar esa noche.',
    },
    {
      id: 'estados-cuenta',
      name: 'Estados de Cuenta',
      description: 'Documentos financieros de la Fundación Vidal con irregularidades.',
      type: 'document',
      icon: '📊',
      location: 'Archivador del camerino',
      isKey: true,
      analysis:
        'Transferencias mensuales de entre $1,500 y $3,000 durante cuatro años a una cuenta numerada. Total aproximado: $87,400. Las transferencias siempre ocurrían cuando Vidal estaba de gira y no podía supervisar.',
    },
    {
      id: 'registro-acceso',
      name: 'Registro de Acceso',
      description: 'Log digital del sistema de puertas del camerino.',
      type: 'digital',
      icon: '🔐',
      location: 'Sistema de seguridad del teatro',
      isKey: true,
      analysis:
        'Lucía Méndez accedió al camerino a las 19:12 y salió a las 19:18. Eduardo Vidal fue encontrado muerto a las 20:15. El médico forense estima la muerte entre 19:20 y 19:40. Nadie más accedió al camerino durante ese período.',
    },
    {
      id: 'nota-musical',
      name: 'Partitura de Carmen',
      description: 'Fragmento musical con la letra de Carmen Blanco y fecha de dos años atrás.',
      type: 'document',
      icon: '🎵',
      location: 'Papelera del camerino',
      isKey: false,
      analysis:
        'Borrador musical de Carmen Blanco. Algunos motivos melódicos son similares a la sinfonía de Vidal, aunque no son idénticos. Posible influencia o inspiración — no plagio directo. El conflicto entre ellos existía pero no llega a crimen.',
    },
    {
      id: 'botella-whiskey',
      name: 'Botella de Whiskey',
      description: 'Botella sellada sin abrir junto a la copa usada.',
      type: 'physical',
      icon: '🍾',
      location: 'Estante del camerino',
      isKey: false,
      analysis:
        'La botella está sellada y sin abrir. Esto significa que el whiskey envenenado vino de otro recipiente — alguien trajo la copa ya preparada o añadió el veneno directamente en el vaso de Vidal.',
    },
    {
      id: 'guantes-papelera',
      name: 'Guantes Desechables',
      description: 'Par de guantes quirúrgicos usados en la papelera del baño.',
      type: 'physical',
      icon: '🧤',
      location: 'Baño compartido del pasillo',
      isKey: false,
      analysis:
        'Guantes de nitrilo descartables. Contienen trazas de digoxina disuelta en alcohol. Quien los usó los desechó en el baño del pasillo adyacente al camerino — en la dirección por donde Lucía Méndez salió esa noche.',
    },
  ],

  hotspots: [
    {
      id: 'tocador',
      x: 40,
      y: 50,
      label: 'Tocador con Copa',
      evidenceId: 'vaso-residuos',
      description: 'El tocador donde Vidal se preparaba. La copa de whiskey aún tiene residuos.',
      icon: '🪞',
    },
    {
      id: 'archivador',
      x: 72,
      y: 45,
      label: 'Archivador',
      evidenceId: 'correo-confrontacion',
      description: 'Archivador metálico entreabierto. Papeles dispersos dentro.',
      icon: '🗄️',
    },
    {
      id: 'papelera',
      x: 20,
      y: 68,
      label: 'Papelera',
      evidenceId: 'nota-musical',
      description: 'Papelera con papeles arrugados y un frasco vacío.',
      icon: '🗑️',
    },
    {
      id: 'atril',
      x: 60,
      y: 30,
      label: 'Atril con Partitura',
      evidenceId: null,
      description: 'La sinfonía inconclusa de Vidal. Las páginas están arrugadas, como si las hubiera aferrado.',
      icon: '🎼',
    },
    {
      id: 'estante',
      x: 82,
      y: 28,
      label: 'Estante de Bebidas',
      evidenceId: 'botella-whiskey',
      description: 'Estante con la botella de whiskey sin abrir. Algo no cuadra.',
      icon: '🍶',
    },
  ],

  solution: {
    guiltyId: 'lucia-mendez',
    explanation:
      'Lucía Méndez, la mánager de confianza de Eduardo Vidal, llevaba cuatro años robando dinero de su fundación. Cuando Eduardo descubrió las irregularidades y la confrontó por correo la víspera del estreno, Lucía sabía que tenía pocas horas para actuar. Disolvió pastillas de digoxina en alcohol isopropílico, se puso guantes quirúrgicos y entró al camerino a las 19:12 con la copa de whiskey ya preparada. Después de 6 minutos, dejó a Eduardo bebiendo su bebida envenenada y salió. El paro cardíaco fue casi inmediato. Descartó los guantes en el baño del pasillo.',
    timeline: [
      { time: 'Un día antes', description: 'Eduardo descubre las irregularidades y envía el correo de confrontación a Lucía.' },
      { time: '18:00', description: 'Lucía compra la digoxina adicional (o la toma del frasco de su madre).' },
      { time: '19:00', description: 'Lucía prepara la copa de whiskey con el veneno disuelto.' },
      { time: '19:12', description: 'Entra al camerino de Eduardo con la copa "de cortesía".' },
      { time: '19:18', description: 'Sale del camerino. Eduardo comienza a beber.' },
      { time: '19:19', description: 'Desecha los guantes en el baño del pasillo.' },
      { time: '19:30', description: 'Eduardo Vidal muere de paro cardíaco inducido por digoxina.' },
      { time: '20:15', description: 'El asistente de producción encuentra el cuerpo.' },
    ],
  },
}

export default case002
