import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NewAssessment, NewTraining } from 'src/app/models/trainings';
import { ApiService } from 'src/app/services/api.service';
import { AudioService } from 'src/app/services/audio.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-words-recall-training',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    templateUrl: './words-recall-training.component.html',
    styleUrl: './words-recall-training.component.scss'
})
export class WordsRecallTrainingComponent {
    step: number = 1;
    numberOfRounds: number = 3;
    currentRound: number = 1;
    wordDisplayTimer: number = 1.5;
    gameStep: 'loading' | 'display' | 'input' | 'end' = 'loading';
    selectedWordIndex: number = 1;
    words: Array<string> = [];
    answers: Array<{
        text: string
    }> = [{ text: '' }];
    correctAnswers: Array<{
        round: number,
        answers: Array<string>,
        wrong: Array<string>
    }> = [];
    @Input() difficultyLevel: number | 'default' = 'default';
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
        this.answers = [{ text: '' }]
        // Generate the words
        await this.generateWords();
        // Display the generated words
        this.displayWords();
    }

    calculateWordParameters(difficultyLevel: number | 'default'): { numWords: number, minLength: number } {
        const baseNumWords = 4;
        const baseMinLength = 3;
        let numWords = baseNumWords;
        let minLength = baseMinLength;
        if (typeof (difficultyLevel) == 'number') {
            // numWords = Math.ceil(baseNumWords + (difficultyLevel * 0.5)); // Increase by 0.5 per difficulty level
            minLength = Math.ceil(baseMinLength + (difficultyLevel * 0.5)); // Increase by 0.5 per difficulty level
        }

        return { numWords, minLength };
    }

    async generateWords(): Promise<void> {
        let config = this.calculateWordParameters(this.difficultyLevel == 'default' ? 1 : this.difficultyLevel);
        let response: any = await firstValueFrom(this.apiService.getRandomWords(config.numWords, config.minLength));
        this.words = response.map((item: string) => item.toLowerCase());
    }

    displayWords() {
        this.selectedWordIndex = 0;
        const interval = setInterval(() => {
            if (this.selectedWordIndex < this.words.length) {
                this.selectedWordIndex += 1;
            }
            else {
                // Show input to enter words
                this.gameStep = 'input';

                // Stop displaying words
                this.selectedWordIndex = -1;
                clearInterval(interval)
            }
        }, this.wordDisplayTimer * 1000)
    }

    addAnswerField() {
        this.answers.push({
            text: ''
        })
    }

    removeAnswerField(index: number) {
        this.answers.splice(index, 1);
    }

    submitRoundAnswers() {

        // Remove empty fields
        this.answers = this.answers.filter((item: { text: string }) => item.text != '');
        // Check how many words were spelt correctly
        let rightWords: Array<string> = [];
        let wrongWords: Array<string> = [];
        this.answers.forEach((item: { text: string }) => {
            this.words.includes(item.text.toLowerCase()) ?
                rightWords.push(item.text.toLowerCase()) :
                wrongWords.push(item.text.toLowerCase());
        })
        // Store answers
        this.correctAnswers.push({
            round: this.currentRound,
            answers: rightWords,
            wrong: wrongWords
        });
        // Show results
        this.gameStep = 'end';
    }

    goToNextRound() {
        if (this.currentRound < this.numberOfRounds) {
            this.currentRound += 1;
            this.startGame();
        }
        else {
            this.audioService.playSuccessSound();
            //  Get score
            let score: number = (this.correctAnswers[this.correctAnswers.length - 1].answers.length / this.words.length) * 100; // Return in percentage
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
