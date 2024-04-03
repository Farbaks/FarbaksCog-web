import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NumbersRecallTrainingComponent } from 'src/app/components/numbers-recall-training/numbers-recall-training.component';
import { TmtAssessmentComponent } from 'src/app/components/tmt-assessment/tmt-assessment.component';
import { WordsRecallTrainingComponent } from 'src/app/components/words-recall-training/words-recall-training.component';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [
    CommonModule,
    TmtAssessmentComponent,
    WordsRecallTrainingComponent,
    NumbersRecallTrainingComponent
  ],
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss'
})
export class TrainingComponent {
    trainingType: 'assessment' | 'words-recall' | 'numbers-recall' | 'pattern-matching' | 'spatial-memory';
    constructor(
        private route: ActivatedRoute
    ) {
        this.trainingType = this.route.snapshot.params["trainingId"];
    }
}
