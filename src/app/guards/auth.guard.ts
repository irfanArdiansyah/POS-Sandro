import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { NbAuthService } from '@nebular/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private nbAuthservice:NbAuthService
  ) {}

  canActivate(): boolean {
    if (!localStorage.getItem('auth_app_token')) {
      this.router.navigateByUrl('/auth/login');

      return false;
    }

    return true;
  }
}
