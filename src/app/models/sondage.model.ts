export interface Sondage {
  id: number;
  title: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  questions: Question[];
}

export interface Question {
  text: string;
  type: string;
  choixList: Choix[];
}

export interface Choix {
  label: string;
}