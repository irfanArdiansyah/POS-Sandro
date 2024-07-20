import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-display-input',
  templateUrl: './display-input.component.html',
  styleUrls: ['./display-input.component.scss']
})
export class DisplayInputComponent {
  @Input() value: any;
  @Input() rowData: any;


  getValue(){
    return this.value.substr(this.value.length-5)
  }
}
