import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../@core/data/solar';
import { SalesService } from '../../services/sales/sales.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product/product.service';
import { InvoicesService } from '../../services/invoices/invoices.service';
import { ProfileService } from '../../services/profile/profile.service';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
  total: string;
  totalType:string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  private alive = true;

  solarValue: number;
  totalProduct: CardSettings = {
    title: 'Total Product',
    iconClass: 'nb-e-commerce',
    type: 'primary',
    total: "100000",
    totalType:"text"
  };
  totalSale: CardSettings = {
    title: 'Total Sales',
    iconClass: 'nb-compose',
    type: 'success',
    total: "100000",
    totalType:"text"
  };
  totalSaleAmount: CardSettings = {
    title: 'Total Sale Amount',
    iconClass: 'nb-arrow-thin-up',
    type: 'success',
    total: "100000",
    totalType:"number"
  };
  totalInvoice: CardSettings = {
    title: 'Total Invoice',
    iconClass: 'nb-compose',
    type: 'warning',
    total: "100000",
    totalType:"text"
  };

  totalCashier: CardSettings = {
    title: 'Cashier',
    iconClass: 'nb-person',
    type: 'primary',
    total: "0",
    totalType:"text"
  };
  totalStock: CardSettings = {
    title: 'Total Stock',
    iconClass: 'nb-e-commerce',
    type: 'primary',
    total: "0",
    totalType:"text"
  };
  totalInvoiceAmount: CardSettings = {
    title: 'Total Invoice Amount',
    iconClass: 'nb-bar-chart',
    type: 'warning',
    total: "0",
    totalType:"number"
  };
  totalInvoiceNetAmount: CardSettings = {
    title: 'Total Invoice Net Amount',
    iconClass: 'nb-bar-chart',
    type: 'warning',
    total: "0",
    totalType:"number"
  };

  statusCards: string;
  statusCards2: string;

  salesOverviewCards: CardSettings[] = [
    this.totalProduct,
    this.totalStock,
    this.totalSale,
    this.totalInvoice,
  ];

  usersOverviewCards: CardSettings[] = [
    this.totalCashier,
    this.totalSaleAmount,
    this.totalInvoiceAmount,
    this.totalInvoiceNetAmount,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
      default: this.salesOverviewCards,
      cosmic: this.salesOverviewCards,
      corporate: [
        {
          ...this.totalProduct,
          type: 'warning',
        },
        {
          ...this.totalSale,
          type: 'primary',
        },
        {
          ...this.totalSaleAmount,
          type: 'danger',
        },
        {
          ...this.totalInvoice,
          type: 'info',
        },
      ],
      dark: this.salesOverviewCards,
    };

  statusCardsByThemes2: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
      default: this.usersOverviewCards,
      cosmic: this.usersOverviewCards,
      corporate: [
        {
          ...this.totalCashier,
          type: 'warning',
        },
        {
          ...this.totalStock,
          type: 'primary',
        },
        {
          ...this.totalInvoiceAmount,
          type: 'danger',
        },
        {
          ...this.totalInvoiceNetAmount,
          type: 'info',
        },
      ],
      dark: this.usersOverviewCards,
    };

    subscription:Subscription[] = []
  products: any;
  invoices: any;

  constructor(private themeService: NbThemeService,
    private solarService: SolarData,
    private salesService: SalesService,
    private productService:ProductService,
    private invoiceService:InvoicesService,
    private userService:ProfileService,
  ) {
    this.subscription.push(this.getSales())
    this.subscription.push(this.getProduct())
    this.subscription.push(this.getInvoice())
    this.subscription.push(this.getCashier())
    // this.subscription.push(this.getSupplier())
    // this.subscription.push(this.getCustomer())
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
        this.statusCards2 = this.statusCardsByThemes2[theme.name]
      });

     
      
  }

  getCashier(): Subscription {
    return this.userService.getbyRole('cashier').subscribe(res=>{
      const total = res.length || 0
      this.totalCashier.total = total
    })
  }

  getSupplier(): Subscription {
    return this.userService.getbyRole('supplier').subscribe(res=>{
      const total = res.length || 0
      this.totalStock.total = total
    })
  }
  
  getCustomer(): Subscription {
    return this.userService.getbyRole('customer').subscribe(res=>{
      const total = res.length || 0
      this.totalInvoiceAmount.total = total
    })
  }
  
  

  getInvoice(): Subscription {
    return this.invoiceService.get().subscribe(res=>{
      const totalInvoiceAmount = res.map(x => x.totalAmount).reduce((a, b) => (a ? parseInt(a) : 0) + (b ? parseInt(b) : 0), 0);
      const totalInvoiceNetAmount = res.map(x => x.netAmount).reduce((a, b) => (a ? parseInt(a) : 0) + (b ? parseInt(b) : 0), 0);
      const total = res.length||0
      this.totalInvoice.total = total
      this.totalInvoiceAmount.total = totalInvoiceAmount
      this.totalInvoiceNetAmount.total = totalInvoiceNetAmount
      this.invoices = res
    })
  }
  
  getProduct(): Subscription {
    return this.productService.get().subscribe(res => {
      const total = res.length||0
      this.totalProduct.total = total;
      this.products = res
      this.totalStock.total = res.map(x => x.unitInStock).reduce((a, b) => (a ? parseInt(a) : 0) + (b ? parseInt(b) : 0), 0);
    });
  }

  private getSales() {
    return this.salesService.get().subscribe(res => {
      const totalSalesAmount = res.map(x => x.totalPrice).reduce((a, b) => (a ? parseInt(a) : 0) + (b ? parseInt(b) : 0), 0);
      const totalSales = res.length ||0;
      this.totalSale.total = totalSales;
      this.totalSaleAmount.total = totalSalesAmount
    });
  }

  ngOnDestroy() {
    this.subscription.forEach(x=> x.unsubscribe())
    this.alive = false;
  }
}
