import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output } from '@angular/core';
import '@google/model-viewer';
import { Router, RouterModule } from '@angular/router';
import { AudioService } from 'src/app/services/audio.service';

@Component({
    selector: 'app-object-recognition',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
    ],
    templateUrl: './object-recognition.component.html',
    styleUrl: './object-recognition.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ObjectRecognitionComponent {
    step: number = 1;
    gameStep: 'loading' | 'display' | 'input' | 'end' = 'loading';
    // 
    selectedShapeCombo: any;
    selectedShapeIndex: number = 0;
    totalShapes: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    questionShapes: Array<{ shape: number, selectedAnswer: 'yes' | 'no' | undefined, correctAnswer: 'yes' | 'no' | undefined }> = [];
    @Input() difficultyLevel: number = 1;
    @Output() trainingComplete: EventEmitter<any> = new EventEmitter();
    constructor(
        private audioService: AudioService,
        private router: Router
    ) { }


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
            this.selectedShapeCombo = shapeCombos[2];
            this.gameStep = 'display';
        }, 3000);
    }

    getRandomShapes() {
        let shapes = this.totalShapes.filter((item: number) => !this.selectedShapeCombo.shapes.includes(item));
        // Get correct shapes Id and put in questionShapes
        let wrongShapes = this.selectRandomElements(shapes, this.selectedShapeCombo.shapes.length)
        let selectedShapes = [...this.selectedShapeCombo.shapes, ...wrongShapes];
        // Randomize the array
        selectedShapes = this.shuffleArray(selectedShapes);
        this.questionShapes = selectedShapes.map((item: number) => ({ shape: item, selectedAnswer: undefined, correctAnswer: undefined }))
    }

    selectRandomElements(array: Array<number>, count: number): Array<number> {
        if (count > array.length) return [];
        let selectedElements = [];
        let copyArray = array.slice();
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * copyArray.length);
            selectedElements.push(copyArray.splice(randomIndex, 1)[0]);
        }
        return selectedElements;
    }

    shuffleArray(array: Array<number>) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    goToQuestions() {
        this.selectedShapeIndex = 0;
        this.getRandomShapes();
        this.gameStep = 'input';
    }

    selectAnswer(answer: 'yes' | 'no', index: number) {
        // Check if shape is included
        let realAnswer: any = this.selectedShapeCombo.shapes.includes(this.questionShapes[index].shape) ? 'yes' : 'no';
        // Give audio feedback based on answer
        if (realAnswer == answer) {
            this.audioService.playCorrectChoiceSound();
        }
        else {
            this.audioService.playWrongChoiceSound();
        }

        //  Give visual feedback
        this.questionShapes[index].selectedAnswer = answer;
        this.questionShapes[index].correctAnswer = realAnswer;


        // Go to next shape question
        setTimeout(() => {
            if ((this.selectedShapeIndex + 1) < this.questionShapes.length) {
                this.selectedShapeIndex += 1;
            }
            else {
                this.selectedShapeIndex = -1
                this.gameStep = 'end';
            }
        }, 1000);
    }

    get totalCorrectAswers(): number {
        return this.questionShapes.filter((item: any) => item.selectedAnswer == item.correctAnswer).length;
    }

    endTraining() {
        let score: number = (this.totalCorrectAswers / this.questionShapes.length) * 100; // Return in percentage
        // Save time to database
        this.trainingComplete.emit({
            score: score,
            difficulty: this.difficultyLevel
        })
        setTimeout(() => {
            this.router.navigateByUrl("/dashboard");
        }, 2000);
    }
}

export const shapeCombos: Array<any> = [
    {
        modelUrl: "assets/3d-models/table-shapes-1.glb",
        shapes: [1, 2, 3, 4, 11, 12, 13, 14]
    },
    {
        modelUrl: "assets/3d-models/table-shapes-2.glb",
        shapes: [5, 6, 7, 8, 15, 16, 17, 18]
    },
    {
        modelUrl: "assets/3d-models/table-shapes-3.glb",
        shapes: [6, 7, 8, 9, 10, 16, 17, 18, 19, 20]
    }
]
