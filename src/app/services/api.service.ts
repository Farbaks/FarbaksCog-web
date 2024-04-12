import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    url!: string;
    env = environment;
    constructor(public http: HttpClient) {
        this.url = this.env.apiUrl;
    }

    get(endpoint: string, params?: any, reqOpts?: any) {
        if (!reqOpts) {
            reqOpts = {
                params: new HttpParams()
            };
        }
        // Support easy query params for GET requests
        if (params) {
            reqOpts.params = new HttpParams();
            for (const k in params) {
                reqOpts.params = reqOpts.params.set(k, params[k]);
            }
        }

        return this.http.get(this.url + endpoint, reqOpts);
    }

    post(endpoint: string, body: any, reqOpts?: any) {
        return this.http.post(this.url + endpoint, body, reqOpts);
    }

    put(endpoint: string, body: any, reqOpts?: any) {
        return this.http.put(this.url + endpoint, body, reqOpts);
    }


    getRandomWords(numOfWords: number, lengthOfWords: number) {
        return this.http.get(`https://random-word.ryanrk.com/api/en/word/random/${numOfWords}?length=${lengthOfWords}`);
    }
}
