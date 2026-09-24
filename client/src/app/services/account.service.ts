import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserDto {
  userName: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly baseUrl = 'http://localhost:5001/api';
  readonly isLoggedIn = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(model: LoginRequest) {
    return this.http.post<UserDto>(`${this.baseUrl}/account/login`, model).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.userName);
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
      .pipe(
        tap(() => this.clearAuthState()),
      )
      .subscribe({
        error: () => this.clearAuthState(),
      });
  }

  private clearAuthState() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.isLoggedIn.set(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
