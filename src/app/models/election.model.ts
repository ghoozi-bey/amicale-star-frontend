export interface Election {

  id?: number;

  title: string;

  description: string;

  dateCreation?: string;

  dateDebut: string;

  dateFin: string;

  statut?: string;

  createdByNom?: string;

  createdByPrenom?: string;

  candidats?: string[];
}