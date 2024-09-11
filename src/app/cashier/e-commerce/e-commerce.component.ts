import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {
  constructor(
    private profileService:ProfileService, 
    private authService:AuthService
  ){
    console.log(this.authService.getUserProfile())
    // this.profileService.getbyId()

  }
}
