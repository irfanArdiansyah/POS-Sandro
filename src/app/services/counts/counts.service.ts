import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountsService {

  constructor(private db: AngularFireDatabase) { }

  getTotalForm(type: string) {
    return this.db.object(`counts/forms/total`).valueChanges()
  }

  async updateTotalForm(type: string='', updateType = +1) {
    let res: any = await new Promise((resolve, reject) => {
      this.db.object(`counts/forms/total`).valueChanges().subscribe(
        (resp: any) => { resolve(resp) },
        (err: any) => { reject(err.error.message) }
      )
    });
    let param = { total: res + updateType }
    return this.db.object(`counts/forms`).update(param)
  }

  async updateTotalUsers(updateType = +1) {
    let res: any = await new Promise((resolve, reject) => {
      this.db.object(`counts/users/total`).valueChanges().subscribe(
        (resp: any) => { resolve(resp) },
        (err: any) => { reject(err.error.message) }
      )
    });
    let param = { total: res + updateType }
    return this.db.object(`counts/users`).set(param)
  }

  update(param: any) {
    return this.db.object('countTbl').update(param)
  }

  set(param: any) {
    return this.db.object('countTbl').set(param)
  }

  push(param: any) {
    return this.db.list('countTbl').push(param)
  }

  getbyId(dataId: string): Observable<any> {
    return this.db.object('countTbl/'+dataId).valueChanges()
  }

  get() {
    return this.db.object('countTbl').valueChanges()
  }


}
