import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GeneralService } from 'src/app/services/general.service';
import { TrainingsService } from 'src/app/services/trainings.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    user: any;
    report: any;
    subs: SubSink = new SubSink();
    canPlayTrainings: any = {};
    constructor(
        private generalService: GeneralService,
        private trainingService: TrainingsService,
        private router: Router
    ) {
        this.getUser();
        this.getReport();
        this.getConfig();
    }

    getUser() {
        this.user = this.generalService.getUser();
    }

    getReport() {
        this.trainingService.getReport().subscribe({
            next: (res: any) => {
                this.report = res.data;
            }
        })
    }

    async getConfig() {
        this.canPlayTrainings.wordsRecall = await this.checkTrainingsCanBePlayed("words-recall");
        this.canPlayTrainings.numbersRecall = await this.checkTrainingsCanBePlayed("numbers-recall");
        this.canPlayTrainings.objectRecognition = await this.checkTrainingsCanBePlayed("object-recognition");
        this.canPlayTrainings.assessment = await this.checkTrainingsCanBePlayed("assessment");
    }

    async checkTrainingsCanBePlayed(type: 'words-recall' | 'numbers-recall' | 'object-recognition' | 'assessment') {
        let res:any = await firstValueFrom(this.trainingService.canPlayTrainings(type));
        return res.data?.canPlay;
    }

    goToTraining(type: 'words-recall' | 'numbers-recall' | 'object-recognition' | 'assessment') {
        this.router.navigateByUrl(`/dashboard/${type}`)
    }

}
