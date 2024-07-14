import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NbAuthJWTToken } from '@nebular/auth';
import { AuthService } from '../../services/auth/auth.service';
import { CountsService } from '../../services/counts/counts.service';
import { PopupNotifService } from '../../services/notifications/popup-notif.service';
import { UploadImageComponent } from '../../@theme/components/tables/upload-image/upload-image.component';
import { ShowImagesComponent } from '../../@theme/components/tables/show-images/show-images.component';
import { BtnStatusComponent } from '../../@theme/components/tables/btn-status/btn-status.component';
import { SalesService } from '../../services/sales/sales.service';
import { InvoicesService } from '../../services/invoices/invoices.service';
import { ProductService } from '../../services/product/product.service';
import { CustomInputComponent } from '../../@theme/components/tables/custom-input/custom-input.component';
import { CustomTextInputComponent } from '../../@theme/components/tables/custom-text-input/custom-text-input.component';

@Component({
  selector: 'ngx-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent {
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
    key: {
      title: 'Sale Detail Id',
      type: 'text',
      editable:false,
      addable:false,
      editor:{
        editable:false,
        addable:false
      }
    },
    receiptNumber: {
      title: 'Receipt Number',
      type: 'text',
      editor:{
        type:"list",
        config:{
          list:[
           
          ]
        }
      }
    },
    productId: {
      title: 'Product Id',
      type: 'text',
      valuePrepareFunction:null,
      editor:{
        type:"custom",
        component:CustomInputComponent,
        config:{
          changedValues:['unitPrice', 'totalPrice'],
          list:[
           
          ]
        }
      }
    },
    quantity: {
      title: 'Quantity',
      type: 'string',
      valuePrepareFunction:null,
      editor:{
        type:"custom",
        component:CustomTextInputComponent,
        config:{
          changedValues:['totalPrice'],
          logic:"quantity",
          list:[
           
          ]
        }
      }
    },
    unitPrice: {
      title: 'Unit Price',
      type: 'string',
      editable:false,
      addable:false,
      editor:{
        editable:false,
        addable:false
      }
    },
    totalPrice: {
      title: 'Total Price',
      type: 'string',
      editable:false,
      addable:false,
      editor:{
        editable:false,
        addable:false
      }
    },
    // discountAmount: {
    //   title: 'Discount Amount',
    //   type: 'number',
    //   editor:{
    //     type:'list',
    //     config:{
    //       list:[
    //         {value:'', title:""},
    //         {value:'5', title:"5"},
    //         {value:'10', title:"10"},
    //         {value:'15', title:"15"},
    //         {value:'20', title:"20"},
    //         {value:'25', title:"25"},
    //         {value:'30', title:"30"},
    //       ]
    //     }
    //   }
    // },
    // taxAmount: {
    //   title: 'Tax Amount',
    //   type: 'number',
    //   editor:{
    //     type:'list',
    //     config:{
    //       list:[
    //         {value:'', title:""},
    //         {value:'5', title:"5"},
    //         {value:'10', title:"10"},
    //         {value:'15', title:"15"},
    //         {value:'20', title:"20"},
    //         {value:'25', title:"25"},
    //         {value:'30', title:"30"},
    //       ]
    //     }
    //   }
    // },
  }

  timeout: NodeJS.Timeout;
  invoices: any = [];
  products: any = [];

  constructor(
    private _sales: SalesService,
    private auth: AuthService,
    private popup: PopupNotifService,
    private _invoices:InvoicesService,
    private _products:ProductService,
    private countServ: CountsService
  ) {
    this.subcription.push(this.getCurrentUser())
    this.subcription.push(this.getSales())
    this.subcription.push(this.getProducts())
    this.subcription.push(this.getInvoices())
  }

  getProducts(): Subscription {
    return this._products.get().subscribe(res => {
      this.products = res||[]
      const valuePrepareFunction = this.products
      const columns = {...this.columns}
      columns.productId.editor.config.list = this.products.map(x=>{return {value:x.key, title:x.productName}})
      columns.productId.valuePrepareFunction = valuePrepareFunction
      columns.quantity.valuePrepareFunction = valuePrepareFunction
      this.columns = columns
    })
  }

  getInvoices(): Subscription {
    return this._invoices.get().subscribe(res => {
      this.invoices = res||[]
      const columns = {...this.columns}
      columns.receiptNumber.editor.config.list = this.invoices.map(x=>{return {value:x.key, title:"#"+x.key.substring(x.key.length, x.key.length - 6)}})
      this.columns = columns
    })
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

  getSales(): Subscription {
    return this._sales.get().subscribe(res => {
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
    delete param.key
        let res:any = await this._sales.push(param).catch(x=>{
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
          this.subcription.push(this.getSales())
          this.calculateInvoices(param);
        }else{
          event.confirm.reject();
          this.responds = this.popup.errorData(`Terjadi kesalahan mohon coba beberapa saat lagi!`); this.loading = false; 
          this.handleRespondsTime(3000);
        }
  }

  private async calculateInvoices(param: any) {
    const totalPrice = this.data.filter(x => x.receiptNumber == param.receiptNumber).map(x => { return x.totalPrice; }).reduce((partialSum, a) => partialSum + a, 0);
    const selectedInvoice = this.invoices.filter(x => x.key == param.receiptNumber)[0];
    if (selectedInvoice) {
      const paramInvoices = {
        totalAmount: totalPrice,
        key: param.receiptNumber,
        netAmount: totalPrice + (Number(selectedInvoice.taxAmount) / 100 * 1000) - (Number(selectedInvoice.discountAmount) / 100 * 1000)
      };
      await this._invoices.update(paramInvoices);
    }
  }

  async onEdit(event) {
    this.responds = null
    const param = event.newData
    param.dateUpdated = moment().toISOString()
    param.UpdatedBy = this.userProfile?.name || this.userProfile?.email || 'System'
    await this._sales.update(param).then(res => {
      this.loading = false
      this.responds = this.popup.succesData("Berhasil Disimpan")
      this.handleRespondsTime(3000);
      event.confirm.resolve();
      this.calculateInvoices(param);
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
      await this._sales.remove(element.key)
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
