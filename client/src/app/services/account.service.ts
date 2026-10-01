import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoginRequest, UserDto } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly baseUrl = 'http://localhost:5001/api';

  readonly isLoggedIn = signal<boolean>(this.hasToken());
  readonly currentUser = signal<string>(this.getCurrentUser());
  readonly hasLoggedInBefore = signal<boolean>(this.getHasLoggedInBefore(this.getCurrentUser()));

  constructor(private http: HttpClient) {}

  login(model: LoginRequest) {
    return this.http.post<UserDto>(`${this.baseUrl}/account/login`, model).pipe(
      tap((response) => {
        const username = response.userName;
        const wasReturningUser = this.getHasLoggedInBefore(username);

        localStorage.setItem('token', response.token);
        localStorage.setItem('username', username);

        if (!wasReturningUser) {
          localStorage.setItem(`hasLoggedInBefore${username}`, 'true');
        }

        this.currentUser.set(username);
        this.hasLoggedInBefore.set(wasReturningUser);
        this.isLoggedIn.set(true);
      }),
    );
  }

  register(model: LoginRequest) {
    return this.http.post<UserDto>(`${this.baseUrl}/account/register`, model).pipe(
      tap((response) => {
        const username = response.userName;
        const wasReturningUser = this.getHasLoggedInBefore(username);

        localStorage.setItem('token', response.token);
        localStorage.setItem('username', username);

        if (!wasReturningUser) {
          localStorage.setItem(`hasLoggedInBefore${username}`, 'true');
        }

        this.currentUser.set(username);
        this.hasLoggedInBefore.set(wasReturningUser);
        this.isLoggedIn.set(true);
      }),
    );
  }

  logout() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.clearAuthState();
      return;
    }

    this.http
      .post<void>(`${this.baseUrl}/account/logout`, {}, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(tap(() => this.clearAuthState()))
      .subscribe({
        error: () => this.clearAuthState(),
      });
  }

  private clearAuthState() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.currentUser.set('');
    this.isLoggedIn.set(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getCurrentUser(): string {
    return localStorage.getItem('username') ?? '';
  }

  private getHasLoggedInBefore(username: string): boolean {
    if (!username) {
      return false;
    }

    return localStorage.getItem(`hasLoggedInBefore${username}`) === 'true';
  }
}
