import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NumbersRecallTrainingComponent } from 'src/app/components/numbers-recall-training/numbers-recall-training.component';
import { ObjectRecognitionComponent } from 'src/app/components/object-recognition/object-recognition.component';
import { TmtAssessmentComponent } from 'src/app/components/tmt-assessment/tmt-assessment.component';
import { WordsRecallTrainingComponent } from 'src/app/components/words-recall-training/words-recall-training.component';
import { NewTraining } from 'src/app/models/trainings';
import { GeneralService } from 'src/app/services/general.service';
import { TrainingsService } from 'src/app/services/trainings.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-training',
    standalone: true,
    imports: [
        CommonModule,
        TmtAssessmentComponent,
        WordsRecallTrainingComponent,
        NumbersRecallTrainingComponent,
        ObjectRecognitionComponent
    ],
    templateUrl: './training.component.html',
    styleUrl: './training.component.scss'
})
export class TrainingComponent {
    trainingType: 'assessment' | 'words-recall' | 'numbers-recall' | 'object-recognition';
    user: any;
    errorMessage: string = '';
    processLoading: boolean = false;
    subs: SubSink = new SubSink();
    difficulty: number = 1;
    constructor(
        private route: ActivatedRoute,
        private generalService: GeneralService,
        private trainingService: TrainingsService
    ) {
        this.trainingType = this.route.snapshot.params["trainingId"];
        this.getUser();
        this.getDifficultyLevel();
    }

    getUser() {
        this.user = this.generalService.getUser();
    }

    getDifficultyLevel() {
        this.trainingService.getDifficultyLevel(this.trainingType as any).subscribe({
            next: (res: any) => {
                this.difficulty = res.data.difficultyLevel;
            }
        })
    }

    async saveData(type: 'words-recall' | 'numbers-recall' | 'object-recognition', event:any) {
        if (this.processLoading) return;

        this.errorMessage = '';

        this.processLoading = true;
        let data = new NewTraining();
        data = {
            ...event,
            trainingType: type,
            time: 0
        }
        try {
            let res: any = await firstValueFrom(this.trainingService.addTraining(data));
            this.processLoading = false;

            if (!/^20.*/.test(res.statusCode)) {
                this.errorMessage = res.message;
                return;
            }
        }
        catch (e) {
            this.processLoading = false;
            this.errorMessage = "" + e;
        }
    }
}
