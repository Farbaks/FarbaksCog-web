import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';

type TMTCircle = {
    id: number,
    left: string,
    top: string,
    wrong: boolean,
    position: { x: number, y: number }
}

@Component({
    selector: 'app-tmt-assessment',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './tmt-assessment.component.html',
    styleUrl: './tmt-assessment.component.scss'
})
export class TmtAssessmentComponent {
    step: number = 1;
    placedPositions: Array<any> = [];
    items: Array<TMTCircle> = [];
    selectedItems: Array<TMTCircle> = [];
    startTime: any;
    timerInterval: any;
    elapsedTime: string = '0 s';
    @ViewChild('parentBox') parent!: ElementRef;
    @ViewChild('TMTACanvas') tmtCanvas!: ElementRef;
    ctx: any;
    constructor(
        private audioService: AudioService
    ) {

    }

    goToNextStep(): void {
        this.step += 1;
    }

    goToPreviousStep(): void {
        this.step -= 1;
    }

    loadTMTA() {
        this.step = 3;
        setTimeout(() => {
            this.ctx = this.tmtCanvas.nativeElement.getContext('2d');
            this.initializeTMTA();
            this.startTimer();
        }, 100);
    }

    initializeTMTA(): void {
        const numDivs = 25;
        const circleSize: number = 40;
        this.tmtCanvas.nativeElement.width = this.parent.nativeElement.offsetWidth;
        this.tmtCanvas.nativeElement.height = this.parent.nativeElement.offsetHeight;

        for (let i = 0; i < numDivs; i++) {

            // Random position
            let randomX, randomY;
            do {
                randomX = Math.floor(Math.random() * (this.parent.nativeElement.offsetWidth - 50));
                randomY = Math.floor(Math.random() * (this.parent.nativeElement.offsetHeight - 50));
            } while (this.checkOverlap(randomX, randomY));

            this.items.push({
                id: i + 1,
                top: (randomY) + 'px',
                left: (randomX) + 'px',
                wrong: false,
                position: { x: randomX, y: randomY }
            })

            this.placedPositions.push({ x: randomX, y: randomY });
        }
    }

    checkOverlap(x: number, y: number): boolean {
        for (const pos of this.placedPositions) {
            if (Math.abs(x - pos.x) < 50 && Math.abs(y - pos.y) < 50) {
                return true;
            }
        }
        return false;
    }

    animateLine(): void {
        const items = this.selectedItems;
        let lineSegments: any = [];

        const animate = () => {
            const start = this.selectedItems[this.selectedItems.length - 2].position;
            const end = this.selectedItems[this.selectedItems.length - 1].position;
            lineSegments.push({ start: start, end: end, progress: 0 });

            // Draw lines
            this.ctx.strokeStyle = '#081225'; // Set line color
            this.ctx.lineWidth = 2; // Set line thickness
            for (const segment of lineSegments) {
                const startX = segment.start.x + 20;
                const startY = segment.start.y + 20;
                const endX = segment.start.x + (segment.end.x - segment.start.x) * segment.progress + 20;
                const endY = segment.start.y + (segment.end.y - segment.start.y) * segment.progress + 20;
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY); // Start point
                this.ctx.lineTo(endX, endY); // End point
                this.ctx.stroke();
            }

            // Update progress for next frame
            for (const segment of lineSegments) {
                if (segment.progress >= 1) return;
                segment.progress += .05; // Adjust speed here
                if (segment.progress > 1) {
                    segment.progress = 1;
                }
            }
            if (lineSegments.find(((item: any) => item.progress < 1))) {
                requestAnimationFrame(animate);
            }
        }

        animate();
    }

    selectItem(item: TMTCircle) {
        // Check if item has already been selected
        if (this.itemIsSelected(item.id)) return;
        // Check if the right number/letter was selected
        if (!this.itemIsCorrectChoice(item.id)) {
            this.audioService.playWrongChoiceSound();
            this.items = this.items.map((i: TMTCircle) => ({ ...i, wrong: i.id == item.id }));
            setTimeout(() => {
                this.items = this.items.map((i: TMTCircle) => ({ ...i, wrong: false }));
            }, 500);
            return;
        }

        // Push the item into the selected items array
        this.selectedItems.push(item);
        if (this.assessmentCompleted()) {
            this.stopTimer();
            this.audioService.playSuccessSound();
        }
        else {
            this.audioService.playCorrectChoiceSound();
        }

        if (item.id > 1 && this.selectedItems.length > 1) {
            this.animateLine();
        }
    }

    itemIsSelected(value: number): TMTCircle | undefined {
        return this.selectedItems.find((item: TMTCircle) => item.id == value);
    }

    itemIsCorrectChoice(value: number) {
        if (this.selectedItems.length == 0) {
            return value == this.items[0].id;
        }
        return this.selectedItems[this.selectedItems.length - 1].id + 1 == value;
    }

    startTimer(): void {
        this.startTime = performance.now();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 100);
    }

    stopTimer(): void {
        clearInterval(this.timerInterval);
    }

    updateTimer(): void {
        const currentTime = performance.now();
        this.elapsedTime = ((currentTime - this.startTime) / 1000).toFixed(2) + ' s';
    }

    assessmentCompleted(): boolean {
        return this.selectedItems.length == this.items.length;
    }
}
