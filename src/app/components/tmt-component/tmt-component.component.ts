import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';

type TMTCircle = {
    id: number | string,
    left: string,
    top: string,
    wrong: boolean,
    position: { x: number, y: number }
}


@Component({
    selector: 'app-tmt-component',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './tmt-component.component.html',
    styleUrl: './tmt-component.component.scss'
})
export class TmtComponentComponent implements AfterViewInit {
    placedPositions: Array<any> = [];
    items: Array<TMTCircle> = [];
    selectedItems: Array<TMTCircle> = [];
    @ViewChild('parentBox') parent!: ElementRef;
    @ViewChild('TMTACanvas') tmtCanvas!: ElementRef;
    @Input() tmtType: 'A' | 'B' = 'A';
    @Output() testCompleted: EventEmitter<any> = new EventEmitter();
    ctx: any;
    constructor(
        private audioService: AudioService
    ) {

    }

    ngAfterViewInit(): void {
        this.ctx = this.tmtCanvas.nativeElement.getContext('2d');
        this.initializeTMTA();
    }


    initializeTMTA(): void {
        const numDivs = 25;
        this.tmtCanvas.nativeElement.width = this.parent.nativeElement.offsetWidth;
        this.tmtCanvas.nativeElement.height = this.parent.nativeElement.offsetHeight;

        for (let i = 0; i < numDivs; i++) {

            // Random position
            let randomX, randomY;
            do {
                randomX = Math.floor(Math.random() * (this.parent.nativeElement.offsetWidth - 50));
                randomY = Math.floor(Math.random() * (this.parent.nativeElement.offsetHeight - 50));
            } while (this.checkOverlap(randomX, randomY));

            // Alternate between numbers and letters for TMT B
            let label;
            if (this.tmtType == 'B') {
                const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                label = ( ((i+1)%2) == 0 ) ? alphabet[((i+1) / 2) - 1] : ((i/2)+1);
            }
            else {
                label = i + 1;
            }

            this.items.push({
                id: label,
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
        let lineSegments: any = [];

        const animate = () => {
            const start = this.selectedItems[this.selectedItems.length - 2].position;
            const end = this.selectedItems[this.selectedItems.length - 1].position;
            lineSegments.push({ start: start, end: end, progress: 0 });

            // Draw lines
            this.ctx.strokeStyle = '#081225'; // Set line color
            this.ctx.lineWidth = 1; // Set line thickness
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

    selectItem(item: TMTCircle, index: number) {
        // Check if item has already been selected
        if (this.itemIsSelected(item.id)) return;
        // Check if the right number/letter was selected
        if (!this.itemIsCorrectChoice(index)) {
            this.audioService.playWrongChoiceSound();
            this.items = this.items.map((i: TMTCircle) => ({ ...i, wrong: i.id == item.id }));
            setTimeout(() => {
                this.items = this.items.map((i: TMTCircle) => ({ ...i, wrong: false }));
            }, 500);
            return;
        }

        // Push the item into the selected items array
        this.selectedItems.push(item);
        this.audioService.playCorrectChoiceSound();

        if (index >= 1 && this.selectedItems.length > 1) {
            this.animateLine();
        }

        if (this.assessmentCompleted()) {
            this.testCompleted.emit();
            this.audioService.playSuccessSound();
        }
    }

    itemIsSelected(value: number | string): TMTCircle | undefined {
        return this.selectedItems.find((item: TMTCircle) => item.id == value);
    }

    itemIsCorrectChoice(index: number) {
        return index == this.selectedItems.length;
    }

    assessmentCompleted(): boolean {
        return this.selectedItems.length == this.items.length;
    }
}
