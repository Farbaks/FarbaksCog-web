import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TmtComponentComponent } from '../tmt-component/tmt-component.component';
import { Router } from '@angular/router';

type TMTCircle = {
    id: number,
    left: string,
    top: string,
    wrong: boolean,
    position: { x: number, y: number }
}

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
    ctx: any;
    time: { tmtATime: number, tmtBTime: number} = { tmtATime: 0, tmtBTime: 0};
    constructor(
        private router: Router
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
        setTimeout(() => {
            this.startTimer();
        }, 100);
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
        if(this.step == 3) {
            this.time.tmtATime = this.elapsedTime;
        }
        else {
            this.time.tmtBTime = this.elapsedTime;
        }
        setTimeout(() => {
            this.goToNextStep();
        }, 3000);
    }

    cogAssessmentComplete() {
        // Save time to database
        
        // Redirect to home page
        this.router.navigateByUrl("/dashboard");
    }
}
