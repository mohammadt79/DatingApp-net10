import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const currentUser=inject(AccountService)
  const toaster=inject(ToastrService)
  if(currentUser.isLoggedIn()){
  return true;
  } else{
    toaster.error('اجازه ورود ندارید','خطا')
    return false
  }
};
