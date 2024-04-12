import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { GeneralService } from 'src/app/services/general.service';
import { TrainingsService } from 'src/app/services/trainings.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})

export class LayoutComponent {
    sidebarOpen: boolean = false;
    canPlayAssessment: boolean = true;
    constructor(
        private location: Location,
        private generalService: GeneralService,
        private trainingService: TrainingsService
    ) {
        this.location.onUrlChange(() => {
            this.sidebarOpen = false;
        })
        this.checkAssessmentCanBePlayed();
    }


    toggleSideBar() {
        this.sidebarOpen = !this.sidebarOpen;
    }

    async checkAssessmentCanBePlayed() {
        let res:any = await firstValueFrom(this.trainingService.canPlayTrainings('assessment'));
        this.canPlayAssessment =  res.data?.canPlay;
    }

    logout() {
        this.generalService.logoutUser();
    }
}

export const DASHBOARD_ROUTES: Array<Route> = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import("../home/home.component").then(mod => mod.HomeComponent) 
            },
            {
                path: ':trainingId',
                loadComponent: () => import("../training/training.component").then(mod => mod.TrainingComponent) 
            },
        ]
    }, 
];
