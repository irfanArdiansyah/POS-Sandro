import { Component } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'ngx-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent extends DefaultEditor {
  
  constructor(){
    super();
  }

  updateValue(event){
    // this.cell.newValue = event.target.value
  }
}
