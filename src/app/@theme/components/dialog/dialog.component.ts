import { Component, Inject, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  @Input() title: string;
  @Input() message;
  @Input() isDblBtn;
  @Input() icon;
  @Input() custom;
  @Input() status;
  



  constructor(protected ref: NbDialogRef<DialogComponent>) {}

  dismiss() {
    this.ref.close();
  }

  success(type) {
    if(type){
      return this.ref.close({res:true, type:type});
    }
    this.ref.close(true);
  }

}
