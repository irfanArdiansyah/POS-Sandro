import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-btn-status',
  templateUrl: './btn-status.component.html',
  styleUrls: ['./btn-status.component.scss']
})
export class BtnStatusComponent {
  @Input() value: any;
  @Input() rowData: any;

}
