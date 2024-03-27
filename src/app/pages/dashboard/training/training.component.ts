import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmtAssessmentComponent } from 'src/app/components/tmt-assessment/tmt-assessment.component';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [
    CommonModule,
    TmtAssessmentComponent
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
        console.log(this.trainingType);
    }
}
