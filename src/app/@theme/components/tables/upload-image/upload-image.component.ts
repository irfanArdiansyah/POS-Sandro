import { Component, Input } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { AuthService } from '../../../../services/auth/auth.service';
import * as moment from "moment";
import { AttachmentService } from '../../../../services/attachment/attachment.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'ngx-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent extends DefaultEditor  {
  isUpload: boolean;
  uploadPercent: any;

  constructor(
    private auth:AuthService, 
    private attachmentServ:AttachmentService,
    private actRoute: ActivatedRoute,
  ){
    super();
  }

  updateValue(event){
    this.inputFile(event.target.files)
  }

  async inputFile(files) {
    if (files) {
      for (let x of files) {
        this.isUpload = true
        let lf = await this.auth.toBase64(x);
        const exst = x.name.split(".");
        let fl = lf
        let uniqueId = moment().valueOf()
        let res = this.attachmentServ.uploadFileWithoutUserId(x, uniqueId, this.cell.getTitle())
        this.uploadPercent = res.task.percentageChanges();
        res.task.snapshotChanges().pipe(
          finalize(() => {
            this.isUpload = false
            res.fileRef.getDownloadURL().subscribe(url => {
              this.cell.newValue = {
                name: exst[0],
                extension: exst[exst.length - 1],
                mime: x.type,
                url: url,
                uniqueId: uniqueId
              }
            })
          })
        )
          .subscribe()

      }
    }
  }
  
}
