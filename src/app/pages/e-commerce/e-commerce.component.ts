import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ProfileService } from '../../services/profile/profile.service';
import { Subscription } from 'rxjs';
import { NbAuthJWTToken } from '@nebular/auth';
import { InvoicesService } from '../../services/invoices/invoices.service';
import { ProductService } from '../../services/product/product.service';
import { SalesService } from '../../services/sales/sales.service';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent implements OnDestroy {

  subcription: Subscription[] = []
  userProfile
  user: { name: any; picture: string; };
  firstName
  totalSales: any = 0;
  totalSalesAmount: any;
  products: any =[];
  constructor(
    private profileService:ProfileService, 
    private authService:AuthService,
    private salesService: SalesService,
    private productService:ProductService,
    private invoiceService:InvoicesService,
  ){
    this.subcription.push(this.getCurrentUser())
    this.subcription.push(this.getProfileById())
    this.subcription.push(this.getProduct())
    this.subcription.push(this.getInvoice())
    this.subcription.push(this.getSales())
    

  }

  private getProfileById() {
    return this.profileService.getbyId(this.userProfile.user_id).subscribe(res => {
      this.firstName = res.firstName
    });
  }

  ngOnDestroy(): void {
     this.subcription.forEach(x => x.unsubscribe())
  }

  private getCurrentUser() {
    return this.authService.getUserProfile()
      .subscribe((token: NbAuthJWTToken) => {
        if (token) {
          this.userProfile = token.getPayload();
          this.user= {name:this.userProfile?.name || this.userProfile?.email || 'No Name', picture:''}
        }

      });
  }

  getInvoice(): Subscription {
    return this.invoiceService.get().subscribe(res=>{
      const totalInvoiceAmount = res.map(x => x.netAmount).reduce((a, b) => (a ? parseInt(a) : 0) + (b ? parseInt(b) : 0), 0);
      const total = res.length||0
      // this.expanseCard.total = total
      // this.expanseCard2.total = totalInvoiceAmount
      // this.invoices = res
    })
  }
  
  getProduct(): Subscription {
    return this.productService.get().subscribe(res => {
      const total = res.length||0
      // this.briefcaseCard.total = total;
      this.products = res
    });
  }

  private getSales() {
    return this.salesService.get().subscribe(res => {
      const totalSalesAmount = res.map(x => x.totalPrice).reduce((a, b) => (a ? parseInt(a) : 0) + (b ? parseInt(b) : 0), 0);
      const totalSales = res.length ||0;
      this.totalSales = totalSales;
      this.totalSalesAmount = totalSalesAmount
    });
  }
}
