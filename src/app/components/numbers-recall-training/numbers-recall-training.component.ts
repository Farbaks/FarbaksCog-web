import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import random from 'random'
import { AudioService } from 'src/app/services/audio.service';
@Component({
    selector: 'app-numbers-recall-training',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    templateUrl: './numbers-recall-training.component.html',
    styleUrl: './numbers-recall-training.component.scss'
})
export class NumbersRecallTrainingComponent {
    step: number = 1;
    numberOfRounds: number = 10;
    currentRound: number = 1;
    numberDisplayTimer: number = 1.5;
    gameStep: 'loading' | 'display' | 'input' | 'end' = 'loading';
    displayedNumber: number = 0;
    enteredNumber: number | string = '';
    correctAnswers: Array<{
        round: number,
        entered: number | string,
        displayed: number
    }> = [];
    @Input() difficultyLevel: number = 4;
    @Output() trainingComplete: EventEmitter<any> = new EventEmitter();
    constructor(
        private router: Router,
        private apiService: ApiService,
        private audioService: AudioService
    ) {
    }

    goToNextStep(): void {
        this.step += 1;
    }

    goToPreviousStep(): void {
        this.step -= 1;
    }

    initializeGame() {
        this.goToNextStep();
        this.startGame();
    }

    startGame() {
        this.gameStep = 'loading';
        setTimeout(() => {
            this.gameStep = 'display';
            this.startRound();
        }, 3000);
    }

    async startRound(): Promise<void> {
        // Reset answers
        this.enteredNumber = '';
        // Generate the number
        await this.generateNumber();
        // Display the generated number
        this.displayNumber();
    }

    async generateNumber(): Promise<void> {
        this.displayedNumber = random.int(Math.pow(10, this.difficultyLevel), Math.pow(10, this.difficultyLevel + 1));
    }

    displayNumber() {
        const interval = setInterval(() => {
            this.gameStep = 'input';
            clearInterval(interval)

        }, this.numberDisplayTimer * 1000)
    }

    submitRoundAnswers() {
        // Store answers
        this.correctAnswers.push({
            round: this.currentRound,
            entered: this.enteredNumber,
            displayed: this.displayedNumber
        });

        // Show results
        this.gameStep = 'end';
    }

    get correctRounds(): number {
        return this.correctAnswers.filter((item: any) => item.entered == item.displayed).length;
    }

    goToNextRound() {
        if (this.currentRound < this.numberOfRounds) {
            this.currentRound += 1;
            this.numberDisplayTimer += .5; //Increase by hald a second every round
            // Only increase level when answer is correct
            if (this.correctAnswers[this.correctAnswers.length - 1].displayed == this.correctAnswers[this.correctAnswers.length - 1].entered) {
                this.difficultyLevel += 1;
            }
            // 
            this.startGame();
        }
        else {
            this.audioService.playSuccessSound();
            //  Get score
            let score: number = (this.correctRounds / this.numberOfRounds) * 100; // Return in percentage
            // Save time to database
            this.trainingComplete.emit({
                score: score,
                difficulty: this.difficultyLevel
            })

            // Redirect to home page
            setTimeout(() => {
                this.router.navigateByUrl("/dashboard");
            }, 2000);
        }
    }

}
