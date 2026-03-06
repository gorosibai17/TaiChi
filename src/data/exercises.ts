export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Principiante' | 'Intermedio';
  category: 'Equilibrio' | 'Flexibilidad' | 'Respiración';
  imageUrl: string;
  instructions: string[];
}

export const EXERCISES: Exercise[] = [
  {
    id: '1',
    title: 'Acariciar la Crin del Caballo Salvaje',
    description: 'Un movimiento fluido que mejora la coordinación y el equilibrio lateral.',
    duration: '5 min',
    difficulty: 'Principiante',
    category: 'Equilibrio',
    imageUrl: 'https://picsum.photos/seed/taichi1/800/600',
    instructions: [
      'Comienza con los pies a la anchura de los hombros.',
      'Sostén una "bola de energía" imaginaria frente a tu pecho.',
      'Da un paso suave hacia un lado mientras separas las manos.',
      'Mantén la espalda recta y la respiración profunda.'
    ]
  },
  {
    id: '2',
    title: 'Girar como una Rueda',
    description: 'Excelente para la movilidad de la columna y la relajación lumbar.',
    duration: '3 min',
    difficulty: 'Principiante',
    category: 'Flexibilidad',
    imageUrl: 'https://picsum.photos/seed/taichi2/800/600',
    instructions: [
      'Pies firmes en el suelo.',
      'Imagina que tus brazos son el radio de una rueda.',
      'Gira el torso suavemente de izquierda a derecha.',
      'Deja que los brazos cuelguen relajados y golpeen suavemente el cuerpo.'
    ]
  },
  {
    id: '3',
    title: 'Respiración del Loto',
    description: 'Centra la mente y expande la capacidad pulmonar.',
    duration: '4 min',
    difficulty: 'Principiante',
    category: 'Respiración',
    imageUrl: 'https://picsum.photos/seed/taichi3/800/600',
    instructions: [
      'Siéntate o quédate de pie cómodamente.',
      'Inhala profundamente mientras elevas las manos hacia el cielo.',
      'Exhala lentamente mientras bajas las manos hacia el centro.',
      'Siente cómo la calma inunda tu cuerpo.'
    ]
  },
  {
    id: '4',
    title: 'La Grulla Blanca Extiende sus Alas',
    description: 'Mejora la postura y abre el pecho para una mejor respiración.',
    duration: '6 min',
    difficulty: 'Intermedio',
    category: 'Equilibrio',
    imageUrl: 'https://picsum.photos/seed/taichi4/800/600',
    instructions: [
      'Apoya el peso en una pierna.',
      'Eleva un brazo hacia arriba y el otro hacia abajo.',
      'Mantén la mirada en un punto fijo para el equilibrio.',
      'Cambia de lado suavemente.'
    ]
  },
  {
    id: '5',
    title: 'Repeler al Mono',
    description: 'Un movimiento de retroceso que mejora la agilidad y la coordinación.',
    duration: '5 min',
    difficulty: 'Intermedio',
    category: 'Equilibrio',
    imageUrl: 'https://picsum.photos/seed/taichi5/800/600',
    instructions: [
      'Camina hacia atrás con pasos suaves.',
      'Mueve los brazos en círculos alternos frente a ti.',
      'Mantén el torso erguido y las rodillas ligeramente flexionadas.',
      'Coordina la respiración con cada paso.'
    ]
  },
  {
    id: '6',
    title: 'Manos como Nubes',
    description: 'Movimiento circular continuo que relaja los hombros y la mente.',
    duration: '7 min',
    difficulty: 'Principiante',
    category: 'Flexibilidad',
    imageUrl: 'https://picsum.photos/seed/taichi6/800/600',
    instructions: [
      'Mueve las manos en círculos frente a tu cara como si fueran nubes.',
      'Desplaza el peso de una pierna a otra rítmicamente.',
      'Mantén la mirada suave siguiendo el movimiento de las manos.',
      'Siente la fluidez en todo tu cuerpo.'
    ]
  },
  {
    id: '7',
    title: 'El Gallo Dorado se Sostiene en una Pata',
    description: 'Un ejercicio avanzado de equilibrio que fortalece las piernas y el core.',
    duration: '4 min',
    difficulty: 'Intermedio',
    category: 'Equilibrio',
    imageUrl: 'https://picsum.photos/seed/taichi7/800/600',
    instructions: [
      'Eleva una rodilla hacia el pecho mientras levantas el brazo del mismo lado.',
      'Mantén la pierna de apoyo ligeramente flexionada.',
      'Busca un punto fijo para mantener la estabilidad.',
      'Baja suavemente y repite con la otra pierna.'
    ]
  },
  {
    id: '8',
    title: 'Abanicar la Espalda',
    description: 'Abre los meridianos de la espalda y mejora la postura cervical.',
    duration: '5 min',
    difficulty: 'Principiante',
    category: 'Flexibilidad',
    imageUrl: 'https://picsum.photos/seed/taichi8/800/600',
    instructions: [
      'Entrelaza las manos frente a ti.',
      'Empuja hacia adelante mientras redondeas la espalda suavemente.',
      'Inhala al abrir los brazos hacia los lados como un abanico.',
      'Siente cómo se libera la tensión en los omóplatos.'
    ]
  },
  {
    id: '9',
    title: 'Empujar la Montaña',
    description: 'Fortalece los brazos y mejora la intención y el enfoque mental.',
    duration: '6 min',
    difficulty: 'Principiante',
    category: 'Respiración',
    imageUrl: 'https://picsum.photos/seed/taichi9/800/600',
    instructions: [
      'Lleva las manos hacia tus hombros con las palmas hacia afuera.',
      'Exhala mientras empujas lentamente hacia adelante.',
      'Inhala mientras recoges las manos hacia el pecho.',
      'Imagina que mueves una resistencia suave pero constante.'
    ]
  },
  {
    id: '10',
    title: 'Recoger la Luna del Mar',
    description: 'Mejora la flexibilidad de la cadera y la coordinación descendente.',
    duration: '5 min',
    difficulty: 'Intermedio',
    category: 'Flexibilidad',
    imageUrl: 'https://picsum.photos/seed/taichi10/800/600',
    instructions: [
      'Inclina el torso hacia adelante con la espalda recta.',
      'Cruza las manos frente a tus rodillas como si recogieras algo del suelo.',
      'Eleva los brazos por encima de la cabeza formando un círculo.',
      'Mantén las rodillas relajadas en todo momento.'
    ]
  }
];


