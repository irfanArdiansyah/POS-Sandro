import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = 'products/'
  constructor(private db:AngularFireDatabase) { }

  get() {
    return this.db.list(this.url).snapshotChanges().pipe(
      map((changes: any) =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  getbyId(Id: string): Observable<any> {
    return this.db.object(this.url + Id).valueChanges()
  }

  push(data:any){
    data.barcodeType = 'product'
    return this.db.list(this.url).push(data)
  }

  set(item: any) {
    item.barcodeType = 'product'
    return this.db.object(this.url).set(item)
  }

  update(item: any) {
    return this.db.object(this.url + item.key).update(item)
  }

  remove(key: string) {
    return this.db.object(this.url+`${key}`).remove()
  }
}
