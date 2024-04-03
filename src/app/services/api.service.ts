import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,

  ) { }


  getRandomWords(numOfWords: number, lengthOfWords: number) {
    return this.http.get(`https://random-word.ryanrk.com/api/en/word/random/${numOfWords}?length=${lengthOfWords}`);
  }
}
