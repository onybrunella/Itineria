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

  register(email: string, password: string, pseudo: string) {
    return this.http.post('http://localhost:8080/api/auth/register', {
      email, password, pseudo
    });
  }

  getToken():string|null{
    return localStorage.getItem('token');
  }

  logout(){
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    if (!this.isTokenFresh(token)) {
      this.logout();
      return false;
    }
    return true;
  }

  private isTokenFresh(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  
}
