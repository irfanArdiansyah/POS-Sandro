import { Component, OnDestroy } from '@angular/core';
import { NbAuthJWTToken } from '@nebular/auth';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { CountsService } from '../../services/counts/counts.service';
import { InvoicesService } from '../../services/invoices/invoices.service';
import { PopupNotifService } from '../../services/notifications/popup-notif.service';
import { ProductService } from '../../services/product/product.service';
import { SalesService } from '../../services/sales/sales.service';
import * as moment from 'moment';
import { ProfileService } from '../../services/profile/profile.service';
import { ExcelService } from '../../services/excel/excel.service';

@Component({
  selector: 'ngx-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnDestroy {

  userProfile: any;
  responds;
  subcription: Subscription[] = []
  loading: boolean;
  sales: any;
  invoices: any;
  products: any;
  data;
  timeout: NodeJS.Timeout;
  completedInvoicesRef: any;
  completedInvoices: any;
  sale: any;

  constructor(
    private _sales: SalesService,
    private auth: AuthService,
    private popup: PopupNotifService,
    private _invoices: InvoicesService,
    private _products: ProductService,
    private _profile:ProfileService,
    private countServ: CountsService,
    public excelServ:ExcelService
  ) {
    this.subcription.push(this.getCurrentUser())
    this.subcription.push(this.getSales())
    this.subcription.push(this.getProducts())
    this.subcription.push(this.getInvoices())
  }

  ngOnDestroy(): void {
    this.subcription.forEach(x => x.unsubscribe())
  }

  refresh(){
    this.subcription.forEach(x => x.unsubscribe())
    this.subcription.push(this.getCurrentUser())
    this.subcription.push(this.getSales())
    this.subcription.push(this.getProducts())
    this.subcription.push(this.getInvoices())
    this.completedInvoicesRef = null
  }

  private getCurrentUser() {
    return this.auth.getUserProfile()
      .subscribe((token: NbAuthJWTToken) => {
        if (token) {
          this.userProfile = token.getPayload();
          this._profile.getbyId(this.userProfile.user_id).subscribe((res) => {
            if (res) {
              this.data = {
                saleDate: moment().format("MMM DD, YYYY, hh:mm a"),
                cashierId: this.userProfile.user_id,
                cashierName: res.firstName,
                totalAmount: '',
                paymentMethod: 'Cash',
                taxAmount: '0',
                discountAmount: '0',
                netAmount: '',
                status: '',
              };
            }
          })
        }

      });
  }

  getProducts(): Subscription {
    return this._products.get().subscribe(res => {
      this.products = res || []
      // const valuePrepareFunction = this.products
      // const columns = {...this.columns}
      // columns.productId.editor.config.list = this.products.map(x=>{return {value:x.key, title:x.productName}})
      // columns.productId.valuePrepareFunction = valuePrepareFunction
      // columns.quantity.valuePrepareFunction = valuePrepareFunction
      // this.columns = columns
    })
  }

  getInvoices(): Subscription {
    return this._invoices.get().subscribe(res => {
      this.invoices = res || []
      // const columns = {...this.columns}
      // columns.receiptNumber.editor.config.list = this.invoices.map(x=>{return {value:x.key, title:"#"+x.key.substring(x.key.length, x.key.length - 6)}})
      // this.columns = columns
    })
  }

  getSales(): Subscription {
    return this._sales.get().subscribe(res => {
      if (res) {
        this.sales = res
      }
      this.loading = false;
    })
  }

  async onCompleted(type) {
    switch (type) {
      case "Payment":
        const selectedProduct = this.products.filter(x => x.selected)
        const invoices = this.data
        if(invoices.totalAmount == 0){
          return this.popup.errorData("Please select product before continue.", 'popup')
        }
        invoices.status = 'Completed'
        let res: any = await this._invoices.push(invoices).catch(x => {
          return this.responds = this.popup.errorData(`Terjadi kesalahan mohon coba beberapa saat lagi!`); this.loading = false;
        })
        if (res) {
          this.loading = false
          // let param2: any = { totalUser: this.totalUser + 1 }
          // this.countServ.update(param2)
          this.completedInvoicesRef = res
          this.responds = this.popup.succesData("Data berhasil ditambahkan!", 4000)
          this.handleRespondsTime(3000);
        } else {
          this.responds = this.popup.errorData(`Terjadi kesalahan mohon coba beberapa saat lagi!`); this.loading = false;
          this.handleRespondsTime(3000);
        }
        
        let dialogRef = this.popup.showCustomPopup("Payment Completed", 'Do you want to Print Receipt for the Completed Order?', 'checkmark-circle-outline', 'pos', 'success')
        dialogRef.onClose.subscribe(res => {
          if(res?.res){
            if(res.type == 'print'){
              this.subcription.push(this.getInvoice())
              this.subcription.push(this.getSaleByInvoice())
              this.excelServ.exportToPDF("Invoice_#"+this.completedInvoicesRef.key.substr(this.completedInvoicesRef.key.length-5))
              selectedProduct.forEach(async product => {
                await this.createSales(this.completedInvoicesRef.key, product)
              });
              // this.refresh()
            }else{
              this.refresh()
            }
          }
        })

        break;
      case "Hold":

        break;
      case "Delete":
        this.refresh()
        break;

      default:
        break;
    }
  }

  getInvoice() {
    return this._invoices.getbyId(this.completedInvoicesRef.key).subscribe(res => {
      this.completedInvoices = res
    })
  }

  getSaleByInvoice(){
    return this._sales.getbyIdInvoices(this.completedInvoicesRef.key).subscribe(res => {
      this.sale = res
    })
  }

  async createSales(receiptNumber, product) {
    const param = {
      receiptNumber: receiptNumber,
      status: 'Active',
      productId:product.key,
      quantity:product.quantity,
      unitPrice:product.unitPrice,
      productName:product.productName,
      totalPrice:Number(product.unitPrice) * Number(product.quantity),
    }
    let res: any = await this._sales.push(param).catch(x => {
      return this.responds = this.popup.errorData(`Terjadi kesalahan mohon coba beberapa saat lagi!`); this.loading = false;
    })

    if (res) {
      this.loading = false
      // let param2: any = { totalUser: this.totalUser + 1 }
      // this.countServ.update(param2)
      this.subcription.push(this.getSales())
      const newStock = Number(product.unitInStock) - Number(product.quantity)
      await this._products.update({key:param.productId, unitInStock:newStock})
    } else {
      this.responds = this.popup.errorData(`Terjadi kesalahan mohon coba beberapa saat lagi!`); this.loading = false;
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
