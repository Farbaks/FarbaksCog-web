import { Component } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        RouterModule
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})

export class LayoutComponent {

}

export const DASHBOARD_ROUTES: Array<Route> = [
    {
        path: '',
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
