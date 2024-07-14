import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashierComponent } from './cashier.component';
import { PosModule } from './pos/pos.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { NbMenuModule } from '@nebular/theme';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { InvoicesModule } from './invoices/invoices.module';
import { SalesModule } from './sales/sales.module';



@NgModule({
  declarations: [
    CashierComponent,
   
  ],
  imports: [
    CommonModule,
    PosModule,
    PagesRoutingModule,
    ThemeModule,
    ECommerceModule,
    SalesModule,
    InvoicesModule,
    NbMenuModule
  ]
})
export class CashierModule { }
