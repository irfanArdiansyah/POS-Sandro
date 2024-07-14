import { Component, Input } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'ngx-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss']
})
export class CustomInputComponent extends DefaultEditor {

  updateValue(event){
    this.cell.newValue = event.target.value
    let changedValues:any = this.cell.getColumn().editor.config.changedValues
    const ids = changedValues
    if(ids){
      this.cell.getRow().cells.filter((x:any)=>{
        ids.filter(id=>{
          if(x.column.id==id){
            let newPrepareFunction:any = this.cell.getColumn().valuePrepareFunction
            let data = newPrepareFunction.filter(y=>y.key == event.target.value)[0]
            if(data){
              x.newValue = data[id]
            }
            if(id == 'totalPrice')
              this.calculateTotalPrice(id, event, x);
          }
        })
       
      })
    }
  }

  private calculateTotalPrice(id: any, event: any, x) {
    if (x.column.id == id) {
      let newPrepareFunction: any = this.cell.getColumn().valuePrepareFunction;
      let productValue = this.cell.getRow().cells.filter(cell => cell.getColumn().id == 'productId')[0];
      let quantity = this.cell.getRow().cells.filter(cell => cell.getColumn().id == 'quantity')[0];
      let selectedProduct = newPrepareFunction.filter(y => y.key == productValue.newValue||productValue.getValue())[0];
      if (selectedProduct)
        x.newValue = Number(selectedProduct.unitPrice) * Number(quantity.newValue||quantity.getValue());
      else
        x.newValue = 0;
    }
  }
}
