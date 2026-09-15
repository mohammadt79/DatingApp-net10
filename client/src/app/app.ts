import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'mohammad';
  apiResponse: any;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get('http://localhost:5001/api/users').subscribe({
      next: (response) => {
        this.apiResponse = response;
      },
      error: (error) => {
        console.error('Failed to load data', error);
      },
      complete: () => {
        console.log('Request complete');
      }
    });
  }
}
