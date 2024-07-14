import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(private storage: AngularFireStorage) { }

  downloadExcel(data, name = "Excel") {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${name}.xlsx`);
  }

  uploadFile(event, userId, uniqueId, folder) {
    const file = event;
    const filePath = `${folder}/${userId}/${uniqueId}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    return { task, fileRef }
  }

  uploadFileWithoutUserId(event, uniqueId, folder) {
    const file = event;
    const filePath = `${folder}/${uniqueId}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    return { task, fileRef }
  }

  getFile(param) {
    const ref = this.storage.ref(param);
    return ref.getDownloadURL()
  }

  deleteFile(uniqueId, folder, file) {
    const filePath = `${folder}/${uniqueId}/${file.name}.${file.extension}`;
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.delete()
    return task
  }

  deleteFileWithId(uniqueId, userId, folder, file) {
    const filePath = `${folder}/${userId}/${uniqueId}/${file.name}.${file.extension}`;
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.delete()
    return task
  }

  deleteAllFile(folder, userId) {
    const filePath = `${folder}/${userId}`;
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.delete()
    return task
  }


}
