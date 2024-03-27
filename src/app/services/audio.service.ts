import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AudioService {
    private clickSound!: HTMLAudioElement;
    constructor() { }

    playCorrectChoiceSound():void {
        this.clickSound = new Audio();
        this.clickSound.src = 'assets/audio/correct-choice-1.mp3'
        this.clickSound.play();
    }

    playWrongChoiceSound():void {
        this.clickSound = new Audio();
        this.clickSound.src = 'assets/audio/wrong-choice-1.mp3'
        this.clickSound.play();
    }

    playSuccessSound():void {
        this.clickSound = new Audio();
        this.clickSound.src = 'assets/audio/success-1.mp3'
        this.clickSound.play();
    }
}
