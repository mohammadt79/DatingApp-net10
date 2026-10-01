import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  model = {
    username: '',
    password: '',
  };

  loggedIn = this.accountService.isLoggedIn;
  readonly username = this.accountService.currentUser;

  login() {
    this.accountService
      .login({
        username: this.model.username,
        password: this.model.password,
      })
      .subscribe({
        next: () => {
          this.model = { username: '', password: '' };
          this.toastr.success('You are now logged in.');
          this.router.navigateByUrl('/members');
        },
        error: (error) => {
          console.error('Login failed', error);
          this.toastr.error('Login failed. Check your username and password.');
        },
      });
  }

  logout() {
    this.model = { username: '', password: '' };
    this.accountService.logout().subscribe({
      next: () => {
        this.toastr.success('You have been logged out.');
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.toastr.warning('You were signed out on this device.');
        this.router.navigateByUrl('/');
      },
    });
  }

  editUser() {
    // TODO: implement edit user functionality later.
  }
}
