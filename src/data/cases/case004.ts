import type { Case } from '../../types'

const case004: Case = {
  id: 'case-004',
  title: 'Cuarenta y Ocho Horas',
  subtitle: 'Lo que borró no desapareció',
  description:
    'Valeria Ontiveros, influencer de 26 años, aparece muerta en su apartamento tras una caída desde el balcón. La policía lo cierra como accidente. Su mejor amiga no lo cree, y te entrega el teléfono de Valeria antes de que la policía lo revise. Tienes 48 horas antes de que el caso se archive para siempre.',
  difficulty: 'Medio',
  location: 'Torre Cielo, apartamento 14B',
  date: '3 de septiembre, 23:58',
  thumbnail: '📱',
  color: '#5b2c8f',
  intro:
    'El apartamento de Valeria Ontiveros todavía tiene las luces de su última transmisión en vivo encendidas. Cayó desde el balcón del piso 14 hace dos noches. Setecientas mil personas la seguían en redes; ninguna estaba mirando cuando pasó. Su mejor amiga, Renata, se coló en el apartamento antes de que la policía sellara todo y rescató lo único que importa: el teléfono de Valeria, desbloqueado, con la pantalla aún encendida. Lo que hay ahí dentro no encaja con un accidente.',
  crimeSceneDescription:
    'El apartamento de Valeria es una vitrina de su propia vida: paredes con fotos enmarcadas de marca, un aro de luz para transmisiones aún montado en el trípode, una copa de vino sin terminar en la mesa de centro. El balcón sigue con la puerta corrediza abierta. Su teléfono, entregado por Renata, está sobre la cama. La verdadera escena del crimen no es este cuarto. Es lo que hay en la pantalla.',

  suspects: [
    {
      id: 'renata-cifuentes',
      name: 'Renata Cifuentes',
      age: 27,
      occupation: 'Mejor amiga y manager de contenido',
      description:
        'Devastada pero funcional. Conoce cada contraseña de Valeria y no le tiembla la voz al admitirlo.',
      avatar: '💻',
      motive:
        'Manejaba las finanzas de Valeria y se quedaba con un porcentaje creciente de sus ingresos por patrocinios; discutieron por dinero la semana pasada.',
      alibi: 'Dice que estuvo en su propio apartamento editando video hasta pasada la medianoche.',
      isGuilty: false,
      dialogues: [
        {
          id: 'ren-q1',
          question: '¿Por qué tenía usted el teléfono de la víctima antes que la policía?',
          answer:
            'Porque conozco todas sus contraseñas, detective, se las configuré yo misma hace un año. Y porque no confío en que la policía busque bien. Ya decidieron que fue un accidente sin revisar nada.',
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 'ren-q2',
          question: '¿Es cierto que discutieron por dinero la semana pasada?',
          answer:
            'Sí. Le subí mi comisión del 15 al 20 por ciento. Se enojó. Todos los managers discuten con sus clientes por dinero, eso no significa que los tiren de un balcón.',
          emotionalState: 'evasive',
          revealedEvidenceIds: ['nota-comision'],
        },
        {
          id: 'ren-q3',
          question: '¿Sabía que Valeria estaba siendo acosada?',
          answer:
            'Lo sabía. Le rogué que hiciera pública la denuncia contra él. No quiso, decía que iba a "manejarlo ella misma". Ojalá me hubiera hecho caso.',
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
        {
          id: 'ren-q4',
          question: '¿Dónde estaba usted exactamente entre las 23:00 y la medianoche?',
          answer:
            'En mi apartamento, a quince minutos de aquí, editando el video del día siguiente. Los archivos tienen la hora de guardado, revísenlos.',
          emotionalState: 'calm',
          revealedEvidenceIds: ['metadata-edicion'],
        },
        {
          id: 'ren-q5',
          question: "Un mensaje suyo dice 'esto se está saliendo de control'. ¿A qué se refería?",
          answer:
            'Al acosador, no a Valeria. Ella me contaba todo lo que él le mandaba. Yo estaba aterrada por ella, no en su contra.',
          emotionalState: 'angry',
          revealedEvidenceIds: [],
        },
        {
          id: 'ren-q6',
          question: '¿Qué fue lo último que le escribió Valeria esa noche?',
          answer:
            'Que alguien tocaba el timbre, raro a esa hora, que ya me escribía. Nunca volvió a escribirme. Revisé el chat mil veces esa noche pensando que se le había hecho tarde con algo tonto.',
          emotionalState: 'sad',
          revealedEvidenceIds: ['chat-renata-valeria'],
        },
      ],
    },
    {
      id: 'bruno-salcedo',
      name: 'Bruno Salcedo',
      age: 31,
      occupation: 'Ex pareja',
      description:
        'Ruptura reciente y pública. Habla de Valeria con una mezcla de rencor y culpa que no termina de cuadrar.',
      avatar: '🕴️',
      motive: 'Valeria había insinuado en redes que iba a "contar la verdad" sobre él.',
      alibi: 'Dice que estaba en un vuelo esa noche, aterrizando a las 23:40.',
      isGuilty: false,
      dialogues: [
        {
          id: 'bru-q1',
          question: 'Su relación con la víctima terminó hace un mes, de forma pública y fea.',
          answer:
            'Ella lo hizo público, no yo. Publicó indirectas durante semanas. Yo solo quería que parara.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['posts-indirectas'],
        },
        {
          id: 'bru-q2',
          question: 'Su vuelo aterrizó a las 23:40. Ella murió a las 23:58. ¿Dónde estuvo esos dieciocho minutos?',
          answer:
            'En el aeropuerto, recogiendo mi maleta. No fui a su apartamento, si eso es lo que insinúa.',
          emotionalState: 'evasive',
          revealedEvidenceIds: ['ubicacion-taxi'],
        },
        {
          id: 'bru-q3',
          question: "Valeria dijo en redes que iba a 'contar la verdad' sobre usted. ¿La verdad sobre qué?",
          answer:
            'Sobre nada ilegal, si es lo que piensa. Cosas de pareja, vergonzosas, no criminales. No la maté por eso.',
          emotionalState: 'angry',
          revealedEvidenceIds: [],
        },
        {
          id: 'bru-q4',
          question: 'Encontramos mensajes suyos enviados esa misma noche, insistentes.',
          answer:
            'Estaba borracho y triste, no la estaba amenazando. Cualquiera puede mandar mensajes patéticos a su ex sin ser un asesino.',
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
      ],
    },
    {
      id: 'ismael-duarte',
      name: 'Ismael Duarte',
      age: 24,
      occupation: 'Administrador de comunidad de fans',
      description:
        'Habla de Valeria con una familiaridad que nadie le pidió. Cuidadoso con cada palabra, hasta que deja de serlo.',
      avatar: '🎭',
      motive:
        'Obsesión no correspondida; Valeria lo bloqueó y denunció su comportamiento, lo que amenazaba con exponerlo y hacerle perder su rol como moderador.',
      alibi: 'Dice que estuvo "en casa, en línea", y que se puede verificar con su actividad.',
      isGuilty: true,
      dialogues: [
        {
          id: 'ism-q1',
          question: '¿Cómo conocía a Valeria Ontiveros?',
          answer:
            'Soy... era administrador de su comunidad de fans más grande. La conocía mejor que su propia familia, en cierto sentido.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'ism-q2',
          question: 'Ella lo bloqueó y denunció su cuenta hace diez días. ¿Por qué?',
          answer:
            'Fue un malentendido. Le mandé demasiados mensajes, quizás. Me preocupaba por ella. Eso no es un crimen, detective.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['denuncia-valeria'],
        },
        {
          id: 'ism-q3',
          question: "Su coartada dice que estuvo 'en línea' toda la noche. Explique eso.",
          answer:
            'Programé publicaciones para que se vieran automáticas... para tener una coartada, sí. Pero eso no prueba nada, solo prueba que soy cuidadoso.',
          emotionalState: 'evasive',
          revealedEvidenceIds: ['actividad-programada'],
        },
        {
          id: 'ism-q4',
          question: 'Su teléfono estuvo en la zona de la Torre Cielo esa noche, según el registro de la torre celular.',
          answer:
            '¡Eso no prueba que subí a su apartamento! Puedo estar en la zona sin haber entrado al edificio. ¡Necesitan más que eso!',
          emotionalState: 'angry',
          revealedEvidenceIds: ['triangulacion-celular'],
        },
        {
          id: 'ism-q5',
          question: "Recuperamos su borrador nunca enviado: 'si no me vas a escuchar, voy a subir de todas formas'.",
          answer:
            '¡Eso nunca se lo mandé! ¡Era solo para desahogarme, nunca la iba a lastimar, yo la amaba, ella no lo entendía—!',
          emotionalState: 'angry',
          revealedEvidenceIds: ['borrador-ismael'],
        },
        {
          id: 'ism-q6',
          question: 'Recuperamos audio de la transmisión en vivo de Valeria justo antes de su muerte.',
          answer:
            '¡Eso no prueba que fui yo! ¡Una voz no es una cara, pudo ser cualquiera!',
          emotionalState: 'angry',
          revealedEvidenceIds: ['video-eliminado-recuperado'],
        },
      ],
    },
    {
      id: 'karina-ossa',
      name: 'Karina Ossa',
      age: 35,
      occupation: 'Gerente de marca patrocinadora',
      description: 'Profesional hasta en el duelo. Calcula cada respuesta en términos de riesgo reputacional.',
      avatar: '👔',
      motive:
        'Valeria amenazaba con romper el contrato de exclusividad tras enterarse de que la marca conocía las denuncias contra Ismael y no había actuado.',
      alibi: 'Cena corporativa con seis testigos hasta la 1 AM.',
      isGuilty: false,
      dialogues: [
        {
          id: 'kar-q1',
          question: '¿Qué relación tenía la marca con Ismael Duarte?',
          answer:
            'Era moderador voluntario de nuestra comunidad oficial. No hacíamos contratos formales con moderadores, así que técnicamente no era "nuestro". Un tecnicismo que ahora me avergüenza.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'kar-q2',
          question: 'Valeria amenazaba con romper su contrato de exclusividad.',
          answer:
            'Sí. Y con razón, honestamente. Sabíamos de las denuncias contra Ismael desde hacía semanas y no actuamos rápido. Eso nos habría costado mucho dinero, no lo voy a negar.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['correo-contrato'],
        },
        {
          id: 'kar-q3',
          question: '¿Sabía usted del comportamiento de Ismael hacia ella?',
          answer:
            'Sabía que había denuncias internas. No sabía que era tan grave. Si lo hubiera sabido de verdad, lo habría sacado de la comunidad de inmediato.',
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
        {
          id: 'kar-q4',
          question: '¿Dónde estaba la noche de su muerte?',
          answer:
            'En la cena trimestral con el equipo de marca, hasta la una de la madrugada. Seis personas y un recibo con hora impresa pueden confirmarlo.',
          emotionalState: 'calm',
          revealedEvidenceIds: ['recibo-cena'],
        },
      ],
    },
  ],

  evidence: [
    {
      id: 'copa-vino-valeria',
      name: 'Copa de Vino',
      description: 'Copa de vino sin terminar en la mesa de centro.',
      type: 'physical',
      icon: '🍷',
      location: 'Mesa de centro',
      isKey: false,
      analysis:
        'Nivel de alcohol en sangre bajo pese a la copa; Valeria no estaba tan ebria como se asumió inicialmente en el reporte policial.',
    },
    {
      id: 'puerta-balcon',
      name: 'Puerta Corrediza del Balcón',
      description: 'La puerta que da al balcón desde donde cayó.',
      type: 'physical',
      icon: '🚪',
      location: 'Balcón',
      isKey: true,
      analysis:
        'El seguro estaba forzado desde el riel exterior, sugiriendo que alguien entró por el balcón contiguo o forzó la apertura sin usar la manija interior.',
    },
    {
      id: 'tripode-luz',
      name: 'Trípode con Aro de Luz',
      description: 'Trípode volcado, aún encendido cuando se encontró el cuerpo.',
      type: 'physical',
      icon: '💡',
      location: 'Sala principal',
      isKey: false,
      analysis:
        'Estaba encendido y grabando en el momento de la caída, pero el archivo de esa transmisión específica fue eliminado remotamente minutos después.',
    },
    {
      id: 'chat-renata-valeria',
      name: 'Hilo de ChatVía: Renata y Valeria',
      description: 'Últimos mensajes entre Valeria y su mejor amiga antes de morir.',
      type: 'digital',
      icon: '💬',
      location: 'Teléfono de Valeria',
      isKey: true,
      analysis:
        'Valeria menciona que Ismael volvió a escribirle desde una cuenta nueva. El último mensaje que envió, a las 23:41, dice que alguien está tocando el timbre. No volvió a escribir.',
      digitalSourceId: 'msg-renata-5',
    },
    {
      id: 'video-eliminado-recuperado',
      name: 'Fragmento de Transmisión Eliminada',
      description: 'Recuperado del servidor de respaldo — la transmisión en vivo que Valeria grababa al morir.',
      type: 'digital',
      icon: '🎥',
      location: 'Servidor de respaldo, recuperado con orden judicial',
      isKey: true,
      analysis:
        'Se escucha a Valeria interrumpir la transmisión por el timbre, una voz masculina baja, un forcejeo breve y un golpe metálico antes del silencio. La señal se cortó manualmente 6 minutos después desde una cuenta administrativa nunca revocada — activada esa noche a las 23:52, ocho minutos antes de que se cortara la señal.',
      digitalSourceId: 'note-video-1',
    },
    {
      id: 'nota-comision',
      name: 'Nota en Anotta de Renata',
      description: 'Nota sobre la disputa de comisión con Valeria.',
      type: 'digital',
      icon: '🗒️',
      location: 'Teléfono de Renata',
      isKey: false,
      analysis: 'Confirma la disputa económica reciente, pero no hay nada que sugiera violencia — solo dinero.',
    },
    {
      id: 'metadata-edicion',
      name: 'Metadata de Archivos de Edición',
      description: 'Registro de guardado de los archivos de video de Renata.',
      type: 'digital',
      icon: '📁',
      location: 'Laptop de Renata',
      isKey: true,
      analysis:
        'Los archivos muestran guardados constantes entre las 23:05 y las 00:20, consistentes con su coartada. Renata no salió de su apartamento esa noche.',
    },
    {
      id: 'posts-indirectas',
      name: 'Publicaciones Archivadas',
      description: 'Capturas de publicaciones públicas de Valeria sobre Bruno.',
      type: 'digital',
      icon: '📲',
      location: 'Respaldo en NubePlus',
      isKey: false,
      analysis: 'Indirectas públicas dirigidas a Bruno en las semanas previas a la muerte de Valeria.',
    },
    {
      id: 'ubicacion-taxi',
      name: 'Registro de Viaje',
      description: 'Registro de una app de transporte usada por Bruno esa noche.',
      type: 'digital',
      icon: '🚕',
      location: 'Teléfono de Bruno',
      isKey: true,
      analysis:
        'El registro confirma que Bruno fue directo del aeropuerto a su domicilio, sin desvíos hacia la Torre Cielo. Su coartada queda verificada.',
    },
    {
      id: 'denuncia-valeria',
      name: 'Reporte de Denuncia Interna',
      description: 'Denuncia que Valeria presentó contra Ismael en la comunidad de fans.',
      type: 'document',
      icon: '📄',
      location: 'Panel de administración de la comunidad',
      isKey: true,
      analysis:
        'Valeria denunció acoso reiterado por parte de Ismael diez días antes de morir, y solicitó que se le revocara el acceso administrativo. Nunca se ejecutó.',
    },
    {
      id: 'actividad-programada',
      name: 'Registro de Publicaciones Programadas',
      description: 'Publicaciones automáticas en la cuenta de Ismael durante la noche del crimen.',
      type: 'digital',
      icon: '⏲️',
      location: 'Cuenta de Ismael',
      isKey: true,
      analysis:
        'Las publicaciones de esa noche estaban programadas con antelación, no escritas en tiempo real — una coartada fabricada para simular presencia en línea.',
    },
    {
      id: 'triangulacion-celular',
      name: 'Triangulación de Torres Celulares',
      description: 'Registro de la compañía telefónica, obtenido con orden judicial.',
      type: 'digital',
      icon: '📡',
      location: 'Compañía telefónica',
      isKey: true,
      analysis:
        'El teléfono de Ismael estuvo en la zona de la Torre Cielo entre las 23:30 y las 00:10 de esa noche, contradiciendo su coartada de estar "en casa".',
    },
    {
      id: 'borrador-ismael',
      name: 'Borrador Nunca Enviado',
      description: 'Nota en Anotta del teléfono de Ismael, incautado tras orden de cateo.',
      type: 'digital',
      icon: '📝',
      location: 'Teléfono de Ismael',
      isKey: true,
      analysis:
        '"Si no me vas a escuchar, voy a subir de todas formas." Escrito y nunca enviado la misma noche de la muerte de Valeria.',
    },
    {
      id: 'correo-contrato',
      name: 'Correo Interno de la Marca',
      description: 'Correo sobre el contrato de exclusividad de Valeria.',
      type: 'document',
      icon: '✉️',
      location: 'Laptop de Karina',
      isKey: false,
      analysis: 'Confirma que la marca sabía del riesgo de perder el contrato de Valeria por las denuncias contra Ismael.',
    },
    {
      id: 'recibo-cena',
      name: 'Recibo de Restaurante',
      description: 'Recibo y fotos grupales con marca de tiempo de la cena corporativa.',
      type: 'digital',
      icon: '🧾',
      location: 'Teléfono de Karina',
      isKey: false,
      analysis: 'Confirma la coartada de Karina: cena corporativa hasta la una de la madrugada, con seis testigos.',
    },
  ],

  hotspots: [
    {
      id: 'balcon',
      x: 50,
      y: 20,
      label: 'Balcón',
      evidenceId: 'puerta-balcon',
      description: 'El balcón desde donde cayó. La puerta corrediza sigue abierta.',
      icon: '🌆',
    },
    {
      id: 'mesa-centro',
      x: 30,
      y: 55,
      label: 'Mesa de Centro',
      evidenceId: 'copa-vino-valeria',
      description: 'Mesa de centro con la copa de vino a medio terminar.',
      icon: '🍷',
    },
    {
      id: 'tripode',
      x: 70,
      y: 40,
      label: 'Trípode de Transmisión',
      evidenceId: 'tripode-luz',
      description: 'El aro de luz para transmisiones, aún montado, ahora volcado.',
      icon: '🎬',
    },
    {
      id: 'cama-telefono',
      x: 25,
      y: 75,
      label: 'Teléfono de Valeria',
      evidenceId: null,
      deviceId: 'phone-valeria',
      description: 'El teléfono que Renata rescató antes de que llegara la policía.',
      icon: '📱',
    },
    {
      id: 'escritorio-valeria',
      x: 80,
      y: 65,
      label: 'Escritorio',
      evidenceId: null,
      description: 'Escritorio con premios de marca y fotos enmarcadas de campañas pasadas.',
      icon: '🖼️',
    },
  ],

  digitalDevices: [
    {
      id: 'phone-valeria',
      ownerSuspectId: null,
      label: 'Teléfono de Valeria Ontiveros',
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
              timestamp: '23:20',
              text: 'Ismael me volvió a escribir desde una cuenta nueva. Dice que va a "subir algo" si no le contesto.',
            },
            {
              id: 'msg-renata-2',
              sender: 'Renata',
              timestamp: '23:22',
              text: 'Denúncialo YA. Con nombre. No sigas protegiéndolo por lástima.',
            },
            {
              id: 'msg-renata-3',
              sender: 'Valeria',
              timestamp: '23:24',
              text: 'Mañana. Hoy solo quiero terminar la transmisión y dormir.',
            },
            {
              id: 'msg-renata-4',
              sender: 'Renata',
              timestamp: '23:25',
              text: 'Valeria por favor. Esto se está saliendo de control.',
            },
            {
              id: 'msg-renata-5',
              sender: 'Valeria',
              timestamp: '23:41',
              text: 'Alguien está tocando el timbre. Raro a esta hora. Ahora te escribo.\n\n(sin más mensajes enviados por Valeria después de las 23:41)',
              evidenceId: 'chat-renata-valeria',
            },
          ],
        },
      ],
      notes: [
        {
          id: 'note-video-1',
          appId: 'nubeplus',
          title: 'Fragmento recuperado — transmisión eliminada',
          body:
            'Transcripción parcial — minuto 47:12 de la transmisión:\n\nVALERIA: "...perdón, alguien está tocando, ya vuelvo, no se vayan—"\n(se escuchan pasos, una puerta, una voz masculina baja e inaudible)\nVALERIA: "¿Cómo entraste? Esto no está bien, tienes que irte—"\n(sonido de forcejeo breve, un golpe metálico y silencio)\n(la transmisión continúa 40 segundos más mostrando una sala vacía antes de que la señal se corte manualmente desde el panel de administración de la cuenta)',
          evidenceId: 'video-eliminado-recuperado',
        },
      ],
    },
  ],

  tensionEvents: [
    {
      id: 'tension-004-hint',
      triggerActionCount: 6,
      message: 'El reloj de las 48 horas sigue corriendo. Sientes que se te escapa algo del teléfono de Valeria.',
      effect: {
        revealHint: 'Revisa la app NubePlus del teléfono de Valeria — hay un fragmento recuperado que quizás no has visto.',
      },
    },
    {
      id: 'tension-004-lock',
      triggerActionCount: 16,
      message: 'Las 48 horas casi se cumplen — el fragmento recuperado de la transmisión fue purgado del respaldo, junto con la conversación con Renata.',
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
      'Ismael Duarte, obsesionado con Valeria y a punto de ser expuesto y despedido como moderador tras su denuncia interna, programó publicaciones automáticas para simular estar "en línea" toda la noche mientras viajaba a la Torre Cielo. Entró al edificio por el balcón contiguo, accesible desde una unidad vacía en renovación, y confrontó a Valeria mientras ella transmitía en vivo sin saberlo. Forzó la puerta del balcón, discutieron, y la empujó en el forcejeo — la transmisión capturó el sonido pero no la imagen. Usando el acceso administrativo que nunca le revocaron como ex-moderador, cortó y eliminó la transmisión ocho minutos después, sin saber que el servidor de respaldo la conservaba.',
    timeline: [
      { time: 'Hace 10 días', description: 'Valeria denuncia a Ismael internamente; la marca inicia una revisión que nunca se completa.' },
      { time: '23:00', description: 'Ismael activa publicaciones programadas para simular estar en línea.' },
      { time: '23:20', description: 'Valeria le cuenta a Renata que Ismael volvió a escribirle.' },
      { time: '23:41', description: 'Valeria escucha el timbre durante su transmisión en vivo.' },
      { time: '23:44', description: 'Ismael entra por el balcón de la unidad vacía contigua.' },
      { time: '23:58', description: 'Forcejeo en el balcón; Valeria cae.' },
      { time: '00:06', description: 'La transmisión es cortada y eliminada desde una cuenta administrativa nunca revocada.' },
      { time: '00:15', description: 'Un vecino reporta el hallazgo del cuerpo en la planta baja.' },
    ],
    proof: {
      means: ['puerta-balcon', 'triangulacion-celular'],
      motive: ['denuncia-valeria', 'borrador-ismael'],
      opportunity: ['actividad-programada', 'video-eliminado-recuperado'],
    },
  },
}

export default case004
