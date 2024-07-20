import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { CASHIER_MENU } from './cashier-menu';
import { ProfileService } from '../services/profile/profile.service';
import { NbAuthJWTToken } from '@nebular/auth';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;
  userProfile: any;
  profile: any;
  constructor(
    private router:Router,
    private _profile:ProfileService, 
    private auth:AuthService){
    this.getCurrentUser()
  }

  private getCurrentUser() {
    return this.auth.getUserProfile()
      .subscribe(async (token: NbAuthJWTToken) => {
        if (token) {
          this.userProfile = token.getPayload();
          if(this.userProfile)
            this._profile.getbyId(this.userProfile.user_id).subscribe(async res=>{
              if(res){
                this.profile = res
                if(this.profile.role == 'cashier'){
                  this.menu = CASHIER_MENU
                  if(window.location.href.includes('admin-dashboard')){
                    this.router.navigate(['pages/pos'])
                  }
                }
              }else{
                let name = this.userProfile.email.split("@")[0] || "noname"
                const param = {
                  username:name,
                  barcodeType:"user",
                  email:this.userProfile.email,
                  firstName:name, 
                  role:"cashier",
                  lastName:"",
                  status:"Active",
                  userKey:this.userProfile.user_id,
                  key:this.userProfile.user_id
                }
                await this._profile.set(param)
              }
            })
        }

      });
  }
}
