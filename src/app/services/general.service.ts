import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) { }

    async refreshUser() {
        try {
            let res: any = await (this.authService.me()).toPromise();
            this.saveUser(res);
        }
        catch (e) { }
    }


    saveUser(user: any) {
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    getUser() {
        let res: any = sessionStorage.getItem('user') ?? undefined;

        if (!res || res == '') {
            return undefined
        }

        return (JSON.parse(res));
    }

    getToken() {
        let res: any = sessionStorage.getItem('user') ?? undefined;

        if (!res || res == '') {
            return ''
        }

        return (JSON.parse(res)).apiToken;
    }

    logoutUser() {
        sessionStorage.clear();
        window.location.replace('/');
    }
}
