import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosComponent } from './pos.component';
import { NbAlertModule, NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';



@NgModule({
  declarations: [
    PosComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    NbAlertModule,
    NbCardModule,
  ]
})
export class PosModule { }
