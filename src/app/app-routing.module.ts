import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { AuthGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/noAuth.guard';

export const routes: Routes = [
  {
    path: 'pages',
    canActivate:[AuthGuard],
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'cashier',
    canActivate:[AuthGuard],
    loadChildren: () => import('./cashier/cashier.module')
      .then(m => m.CashierModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        canActivate:[noAuthGuard],
        component: NbLoginComponent,
      },
      {
        path: 'register',
        canActivate:[noAuthGuard],
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        canActivate:[noAuthGuard],
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        canActivate:[noAuthGuard],
        component: NbResetPasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
