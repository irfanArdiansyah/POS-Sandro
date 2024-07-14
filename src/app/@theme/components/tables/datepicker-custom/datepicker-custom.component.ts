import { Component } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'ngx-datepicker-custom',
  templateUrl: './datepicker-custom.component.html',
  styleUrls: ['./datepicker-custom.component.scss']
})
export class DatepickerCustomComponent extends DefaultEditor {
  constructor(){
    super();
  }

  updateValue(event){
    this.cell.newValue = event.target.value
  }
}
