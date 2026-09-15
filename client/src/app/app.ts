import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'mohammad';
  apiResponse: any;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<any>('https://jsonplaceholder.typicode.com/todos/1').subscribe({
      next: (response) => {
        this.apiResponse = response;
        this.title = response.title ?? this.title;
      },
      error: (error) => {
        console.error('Failed to load data', error);
      }
    });
  }
}
