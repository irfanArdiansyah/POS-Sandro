import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { ExcelService } from '../../../../services/excel/excel.service';
@Component({
  selector: 'ngx-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
  @Input() data;
  @Input() products;
  @Output() result = new EventEmitter<any>();

  constructor(public excelServ:ExcelService){

  }


  getProduct() {
    if (this.products?.length > 0) {
      let filtered = this.products.filter(x => x.selected)
      return filtered
    }
    return []
  }

  increaseQty(item) {
    if (!item.quantity)
      item.quantity = 0
    item.quantity = Number(item.quantity || 0) + 1
  }

  decreaseQty(item) {
    if (item.quantity == 0) return
    if (!item.quantity)
      item.quantity = 0
    item.quantity = Number(item.quantity || 0) - 1
  }

  getSubTotalWithoutTax() {
    if (this.products?.length > 0) {
      let filtered = this.products.filter(x => x.selected && x.quantity > 0).map(x => { return Number(x.unitPrice) * Number(x.quantity) }).reduce((partialSum, a) => partialSum + a, 0);
      this.data.totalAmount = filtered
      return filtered
    }
    return 0
  }



  getDiscount() {
    return (this.getSubTotalWithoutTax() * (this.data.discountAmount / 100))
  }

  getTax() {
    return (this.getSubTotalWithoutTax() * (this.data.taxAmount / 100))
  }

  getSubTotalWithTax() {
    return this.getSubTotalWithoutTax() + (this.getSubTotalWithoutTax() * (this.data.taxAmount / 100))
  }

  getSubTotalWithDiscount() {
    return this.getSubTotalWithTax() - (this.getSubTotalWithTax() * (this.data.discountAmount / 100))
  }

  getGrandTotal() {
    return this.data.netAmount = this.getSubTotalWithoutTax() + this.getTax() - this.getDiscount()
  }

  // onCompleted(type) {
  //   switch (type) {
  //     case "Payment":
  //       const param = {
  //         type: 'Payment',
  //         saleDate: moment().toISOString(),
  //         cashierId: this.userProfile.user_id,
  //         totalAmount: '',
  //         paymentMethod: '',
  //         taxAmount: '5',
  //         discountAmount: '5',
  //         netAmount: '',
  //         status: '',
  //       }
  //       this.result.emit('')
  //       break;
  //     case "Hold":

  //       break;
  //     case "Delete":

  //       break;

  //     default:
  //       break;
  //   }

  // }

  async onTestPdf(){
    await this.excelServ.exportToPDF('POS_PDF_test')
  }

}
