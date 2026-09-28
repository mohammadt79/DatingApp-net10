import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  model = {
    username: '',
    password: '',
  };

  isSubmitting = false;

  constructor(
    private readonly accountService: AccountService,
    private readonly router: Router,
  ) {}

  register() {
    if (!this.model.username || !this.model.password) {
      alert('Username and password are required.');
      return;
    }

    this.isSubmitting = true;

    this.accountService
      .register({
        username: this.model.username,
        password: this.model.password,
      })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.model = { username: '', password: '' };
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.error('Register failed', error);
          alert('Registration failed. Please try another username.');
        },
      });
  }
}
