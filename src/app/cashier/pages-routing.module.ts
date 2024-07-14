import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PosComponent } from './pos/pos.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { SalesComponent } from './sales/sales.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { CashierComponent } from './cashier.component';
import { NotFoundComponent } from '../pages/miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: CashierComponent,
  children: [
    {
      path: 'sales-dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'sales',
      component: SalesComponent,
    },
    {
      path: 'invoices',
      component: InvoicesComponent,
    },
    {
      path: 'pos',
      component: PosComponent,
    },
    
    
    
    {
      path: '',
      redirectTo: 'admin-dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
