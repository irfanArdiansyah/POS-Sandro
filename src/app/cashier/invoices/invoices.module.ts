import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { NbAlertModule, NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';



@NgModule({
  declarations: [
    InvoicesComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    NbAlertModule,
    NbCardModule,
  ]
})
export class InvoicesModule { }
