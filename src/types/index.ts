export type Language = 'es' | 'pt' | 'en';

export interface Category {
  id: string;
  name: Record<Language, string>;
  containerColorName: Record<Language, string>;
  colorHex: string;
  textColorHex: string;
  borderHex: string;
  iconName: string; // Lucide icon identifier
  description: Record<Language, string>;
  ntpNorm: string; // e.g. "NTP 900.058:2019"
  confirmationStatus: 'confirmed' | 'pending_confirmation';
}

export interface WasteItem {
  id: string;
  name: Record<Language, string>;
  synonyms: Record<Language, string[]>;
  categoryId: string;
  explanation: Record<Language, string>; // Por qué va en este contenedor
  observation: Record<Language, string>; // Ej: Vaciar antes, aplastar, etc.
  iconName?: string;
  commonInCampus: boolean;
}

export interface ContainerBin {
  categoryId: string;
  quantity: number;
  condition?: 'good' | 'fair' | 'poor';
}

export interface DisposalPoint {
  id: string; // P01, P02...
  code: string;
  name: string;
  referenceBuilding: string;
  lat: number;
  lng: number;
  photoUrl: string;
  conservationState: 'bueno' | 'regular' | 'malo';
  accessibility: 'rampa' | 'nivel' | 'escalones';
  observations: string;
  bins: ContainerBin[];
  active: boolean;
}

export interface UserCoords {
  lat: number;
  lng: number;
  accuracy?: number;
  isCustomReference?: boolean;
  referenceName?: string;
}
