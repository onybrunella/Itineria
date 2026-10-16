import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  constructor(private http: HttpClient){}
  login(email: string, password: string){
    return this.http.post('http://localhost:8080/api/auth/login',{
      email: email, password: password
    }, { responseType: 'text' }).pipe(tap(token => localStorage.setItem('token', token)));
  }

  getToken():string|null{
    return localStorage.getItem('token');
  }

  logout(){
    localStorage.removeItem('token');
  }

  isLoggedIn():boolean{
    return !!this.getToken();
  }

  
}
