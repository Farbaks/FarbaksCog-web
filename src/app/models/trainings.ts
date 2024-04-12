export class Trainings {
}


export class NewAssessment {
    asessmentType!: 'tmt-a' | 'tmt-b';
    time!: number;
}

export class NewTraining {
    trainingType!: 'words-recall' | 'numbers-recall' | 'object-recognition';
    time: number = 0;
    score!: number;
    difficulty!: number;
}