import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  loggedIn = signal(false);

  constructor(private http: HttpClient) {
    this.loggedIn.set(this.hasFreshToken());
  }

  login(email: string, password: string) {
    return this.http
      .post(
        'http://localhost:8080/api/auth/login',
        {
          email: email,
          password: password,
        },
        { responseType: 'text' },
      )
      .pipe(
        tap((token) => {
          localStorage.setItem('token', token);
          this.loggedIn.set(true);
        }),
      );
  }

  register(email: string, password: string, pseudo: string) {
    return this.http.post('http://localhost:8080/api/auth/register', {
      email,
      password,
      pseudo,
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.set(false);
  }

  isLoggedIn(): boolean {
    if (!this.hasFreshToken()) {
      this.logout();
      return false;
    }
    return true;
  }

  private hasFreshToken(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return this.isTokenFresh(token);
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
