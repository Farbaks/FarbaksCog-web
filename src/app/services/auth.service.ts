import { Injectable } from '@angular/core';
import { Signup, Signin } from '../models/auth';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(public apiService: ApiService) { }

    signup(data: Signup) {
        return this.apiService.post(`users`, data);
    }

    login(data: Signin) {
        return this.apiService.post(`users/login`, data);
    }

    me() {
        return this.apiService.get(`users/me`);
    }
}
