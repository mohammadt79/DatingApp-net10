import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { InputOutputChildComponent } from './input-output-child/input-output-child.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InputOutputChildComponent],
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
  readonly parentName = 'Parent Component';
  receivedMessage = 'هنوز پیامی از چایلد دریافت نشده است.';

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  toggleLearnMore() {
    this.showMore = !this.showMore;
  }

  handleChildMessage(message: string) {
    this.receivedMessage = message;
  }
}
