import { Component, OnInit } from '@angular/core';
import { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import { NgxParticlesModule } from "@tsparticles/angular";
import { AnimationOne } from 'src/assets/json/animation-one';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SubSink } from 'subsink';
import { Signup } from 'src/app/models/auth';
import { GeneralService } from 'src/app/services/general.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        CommonModule,
        NgxParticlesModule,
        RouterModule,
        ReactiveFormsModule
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {
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
            age: ['', Validators.required],
            gender: ['male', Validators.required],
            trainingType: ['default', [Validators.required]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
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

    signUp() {
        if (this.processLoading) return;

        this.form.markAllAsTouched();
        this.form.markAsDirty();

        this.errorMessage = '';
        this.successMessage = '';

        if (!this.form.valid) {
            this.errorMessage = 'Please enter all fields.'
            return;
        }

        if(this.form.value.password != this.form.value.confirmPassword) {
            this.errorMessage = 'Passwords do not match.'
            return;
        }

        this.processLoading = true;
        let data = new Signup();
        data = {
            ...data,
            ...this.form.value,
        }

        this.authService.signup(data).subscribe({
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
