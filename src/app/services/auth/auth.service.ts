import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { PopupNotifService } from '../notifications/popup-notif.service';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  secondaryApp;
  secondaryAuth;

  constructor(
    public afAuth: AngularFireAuth, 
    private authService: NbAuthService,
    private popup: PopupNotifService) {
    this.afAuth.authState.subscribe((user: any) => {
      if (user == null)
        return
      localStorage.setItem('uid', user.uid)
      localStorage.setItem('email', user.email)
    })
  }

  getUserProfile() {
    // let dt: any = localStorage.getItem('eFormUserData')
    // let user: any = JSON.parse(dt)
    // if (user == null) return
    // let userData: any;
    // userData = user
    // return userData
    return this.authService.onTokenChange()
  }

  isLoggedIn() {
    let user = localStorage.getItem('uid')
    if (user == null)
      return false
    return true
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
  }

  addUser(profile: any) {
    this.secondaryApp = initializeApp(environment.firebase)
    this.secondaryAuth = getAuth(this.secondaryApp)
    return createUserWithEmailAndPassword(this.secondaryAuth, profile.email, profile.password)
  }

  remove(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(async (info) => {
        var user = await this.afAuth.currentUser;
        user.delete()
      });
  }

  recover(param) {
    return this.afAuth.sendPasswordResetEmail(param.email)
      .then(data => {
        this.popup.infoData("Password reset email sent")
      })
      .catch(err => {
        this.popup.errorData(err.message || "Something went wrong, please try again later")
      });
  }

  validateEmail() {
    this.afAuth.currentUser.then(res => {
      res.sendEmailVerification()
      this.popup.infoData("An email verification has been sent to your email, please check your email inbox or spam folders.")
    })
  }

  logout() {
    localStorage.clear()
    return this.afAuth.signOut();
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  sortByDate(value, sortValue) {
    if (value)
      value.sort((a, b) => {
        let x = moment(new Date(a[sortValue]));
        let y = moment(new Date(b[sortValue]));
        let c: any = x.valueOf();
        let d: any = y.valueOf();
        return d - c;
      });
    return value
  }

}
