import { Component, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { AuthService } from '../../services/auth/auth.service';
import { PopupNotifService } from '../../services/notifications/popup-notif.service';
import { CountsService } from '../../services/counts/counts.service';
import { signOut } from 'firebase/auth';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NbAuthJWTToken } from '@nebular/auth';
import { BtnStatusComponent } from '../../@theme/components/tables/btn-status/btn-status.component';

@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnDestroy {
  loading: boolean = false;
  totalUser: number;
  totalAdmin: number;
  totalCashier: number;
  router: any;
  userProfile: any;
  responds;
  subcription: Subscription[] = []
  data: any;
  columns = {
    firstName: {
      title: 'First Name',
      type: 'string',
    },
    lastName: {
      title: 'Last Name',
      type: 'string',
    },
    username: {
      title: 'Username',
      type: 'string',
    },
    email: {
      title: 'E-mail',
      type: 'string',
    },
    age: {
      title: 'Age',
      type: 'number',
    },
    role:{
      title: 'Role',
      type: 'number',
      editor:{
        type:'list',
        config:{
          list:[
            {value:'cashier', title:'Cashier'},
            {value:'admin', title:'Admin'},
            {value:'supplier', title:'Supplier'},
            {value:'customer', title:'Customer'}
          ]
        }
      }
    },
    status:{
      title: 'Status',
      type: 'custom',
      renderComponent:BtnStatusComponent
    }
  }

  constructor(
    private _profile: ProfileService,
    private auth: AuthService,
    private popup: PopupNotifService,
    private countServ: CountsService
  ) {
    this.subcription.push(this.getCurrentUser())
    this.subcription.push(this.getUsers())
  }



  private getCurrentUser() {
    return this.auth.getUserProfile()
      .subscribe((token: NbAuthJWTToken) => {
        if (token) {
          this.userProfile = token.getPayload();
        }

      });
  }

  ngOnDestroy(): void {
    this.subcription.forEach(x => x.unsubscribe())
  }

  getUsers(): Subscription {
    return this._profile.get().subscribe(res => {
      if (res) {
        this.data = res
      }
      this.loading = false;
    })
  }

  async onCreate(event) {
    this.responds = null
    const param = event.newData
    param.password = 12345678
    await this.auth.addUser(param)
      .then(async (userCredential) => {
        const user = userCredential.user;
        param.key = user.uid
        delete param.password
        await this._profile.set(param)
        this.loading = false
        let param2: any = { totalUser: this.totalUser + 1 }
        if (!param.level) {
          param.level = "cashier"
        }
        switch (param.level) {
          case 'admin':
            param2.totalAdmin = this.totalAdmin + 1
            break;
          case 'cashier':
            param2.totalCashier = this.totalCashier + 1
            break;

          default:
            break;
        }
        // this.countServ.update(param2)
        this.responds = this.popup.succesData("User berhasil ditambahkan!, Password awal 12345678", 4000)
        signOut(this.auth.secondaryAuth)
        event.confirm.resolve();
        this.subcription.push(this.getUsers())
      }).catch(err => { 
        event.confirm.reject();
        this.responds = this.popup.errorData(`Terjadi kesalahan mohon coba beberapa saat lagi!`); this.loading = false; 
      })

  }

  async onEdit(event) {
    this.responds = null
    const param = event.newData
    param.dateUpdated = moment().toISOString()
    param.UpdatedBy = this.userProfile?.name || this.userProfile?.email || 'System'
    await this._profile.update(param).then(res => {
      this.loading = false
      this.responds = this.popup.succesData("Berhasil Disimpan")
      event.confirm.resolve();
    }).catch(err => { 
      this.responds = this.popup.errorData(err.message || "Terjadi kesalahan mohon mencoba sesaat lagi."); this.loading = false 
      event.confirm.reject();
    })
  }

  async onDelete(event) {
    this.responds = null
    let element = event.data
    if (element) {
      this.loading = true
      this.auth.remove(element.email, (element.password || 12345678))
      await this._profile.remove(element.key)
        .then(res => {
          let param: any = { totalUser: this.totalUser - 1 }
          switch (element.level) {
            case 'admin':
              param.totalAdmin = this.totalAdmin + 1
              break;
            case 'cashier':
              param.totalCashier = this.totalCashier + 1
              break;
            default:
              break;
          }
          // this.countsServ.update(param)
          this.loading = false
          this.responds = this.popup.succesData("Berhasil menghapus user")
        })
        .catch(err => {
          this.loading = false
          this.responds = this.popup.errorData("Gagal menghapus, Mohon coba lagi nanti!")
        })
    }
  }



}
