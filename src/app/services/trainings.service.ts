import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NewAssessment, NewTraining } from '../models/trainings';

@Injectable({
    providedIn: 'root'
})
export class TrainingsService {

    constructor(public apiService: ApiService) { }

    getReport() {
        return this.apiService.get(`assessments/report`);
    }

    canPlayTrainings(trainingType: 'words-recall' | 'numbers-recall' | 'object-recognition' | 'assessment') {
        return this.apiService.get(`assessments/can-play?trainingType=${trainingType}`);
    }

    addAssessment(data: NewAssessment) {
        return this.apiService.post(`assessments`, data);
    }

    addTraining(data: NewTraining) {
        return this.apiService.post(`assessments/training`, data);
    }

    getDifficultyLevel(trainingType: 'words-recall' | 'numbers-recall' | 'object-recognition') {
        return this.apiService.get(`assessments/training/difficulty?trainingType=${trainingType}`);
    }
}
