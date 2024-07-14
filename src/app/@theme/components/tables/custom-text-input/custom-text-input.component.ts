import { Component } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'ngx-custom-text-input',
  templateUrl: './custom-text-input.component.html',
  styleUrls: ['./custom-text-input.component.scss']
})
export class CustomTextInputComponent extends DefaultEditor {

  updateValue(event){
    this.cell.newValue = event.target.value
    let changedValues:any = this.cell.getColumn().editor.config.changedValues
    let logic = this.cell.getColumn().editor.config.logic
    const ids = changedValues
    if(ids){
      if(logic == 'quantity'){
        this.calculateTotalPrice(ids, event);
      }
    }
  }


  private calculateTotalPrice(ids: any, event: any) {
    this.cell.getRow().cells.filter((x: any) => {
      ids.filter(id => {
        if (x.column.id == id) {
          let newPrepareFunction: any = this.cell.getColumn().valuePrepareFunction;
          let productValue = this.cell.getRow().cells.filter(cell => cell.getColumn().id == 'productId')[0];
          let selectedProduct = newPrepareFunction.filter(y => y.key == productValue.newValue||productValue.getValue())[0];
          if (selectedProduct)
            x.newValue = Number(selectedProduct.unitPrice) * Number(event.target.value);
          else
            x.newValue = 0;
        }
      });
    });
  }
}
