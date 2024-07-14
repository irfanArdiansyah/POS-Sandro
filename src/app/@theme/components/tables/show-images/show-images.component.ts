import { Component, Input } from '@angular/core';
import { AttachmentService } from '../../../../services/attachment/attachment.service';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'ngx-show-images',
  templateUrl: './show-images.component.html',
  styleUrls: ['./show-images.component.scss']
})
export class ShowImagesComponent {
  @Input() value: any;
  @Input() rowData: any;
  ngOnInit(): void {
  }

  constructor(
    private attachmentServ:AttachmentService
  ){
  }

  async openImage(file) {
    if (!file) return
    let a: any = document.createElement('A');
    a.target = "_blank";
    a.href = file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  
}
