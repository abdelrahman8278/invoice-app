import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fakeUser = { username: 'admin', password: '1234' };
  isLoggedIn = false;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === this.fakeUser.username && password === this.fakeUser.password) {
      this.isLoggedIn = true;
      localStorage.setItem('token', 'fake-jwt-token');
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}