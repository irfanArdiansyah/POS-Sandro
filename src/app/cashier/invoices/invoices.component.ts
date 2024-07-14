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
import { InvoicesService } from '../../services/invoices/invoices.service';
import { DatepickerCustomComponent } from '../../@theme/components/tables/datepicker-custom/datepicker-custom.component';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'ngx-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent {
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
      title: 'Receipt Number',
      type: 'number',
      editable:false,
      addable:false,
      editor:{
        editable:false,
        addable:false
      }
    },
    saleDate: {
      title: 'Sale Date',
      type: 'string',
      editor:{
        type:'custom',
        component:DatepickerCustomComponent
      }
    },
    cashierId: {
      title: 'Cashier Id',
      type: 'string',
      editor:{
        type:"list",
        config:{
          list:[]
        }
      }
    },
    totalAmount: {
      title: 'Total Amount',
      type: 'string',
      editable:false,
      addable:false,
      editor:{
        editable:false,
        addable:false
      }
    },
    paymentMethod: {
      title: 'Payment Method',
      type: 'string',
      editor:{
        type:"list",
        config:{
          list:[
            {value:'Cash', title:"Cash"},
            {value:'Debit Card', title:"Debit Card"},
            {value:'Scan', title:"Scan"},
          ]
        }
      }
    },
    taxAmount: {
      title: 'Tax Amount',
      type: 'number',
      editor:{
        type:'list',
        config:{
          list:[
            {value:'', title:""},
            {value:'5', title:"5"},
            {value:'10', title:"10"},
            {value:'15', title:"15"},
            {value:'20', title:"20"},
            {value:'25', title:"25"},
            {value:'30', title:"30"},
          ]
        }
      }
    },
    discountAmount: {
      title: 'Discount Amount',
      type: 'number',
      editor:{
        type:'list',
        config:{
          list:[
            {value:'', title:""},
            {value:'5', title:"5"},
            {value:'10', title:"10"},
            {value:'15', title:"15"},
            {value:'20', title:"20"},
            {value:'25', title:"25"},
            {value:'30', title:"30"},
          ]
        }
      }
    },
    netAmount: {
      title: 'Net Amount',
      type: 'number',
      editable:false,
      addable:false,
      editor:{
        editable:false,
        addable:false,
        type:'number'
      }
    },
    status: {
      title: 'Status',
      type: 'custom',
      renderComponent:BtnStatusComponent,
      editor:{
        type:'list',
        config:{
          list:[
            {value:'Pending', title:"Pending"},
            {value:'Refunded', title:"Refunded"},
            {value:'Completed', title:"Completed"},
          ]
        }
      }
    },
  }
  timeout: NodeJS.Timeout;
  cashiers: any;

  constructor(
    private _invoices: InvoicesService,
    private auth: AuthService,
    private popup: PopupNotifService,
    private _profile:ProfileService,
    private countServ: CountsService
  ) {
    this.subcription.push(this.getCurrentUser())
    this.subcription.push(this.getInvoices())
    this.subcription.push(this.getCashier())
  }


  getCashier(): Subscription {
     return this._profile.getbyRole('cashier').subscribe(res => {
      this.cashiers = res
      const columns = {...this.columns}
      columns.cashierId.editor.config.list = this.cashiers.map(x=> {return {value:x.userKey, title:x.firstName}})
      this.columns = columns
     }, error => {

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

  getInvoices(): Subscription {
    return this._invoices.get().subscribe(res => {
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
    delete param.key
    let res:any = await this._invoices.push(param).catch(x=>{
      event.confirm.reject();
      return  this.responds = this.popup.errorData(`Terjadi kesalahan mohon coba beberapa saat lagi!`); this.loading = false; 
    })
    if(res){
      this.loading = false
      // let param2: any = { totalUser: this.totalUser + 1 }
      // this.countServ.update(param2)
      this.responds = this.popup.succesData("Data berhasil ditambahkan!", 4000)
      this.handleRespondsTime(3000);
      event.confirm.resolve();
      this.subcription.push(this.getInvoices())
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
    await this._invoices.update(param).then(res => {
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
      await this._invoices.remove(element.key)
        .then(res => {
          // let param: any = { totalUser: this.totalUser - 1 }
          // this.countsServ.update(param)
          this.loading = false
          this.responds = this.popup.succesData("Berhasil menghapus Data")
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
