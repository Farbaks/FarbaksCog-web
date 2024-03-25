import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'signin',
        loadComponent: () => import("./pages/signin/signin.component").then(m => m.SigninComponent),
    },
    {
        path: 'signup',
        loadComponent: () => import("./pages/signup/signup.component").then(m => m.SignupComponent),
    },
    {
        path: 'dashboard',
        loadComponent: () => import("./pages/dashboard/home/home.component").then(m => m.HomeComponent),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'signin'
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
