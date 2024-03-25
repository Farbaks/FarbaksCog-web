import { Component, OnInit } from '@angular/core';
import { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import { NgxParticlesModule } from "@tsparticles/angular";
import { AnimationOne } from 'src/assets/json/animation-one';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-signin',
    standalone: true,
    imports: [
        NgxParticlesModule,
        RouterModule
    ],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {
    id = "tsparticles";

    particlesOptions: typeof AnimationOne = AnimationOne;
    constructor() {

    }

    ngOnInit(): void {
    }

    async particlesInit(engine: Engine): Promise<void> {
        await loadSlim(engine);
    }
}
