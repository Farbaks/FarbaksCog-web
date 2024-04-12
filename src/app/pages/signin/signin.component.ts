import { Component, OnInit } from '@angular/core';
import { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import { NgxParticlesModule } from "@tsparticles/angular";
import { AnimationOne } from 'src/assets/json/animation-one';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';
import { SubSink } from 'subsink';
import { Signin } from 'src/app/models/auth';

@Component({
    selector: 'app-signin',
    standalone: true,
    imports: [
        CommonModule,
        NgxParticlesModule,
        RouterModule,
        ReactiveFormsModule
    ],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {
    id = "tsparticles";
    particlesOptions: typeof AnimationOne = AnimationOne;
    form: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';
    processLoading: boolean = false;
    subs: SubSink = new SubSink();
    constructor(
        private authService: AuthService,
        private generalService: GeneralService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required],
        })
    }

    ngOnInit(): void {
    }

    async particlesInit(engine: Engine): Promise<void> {
        await loadSlim(engine);
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    signIn() {
        if (this.processLoading) return;

        this.form.markAllAsTouched();
        this.form.markAsDirty();

        this.errorMessage = '';
        this.successMessage = '';

        if (!this.form.valid) {
            this.errorMessage = 'Please enter all fields.'
            return;
        }

        this.processLoading = true;
        let data = new Signin();
        data = {
            ...data,
            ...this.form.value,
        }

        this.authService.login(data).subscribe({
            next: (res: any) => {
                this.processLoading = false;

                if (!/^20.*/.test(res.statusCode)) {
                    this.errorMessage = res.message;
                    return;
                }
                
                this.successMessage = res.message;
                this.generalService.saveUser(res.data);

                setTimeout(() => {
                    this.router.navigateByUrl('/dashboard');
                }, 1500);
            },
            error: (error: any) => {
                this.processLoading = false;
                this.errorMessage = error;
            }
        })
    }
}
