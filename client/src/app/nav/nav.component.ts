import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  private readonly accountService = inject(AccountService);

  model = {
    username: '',
    password: '',
  };

  loggedIn = this.accountService.isLoggedIn;
  username = localStorage.getItem('username') ?? '';

  login() {
    this.accountService
      .login({
        username: this.model.username,
        password: this.model.password,
      })
      .subscribe({
        next: (response) => {
          this.username = response.userName;
          this.model = { username: '', password: '' };
        },
        error: (error) => {
          console.error('Login failed', error);
          alert('Username or password is invalid.');
        },
      });
  }

  logout() {
    this.accountService.logout();
    this.username = '';
    this.model = { username: '', password: '' };
  }
}
