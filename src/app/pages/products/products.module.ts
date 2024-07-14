import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { NbAlertModule, NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';



@NgModule({
  declarations: [
    ProductsComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    NbAlertModule,
    NbCardModule,
  ]
})
export class ProductsModule { }
