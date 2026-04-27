export interface Answer {
  questionId: number;
  choixIds?: number[];
  texte?: string;
}

export interface ParticipationRequest {
  sondageId: number;
  answers: Answer[];
}