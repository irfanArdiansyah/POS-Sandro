import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbCardModule,
  NbInputModule,
  NbTreeGridModule,
  NbAlertModule,
  NbDatepickerModule,
  NbListModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';

import {
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  TinyMCEComponent,
  TreeGridComponent,
  SmartTableComponent
} from './components';
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { RouterModule } from '@angular/router';
import { DialogComponent } from './components/dialog/dialog.component';
import { UploadImageComponent } from './components/tables/upload-image/upload-image.component';
import { ShowImagesComponent } from './components/tables/show-images/show-images.component';
import { BtnStatusComponent } from './components/tables/btn-status/btn-status.component';
import { DatepickerComponent } from './components/tables/datepicker/datepicker.component';
import { DatepickerCustomComponent } from './components/tables/datepicker-custom/datepicker-custom.component';
import { CustomInputComponent } from './components/tables/custom-input/custom-input.component';
import { CustomTextInputComponent } from './components/tables/custom-text-input/custom-text-input.component';
import { FormsModule } from '@angular/forms';
import { TopActionComponent } from './components/pos/top-action/top-action.component';
import { ProductsComponent } from './components/pos/products/products.component';
import { OrderListComponent } from './components/pos/order-list/order-list.component';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbCardModule,
  NbTreeGridModule,
  NbInputModule,
  Ng2SmartTableModule,
  RouterModule,
  NbAlertModule,
  NbDatepickerModule,
  NbListModule
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  TreeGridComponent,
  SmartTableComponent,
  DialogComponent,
  UploadImageComponent, 
  ShowImagesComponent, 
  BtnStatusComponent, 
  DatepickerComponent,
  DatepickerCustomComponent,
  CustomInputComponent, 
  CustomTextInputComponent, 
  TopActionComponent, 
  ProductsComponent, 
  OrderListComponent 

];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

@NgModule({
  imports: [CommonModule, FormsModule, ...NB_MODULES],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME ],
        ).providers,
      ],
    };
  }
}
