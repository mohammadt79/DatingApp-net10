import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  readonly loggedIn = this.accountService.isLoggedIn;
  readonly username = this.accountService.currentUser;
  readonly hasLoggedInBefore = this.accountService.hasLoggedInBefore;
  showMore = false;

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  toggleLearnMore() {
    this.showMore = !this.showMore;
  }
}
