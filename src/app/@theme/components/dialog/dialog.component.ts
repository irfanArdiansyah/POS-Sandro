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
  



  constructor(protected ref: NbDialogRef<DialogComponent>) {}

  dismiss() {
    this.ref.close();
  }

  success() {
    this.ref.close(true);
  }

}
