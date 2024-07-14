import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NbAlertModule, NbCardModule } from '@nebular/theme';



@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    NbAlertModule,
    NbCardModule
  ]
})
export class UsersModule { }
