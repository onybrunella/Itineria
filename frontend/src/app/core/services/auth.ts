import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  constructor(private http: HttpClient){}
  login(email: string, password: string){
    return this.http.post('http://localhost:8080/api/auth/login',{
      email: email, password: password
    }, { responseType: 'text' });
  }
}
