export interface CampusReferenceSpot {
  id: string;
  name: Record<'es' | 'pt' | 'en', string>;
  lat: number;
  lng: number;
}

export const UNCP_CAMPUS_CENTER = {
  lat: -12.0322,
  lng: -75.2370,
  zoom: 17,
  minZoom: 15,
  maxZoom: 19,
};

export const UNCP_CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [-12.0350, -75.2410], // Southwest
  [-12.0300, -75.2330], // Northeast
];

export const CAMPUS_REFERENCE_SPOTS: CampusReferenceSpot[] = [
  {
    id: 'spot_fiq',
    name: {
      es: 'Facultad de Ingeniería Química',
      pt: 'Faculdade de Engenharia Química',
      en: 'Chemical Engineering Faculty',
    },
    lat: -12.03285,
    lng: -75.23825,
  },
  {
    id: 'spot_educacion',
    name: {
      es: 'Facultad de Educación',
      pt: 'Faculdade de Educação',
      en: 'Education Faculty',
    },
    lat: -12.03260,
    lng: -75.23765,
  },
  {
    id: 'spot_paraninfo',
    name: {
      es: 'Paraninfo / Biblioteca Educación',
      pt: 'Paraninfo / Biblioteca Educação',
      en: 'Paraninfo / Education Library',
    },
    lat: -12.03255,
    lng: -75.23705,
  },
  {
    id: 'spot_comunicacion',
    name: {
      es: 'Facultad de Ciencias de la Comunicación',
      pt: 'Faculdade de Ciências da Comunicação',
      en: 'Communication Sciences Faculty',
    },
    lat: -12.03243,
    lng: -75.23669,
  },
  {
    id: 'spot_parque_integracion',
    name: {
      es: 'Parque de la Integración',
      pt: 'Parque da Integração',
      en: 'Integration Park',
    },
    lat: -12.03195,
    lng: -75.23620,
  },
  {
    id: 'spot_minas_metalurgia',
    name: {
      es: 'Ing. Minas y Metalurgia',
      pt: 'Eng. Minas e Metalurgia',
      en: 'Mining & Metallurgy Eng.',
    },
    lat: -12.03158,
    lng: -75.23580,
  },
  {
    id: 'spot_laboratorios',
    name: {
      es: 'Pabellón de Laboratorios de Investigación',
      pt: 'Pavilhão de Laboratórios de Pesquisa',
      en: 'Research Laboratories Pavilion',
    },
    lat: -12.03451,
    lng: -75.23929,
  },
  {
    id: 'spot_comedor_antiguo',
    name: {
      es: 'Comedor Universitario Antiguo',
      pt: 'Refeitório Universitário Antigo',
      en: 'Old University Cafeteria',
    },
    lat: -12.03403,
    lng: -75.23848,
  },
  {
    id: 'spot_pabellon_g',
    name: {
      es: 'Pabellón G / FMH',
      pt: 'Pavilhão G / FMH',
      en: 'Pavilion G / FMH',
    },
    lat: -12.03273,
    lng: -75.23577,
  },
  {
    id: 'spot_puerta1',
    name: {
      es: 'Puerta 1 UNCP (Ingreso Principal)',
      pt: 'Portaria 1 UNCP (Entrada Principal)',
      en: 'Gate 1 UNCP (Main Entrance)',
    },
    lat: -12.03221,
    lng: -75.23369,
  },
  {
    id: 'spot_pabellon_a',
    name: {
      es: 'Pabellón A / Área IV',
      pt: 'Pavilhão A / Área IV',
      en: 'Pavilion A / Area IV',
    },
    lat: -12.03315,
    lng: -75.23677,
  },
  {
    id: 'spot_losas_deportivas',
    name: {
      es: 'Losas Deportivas / Estadio',
      pt: 'Quadras Esportivas / Estádio',
      en: 'Sports Courts / Stadium',
    },
    lat: -12.03345,
    lng: -75.23937,
  },
];
