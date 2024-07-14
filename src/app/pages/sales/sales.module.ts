import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales.component';
import { NbAlertModule, NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';



@NgModule({
  declarations: [
    SalesComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    NbAlertModule,
    NbCardModule,
  ]
})
export class SalesModule { }
