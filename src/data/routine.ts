export interface DayRoutine {
  day: string;
  exerciseIds: string[];
  focus: string;
}

export const WEEKLY_ROUTINE: DayRoutine[] = [
  {
    day: 'Lunes',
    exerciseIds: ['1', '3', '8'],
    focus: 'Equilibrio y Postura'
  },
  {
    day: 'Martes',
    exerciseIds: ['2', '6', '9'],
    focus: 'Movilidad y Enfoque'
  },
  {
    day: 'Miércoles',
    exerciseIds: ['3', '4', '10'],
    focus: 'Respiración y Flexibilidad'
  },
  {
    day: 'Jueves',
    exerciseIds: ['1', '5', '7'],
    focus: 'Coordinación y Estabilidad'
  },
  {
    day: 'Viernes',
    exerciseIds: ['2', '3', '6', '8'],
    focus: 'Relajación y Apertura'
  },
  {
    day: 'Sábado',
    exerciseIds: ['4', '5', '7', '9'],
    focus: 'Fortalecimiento Integral'
  },
  {
    day: 'Domingo',
    exerciseIds: ['3', '10'],
    focus: 'Meditación y Fluidez'
  }
];

