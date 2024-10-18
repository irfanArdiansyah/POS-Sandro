import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';


@Injectable({
  providedIn: 'root',
})
export class noAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private nbAuthservice:NbAuthService
  ) {}

  canActivate(): boolean {
    if (localStorage.getItem('auth_app_token')) {
      if(JSON.parse(localStorage.getItem('auth_app_token')).value==''){
        return true;
      }
      this.router.navigateByUrl('pages/admin-dashboard');
      return false;
    }

    return true;
  }
}
