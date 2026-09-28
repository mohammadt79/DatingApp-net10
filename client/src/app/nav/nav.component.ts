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

  readonly allLinks = ['Home', 'Discover', 'About', 'Support', 'Matches', 'Messages', 'Profile'];

  model = {
    username: '',
    password: '',
  };

  loggedIn = this.accountService.isLoggedIn;
  readonly username = this.accountService.currentUser;

  get visibleLinks(): string[] {
    return this.loggedIn() ? this.allLinks : this.allLinks.slice(0, 3);
  }

  login() {
    this.accountService
      .login({
        username: this.model.username,
        password: this.model.password,
      })
      .subscribe({
        next: () => {
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
    this.model = { username: '', password: '' };
  }

  editUser() {
    // TODO: implement edit user functionality later.
  }
}
