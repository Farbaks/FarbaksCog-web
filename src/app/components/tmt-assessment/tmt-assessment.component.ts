import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TmtComponentComponent } from '../tmt-component/tmt-component.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { TrainingsService } from 'src/app/services/trainings.service';
import { firstValueFrom } from 'rxjs';
import { NewAssessment } from 'src/app/models/trainings';

@Component({
    selector: 'app-tmt-assessment',
    standalone: true,
    imports: [
        CommonModule,
        TmtComponentComponent
    ],
    templateUrl: './tmt-assessment.component.html',
    styleUrl: './tmt-assessment.component.scss'
})
export class TmtAssessmentComponent {
    step: number = 1;
    startTime: any;
    timerInterval: any;
    elapsedTime: number = 0;
    time: { tmtATime: number, tmtBTime: number } = { tmtATime: 0, tmtBTime: 0 };
    gameStep: 'loading' | 'display' = 'loading';
    errorMessage: string = '';
    processLoading: boolean = false;
    subs: SubSink = new SubSink();
    constructor(
        private router: Router,
        private trainingsService: TrainingsService
    ) {
    }

    goToNextStep(): void {
        this.step += 1;
    }

    goToPreviousStep(): void {
        this.step -= 1;
    }

    loadTMT() {
        this.goToNextStep();
        this.gameStep = 'loading';
        setTimeout(() => {
            this.gameStep = 'display';

            setTimeout(() => {
                this.startTimer();
            }, 100);
        }, 3000);
    }

    startTimer(): void {
        this.startTime = performance.now();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 100);
    }

    stopTimer(): void {
        clearInterval(this.timerInterval);
    }

    updateTimer(): void {
        const currentTime = performance.now();
        this.elapsedTime = ((currentTime - this.startTime) / 1000);
    }

    singleAssessmentCompleted() {
        this.stopTimer();
        if (this.step == 3) {
            this.time.tmtATime = this.elapsedTime;
        }
        else {
            this.time.tmtBTime = this.elapsedTime;
        }
        setTimeout(() => {
            this.goToNextStep();
        }, 3000);
    }

    async cogAssessmentComplete() {
        // Save time to database
        await this.saveData("tmt-a");
        await this.saveData("tmt-b");

        this.goToNextStep();
    }

    async saveData(type: 'tmt-a' | 'tmt-b') {
        if (this.processLoading) return;

        this.errorMessage = '';

        this.processLoading = true;
        let data = new NewAssessment();
        data = {
            asessmentType: type,
            time: +(type == 'tmt-a' ? this.time.tmtATime.toFixed(0) : this.time.tmtBTime.toFixed(0))
        }
        try {
            let res: any = await firstValueFrom(this.trainingsService.addAssessment(data));

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
