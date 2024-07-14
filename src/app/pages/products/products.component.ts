import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NbAuthJWTToken } from '@nebular/auth';
import { AuthService } from '../../services/auth/auth.service';
import { CountsService } from '../../services/counts/counts.service';
import { PopupNotifService } from '../../services/notifications/popup-notif.service';
import { ProductService } from '../../services/product/product.service';
import { UploadImageComponent } from '../../@theme/components/tables/upload-image/upload-image.component';
import { ShowImagesComponent } from '../../@theme/components/tables/show-images/show-images.component';
import { BtnStatusComponent } from '../../@theme/components/tables/btn-status/btn-status.component';

@Component({
  selector: 'ngx-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  loading: boolean = false;
  totalUser: number;
  totalAdmin: number;
  totalCashier: number;
  router: any;
  userProfile: any;
  responds;
  subcription: Subscription[] = []
  data: any;
  columns = {
    productImage: {
      title: 'Product Img',
      type: 'custom',
      renderComponent:ShowImagesComponent,
      editor: {
        type: 'custom',
        component: UploadImageComponent,
      }
    },
    productName: {
      title: 'Product Name',
      type: 'string',
    },
    productDescription: {
      title: 'Description',
      type: 'textarea',
    },
    quantityPerUnit: {
      title: 'Qty Per Unit',
      type: 'string',
    },
    unitPrice: {
      title: 'Price',
      type: 'number',
      editor:{
        type:'number'
      }
    },
    unitInStock: {
      title: 'Stock',
      type: 'number',
      editor:{
        type:'number'
      }
    },
    taxRate: {
      title: 'Tax Rate',
      type: 'number',
      editor:{
        type:'number'
      }
    },
    discount: {
      title: 'Discount',
      type: 'number',
      editor:{
        type:'number'
      }
    },
    status: {
      title: 'Status',
      type: 'custom',
      editable:false,
      addable:false,
      renderComponent:BtnStatusComponent,
    },
  }
  timeout: NodeJS.Timeout;

  constructor(
    private _products: ProductService,
    private auth: AuthService,
    private popup: PopupNotifService,
    private countServ: CountsService
  ) {
    this.subcription.push(this.getCurrentUser())
    this.subcription.push(this.getProducts())
  }



  private getCurrentUser() {
    return this.auth.getUserProfile()
      .subscribe((token: NbAuthJWTToken) => {
        if (token) {
          this.userProfile = token.getPayload();
        }

      });
  }

  ngOnDestroy(): void {
    this.subcription.forEach(x => x.unsubscribe())
  }

  getProducts(): Subscription {
    return this._products.get().subscribe(res => {
      if (res) {
        this.data = res
      }
      this.loading = false;
    })
  }

  async onCreate(event) {
    this.responds = null
    const param = event.newData
    param.dateUpdated = moment().toISOString()
    param.UpdatedBy = this.userProfile?.name || this.userProfile?.email || 'System'
    param.status = 'Active'
        let res:any = await this._products.push(param).catch(x=>{
          event.confirm.reject();
          return  this.responds = this.popup.errorData(`Terjadi kesalahan mohon coba beberapa saat lagi!`); this.loading = false; 
        })

        if(res){
          this.loading = false
          // let param2: any = { totalUser: this.totalUser + 1 }
          // this.countServ.update(param2)
          this.responds = this.popup.succesData("Product berhasil ditambahkan!", 4000)
          this.handleRespondsTime(3000);
          event.confirm.resolve();
          this.subcription.push(this.getProducts())
        }else{
          event.confirm.reject();
          this.responds = this.popup.errorData(`Terjadi kesalahan mohon coba beberapa saat lagi!`); this.loading = false; 
          this.handleRespondsTime(3000);
        }
  }

  async onEdit(event) {
    this.responds = null
    const param = event.newData
    param.dateUpdated = moment().toISOString()
    param.UpdatedBy = this.userProfile?.name || this.userProfile?.email || 'System'
    await this._products.update(param).then(res => {
      this.loading = false
      this.responds = this.popup.succesData("Berhasil Disimpan")
      this.handleRespondsTime(3000);
      event.confirm.resolve();
    }).catch(err => { 
      this.responds = this.popup.errorData(err.message || "Terjadi kesalahan mohon mencoba sesaat lagi."); this.loading = false 
      this.handleRespondsTime(3000);
      event.confirm.reject();
    })
  }

  async onDelete(event) {
    this.responds = null
    let element = event.data
    if (element) {
      this.loading = true
      await this._products.remove(element.key)
        .then(res => {
          // let param: any = { totalUser: this.totalUser - 1 }
          // this.countsServ.update(param)
          this.loading = false
          this.responds = this.popup.succesData("Berhasil menghapus Product")
          this.handleRespondsTime(3000);
        })
        .catch(err => {
          this.loading = false
          this.handleRespondsTime(5000);
          this.responds = this.popup.errorData("Gagal menghapus, Mohon coba lagi nanti!")
        })
    }
  }

  private handleRespondsTime(timer) {
    if (this.timeout)
      clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.responds = null;
    }, timer);
  }
}
