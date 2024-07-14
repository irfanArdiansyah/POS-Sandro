import { NbMenuItem } from '@nebular/theme';

export const CASHIER_MENU: NbMenuItem[] = [
  {
    title: 'Sales Dashboard',
    icon: 'shopping-cart-outline',
    link: '/pages/sales-dashboard',
  },
  {
    title: 'Sales',
    group: true,
  },
  {
    title: 'Sales',
    icon: 'shopping-cart-outline',
    link: '/pages/sales',
  },
  {
    title: 'Invoices',
    icon: 'file-text-outline',
    link: '/pages/invoices',
  },
  {
    title: 'POS',
    icon: 'monitor-outline',
    link: '/pages/pos',
  },
];
