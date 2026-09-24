import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';

interface AppUser {
  id: number;
  userName: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  title = 'mohammad';
  users = signal<AppUser[]>([]);

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<AppUser[]>('http://localhost:5001/api/users').subscribe({
      next: (response) => {
        this.users.set(response);
      },
      error: (error) => {
        console.error('Failed to load data', error);
      },
      complete: () => {
        console.log('Request complete');
      },
    });
  }
}
