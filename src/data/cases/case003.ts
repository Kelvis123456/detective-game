import type { Case } from '../../types'

const case003: Case = {
  id: 'case-003',
  title: 'Sombras en el Puerto',
  subtitle: 'El mar guarda secretos',
  description:
    'El Capitán Armando Fuentes aparece muerto en la bodega de su barco en el Puerto de San Marcos. La policía dice "accidente laboral". Las marcas en el cuerpo dicen otra cosa.',
  difficulty: 'Difícil',
  location: 'Puerto de San Marcos',
  date: '8 de mayo, 03:22',
  thumbnail: '⚓',
  color: '#1a4a2e',
  intro:
    'El Puerto de San Marcos duerme bajo una bruma espesa. Solo el ruido del agua contra los cascos metálicos rompe el silencio. Armando Fuentes — marinero de 20 años, capitán respetado — yace al pie de una plataforma de carga. Sus socios dicen que resbaló. Pero los resbalones no dejan ese tipo de marcas. Alguien lo empujó. Y alguien lo está encubriendo.',
  crimeSceneDescription:
    'La bodega de carga del barco "Estrella del Sur" huele a sal y motor diésel. Las marcas en el suelo sugieren una pelea. El pasamanos superior está suelto. En la mesa de navegación hay documentos comerciales. El localizador GPS del barco fue desactivado.',

  suspects: [
    {
      id: 'diego-navarro',
      name: 'Diego Navarro',
      age: 42,
      occupation: 'Empresario / Socio Comercial',
      description:
        'Hombre elegante fuera de lugar en un puerto. Traje caro, reloj caro, respuestas demasiado cuidadas.',
      avatar: '🤵',
      motive:
        'Socio de Fuentes en una red de contrabando. Quería quedarse con el 100% del negocio y eliminar al único testigo que podía hundirlo.',
      alibi: 'Dice que estaba en un hotel de la ciudad. El registro lo pone llegando a las 3:15 AM — después de la muerte.',
      isGuilty: true,
      dialogues: [
        {
          id: 'd-q1',
          question: '¿Cuál era su relación con el Capitán Fuentes?',
          answer:
            'Socios comerciales. Importamos materias primas del exterior. Todo completamente legal y documentado.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'd-q2',
          question: 'El registro del hotel lo sitúa llegando a las 3:15. La muerte fue a las 3:22.',
          answer:
            'Me confundí con el horario. Llegué antes, seguramente. Los empleados del hotel no siempre están atentos. Es un error de registro.',
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 'd-q3',
          question: 'Encontramos una póliza de seguro de vida con usted como beneficiario.',
          answer:
            'Es... una práctica estándar entre socios comerciales. Si uno muere, el otro necesita compensación para continuar el negocio. Es completamente normal.',
          emotionalState: 'evasive',
          revealedEvidenceIds: ['poliza-seguro'],
        },
        {
          id: 'd-q4',
          question: '¿Qué llevaba el barco en su última travesía?',
          answer:
            'Materias primas. Ya lo dije. No tengo los manifiestos en la cabeza, para eso están los documentos.',
          emotionalState: 'evasive',
          revealedEvidenceIds: ['cargamento-sospechoso'],
        },
        {
          id: 'd-q5',
          question: 'Tenemos una fotografía suya con Fuentes y mercancía no declarada.',
          answer:
            'Esa foto está fuera de contexto. Yo... exijo un abogado. No digo nada más.',
          emotionalState: 'angry',
          revealedEvidenceIds: ['fotografia-contrabando'],
        },
      ],
    },
    {
      id: 'isabel-reyes',
      name: 'Isabel Reyes',
      age: 35,
      occupation: '¿Comerciante? (Agente Encubierta)',
      description:
        'Mujer reservada con mirada calculadora. Da respuestas mínimas. Parece saber más de lo que dice.',
      avatar: '🕵️',
      motive:
        'Investiga la red de contrabando desde hace 8 meses. Estaba en el puerto esa noche para documentar, no para matar.',
      alibi: 'Estaba fotografiando el barco desde un muelle cercano. Tiene fotos con marca de tiempo.',
      isGuilty: false,
      dialogues: [
        {
          id: 'i-q1',
          question: '¿Qué hacía en el puerto a las 3 de la madrugada?',
          answer:
            'No estoy obligada a responder eso. Tengo mis razones.',
          emotionalState: 'calm',
          revealedEvidenceIds: [],
        },
        {
          id: 'i-q2',
          question: 'Esto es una investigación de homicidio. Necesito que coopere.',
          answer:
            'Está bien. Puede llamar al número de esta tarjeta. Le confirmará mi identidad y autorización. Trabajo para alguien que investiga a Fuentes y Navarro desde hace meses.',
          emotionalState: 'calm',
          revealedEvidenceIds: ['credencial-agente'],
        },
        {
          id: 'i-q3',
          question: '¿Vio a Diego Navarro esa noche?',
          answer:
            'Sí. Lo vi entrar al barco a las 2:47 AM. Solo. Salió a las 3:18. Tengo fotos. Se las daré — Navarro es el objetivo, no soy yo.',
          emotionalState: 'calm',
          revealedEvidenceIds: ['fotos-vigilancia'],
        },
        {
          id: 'i-q4',
          question: '¿Por qué no avisó a la policía cuando vio a Navarro?',
          answer:
            'Porque mi operativo aún no tenía suficiente evidencia. Un arresto prematuro habría destruido ocho meses de trabajo. No sabía que iba a matar a alguien esa noche.',
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
      ],
    },
    {
      id: 'rafael-moreno',
      name: 'Rafael Moreno',
      age: 28,
      occupation: 'Estibador',
      description:
        'Joven fuerte con cicatrices visibles en los brazos. Nervioso. Claramente le tiene miedo a algo o a alguien.',
      avatar: '⚓',
      motive:
        'Le debía $15,000 a Fuentes de una deuda de juego. Tiene motivo pero no ejecutó el crimen.',
      alibi: 'Estaba en el bar "El Ancla" hasta las 2:00 AM. Dos bartenders lo confirman.',
      isGuilty: false,
      dialogues: [
        {
          id: 'ra-q1',
          question: '¿Conocía bien al Capitán Fuentes?',
          answer:
            'Trabajaba en su barco hace dos años. Buen jefe. Exigente pero justo.',
          emotionalState: 'sad',
          revealedEvidenceIds: [],
        },
        {
          id: 'ra-q2',
          question: 'Sabemos de la deuda de $15,000 que tenía con Fuentes.',
          answer:
            'Sí. Le debo dinero. Pero eso no significa que lo maté. ¿Para qué iba a matar a quien me podía cobrar? Eso no tiene lógica.',
          emotionalState: 'nervous',
          revealedEvidenceIds: ['deuda-escrita'],
        },
        {
          id: 'ra-q3',
          question: '¿Qué son esas cicatrices?',
          answer:
            'De una pelea hace tres meses. Nada que ver con esto. El tipo que me las hizo está en la cárcel.',
          emotionalState: 'nervous',
          revealedEvidenceIds: [],
        },
        {
          id: 'ra-q4',
          question: '¿Vio algo inusual en el puerto estas últimas semanas?',
          answer:
            'El socio de Fuentes — Navarro — venía al barco a horas raras. Y una vez escuché a Fuentes decirle que "ya no quería seguir con el trato". Navarro no lo tomó bien.',
          emotionalState: 'evasive',
          revealedEvidenceIds: ['mensaje-borrado'],
        },
      ],
    },
  ],

  evidence: [
    {
      id: 'huella-pasamanos',
      name: 'Huella en el Pasamanos',
      description: 'Huella dactilar completa en el pasamanos de la plataforma superior.',
      type: 'physical',
      icon: '🖐️',
      location: 'Plataforma superior de carga',
      isKey: true,
      analysis:
        'Huella dactilar perfectamente conservada en el pasamanos superior — el único lugar desde donde alguien podría haber empujado a Fuentes. La huella pertenece a Diego Navarro según la base de datos de la policía comercial (tiene registro por un litigio civil anterior).',
    },
    {
      id: 'poliza-seguro',
      name: 'Póliza de Seguro de Vida',
      description: 'Póliza reciente con Diego Navarro como único beneficiario.',
      type: 'document',
      icon: '📄',
      location: 'Archivador del capitán',
      isKey: true,
      analysis:
        'Póliza de seguro de vida de $500,000 a nombre de Armando Fuentes, con Diego Navarro como beneficiario designado. Fecha de emisión: hace exactamente 14 días. Esta póliza no existía hace un mes. Navarro la firmó como "socio comercial designado".',
    },
    {
      id: 'fotos-vigilancia',
      name: 'Fotos de Vigilancia',
      description: 'Fotografías con marca de tiempo de Navarro entrando y saliendo del barco.',
      type: 'digital',
      icon: '📸',
      location: 'Teléfono de Isabel Reyes',
      isKey: true,
      analysis:
        'Series de fotografías con metadata verificable: Navarro entra al barco a las 02:47 AM, sale a las 03:18 AM. La muerte de Fuentes ocurrió a las 03:22 según el forense. Navarro estuvo en el barco exactamente antes de la muerte.',
    },
    {
      id: 'mensaje-borrado',
      name: 'Mensaje de Texto Recuperado',
      description: 'Fragmento de conversación borrada entre Fuentes y Navarro.',
      type: 'digital',
      icon: '📱',
      location: 'Teléfono de la víctima',
      isKey: true,
      analysis:
        'Recuperación forense del teléfono: "...no me importa lo que digas, yo me salgo de esto. Si no te parece, habla con [BORRADO]... mañana en el barco y lo arreglamos de una vez. Ya decidí." — Fuentes a Navarro, 11:45 PM del día anterior. Fuentes quería abandonar el negocio.',
    },
    {
      id: 'cargamento-sospechoso',
      name: 'Manifiesto Alterado',
      description: 'Documento de carga con correcciones y sobrescrituras sospechosas.',
      type: 'document',
      icon: '📦',
      location: 'Mesa de navegación',
      isKey: false,
      analysis:
        'El manifiesto de la última travesía lista "cerámica decorativa" por 2.3 toneladas. Pero el calado del barco según los registros del puerto indica un peso real de 4.1 toneladas. La diferencia no declarada equivale a carga de alto valor en el mercado negro.',
    },
    {
      id: 'credencial-agente',
      name: 'Credencial Oficial',
      description: 'Identificación de agente encubierta de la Agencia de Aduanas.',
      type: 'document',
      icon: '🪪',
      location: 'Isabel Reyes (al ser cuestionada)',
      isKey: false,
      analysis:
        'Credencial verificada y activa de Isabel Reyes como agente especial de la Unidad Anticontrabando de Aduanas. Su presencia en el puerto esa noche era parte de una operación de 8 meses. No es sospechosa del crimen — es un aliado inesperado.',
    },
    {
      id: 'deuda-escrita',
      name: 'Pagaré de Rafael Moreno',
      description: 'Documento firmado reconociendo la deuda de $15,000.',
      type: 'document',
      icon: '📝',
      location: 'Cajón del escritorio del capitán',
      isKey: false,
      analysis:
        'Pagaré firmado por Rafael Moreno. Existe el motivo, pero el alibi de Moreno (confirmado por dos testigos en el bar) lo descarta como autor. La deuda da contexto pero no apunta al asesino.',
    },
    {
      id: 'fotografia-contrabando',
      name: 'Fotografía Comprometedora',
      description: 'Foto de Navarro y Fuentes junto a mercancía sin etiquetar.',
      type: 'physical',
      icon: '🖼️',
      location: 'Compartimiento oculto del barco',
      isKey: false,
      analysis:
        'Fotografía polaroid mostrando a Navarro y Fuentes sonriendo junto a cajas sin marcar en una bodega portuaria diferente. Fecha escrita al reverso: hace 8 meses. Confirma la asociación criminal entre ambos y el motive de Navarro para silenciar a Fuentes.',
    },
  ],

  hotspots: [
    {
      id: 'pasamanos',
      x: 55,
      y: 22,
      label: 'Pasamanos Superior',
      evidenceId: 'huella-pasamanos',
      description: 'El pasamanos metálico de la plataforma de carga. Está ligeramente suelto.',
      icon: '🔩',
    },
    {
      id: 'archivador-barco',
      x: 72,
      y: 58,
      label: 'Archivador del Capitán',
      evidenceId: 'poliza-seguro',
      description: 'Archivador oxidado con documentos personales y comerciales.',
      icon: '🗂️',
    },
    {
      id: 'mesa-navegacion',
      x: 35,
      y: 52,
      label: 'Mesa de Navegación',
      evidenceId: 'cargamento-sospechoso',
      description: 'Mesa con mapas náuticos, bitácora y manifiestos de carga.',
      icon: '🗺️',
    },
    {
      id: 'telefono-victima',
      x: 25,
      y: 70,
      label: 'Teléfono de la Víctima',
      evidenceId: 'mensaje-borrado',
      description: 'Teléfono celular de Fuentes, pantalla rajada. Necesita extracción forense.',
      icon: '📱',
    },
    {
      id: 'compartimiento',
      x: 80,
      y: 72,
      label: 'Compartimiento Oculto',
      evidenceId: 'fotografia-contrabando',
      description: 'Panel metálico suelto en la pared de la bodega. Oculta algo.',
      icon: '🚪',
    },
  ],

  correctConnections: [
    { fromId: 'huella-pasamanos', toId: 'diego-navarro' },
    { fromId: 'poliza-seguro', toId: 'diego-navarro' },
    { fromId: 'fotos-vigilancia', toId: 'diego-navarro' },
    { fromId: 'mensaje-borrado', toId: 'diego-navarro' },
    { fromId: 'fotografia-contrabando', toId: 'diego-navarro' },
    { fromId: 'credencial-agente', toId: 'isabel-reyes' },
    { fromId: 'deuda-escrita', toId: 'rafael-moreno' },
  ],

  solution: {
    guiltyId: 'diego-navarro',
    explanation:
      'Diego Navarro mató al Capitán Fuentes para proteger su red de contrabando y cobrar el seguro de vida. Cuando Fuentes le comunicó por mensaje que quería abandonar el negocio, Navarro entendió que representaba un riesgo: podría hablar con las autoridades. Fue al barco a las 2:47 AM, discutieron en la plataforma superior, y Navarro lo empujó. Olvidó limpiar su huella del pasamanos — el único error en un plan calculado. La agente Isabel Reyes lo fotografió sin saber que acababa de documentar a un asesino.',
    timeline: [
      { time: '11:45 PM (día anterior)', description: 'Fuentes le envía mensaje a Navarro: quiere salirse del negocio.' },
      { time: '02:47 AM', description: 'Navarro sube al barco. Isabel Reyes lo fotografía desde el muelle.' },
      { time: '02:50 AM', description: 'Navarro y Fuentes discuten en la plataforma superior.' },
      { time: '03:20 AM', description: 'Navarro empuja a Fuentes desde la plataforma. Huella en el pasamanos.' },
      { time: '03:18 AM', description: 'Navarro abandona el barco. Fotografiado al salir.' },
      { time: '03:22 AM', description: 'El cuerpo de Fuentes es encontrado por un vigilante nocturno.' },
      { time: '03:45 AM', description: 'Navarro llega al hotel y registra su entrada. Coartada tardía.' },
    ],
    proof: {
      means: ['huella-pasamanos'],
      motive: ['poliza-seguro', 'fotografia-contrabando'],
      opportunity: ['fotos-vigilancia'],
    },
  },
}

export default case003
