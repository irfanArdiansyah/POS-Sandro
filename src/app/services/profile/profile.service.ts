import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database/';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private db:AngularFireDatabase) { }

  update(profile: any) {
    return this.db.object('users/' + profile.key).update(profile)
  }

  updateFCMKey(fcmKey: any, key) {
    return this.db.object('users/' + key).update(fcmKey)
  }

  set(profile: any) {
    profile.barcodeType = 'user'
    return this.db.object('users/' + profile.key).set(profile)
  }

  push(data:any){
    data.barcodeType = 'user'
    return this.db.list('users/').push(data)
  }


  getbyId(userId: string): Observable<any> {
    return this.db.object('users/' + userId).valueChanges()
  }

  getLocationById(userId: string): Observable<any> {
    return this.db.object('users_location/' + userId).valueChanges()
  }

  get() {
    return this.db.list('users').snapshotChanges().pipe(
      map((changes: any) =>
        changes.map(c => ({ userKey: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  getbyRole(param){
    return this.db.list('users', ref=>ref.orderByChild('role').equalTo(param)).snapshotChanges().pipe(
      map((changes: any) =>
        changes.map(c => ({ userKey: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  remove(key: string) {
    return this.db.object(`users/${key}`).remove()
  }
}
