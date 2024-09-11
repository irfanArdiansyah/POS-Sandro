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
  briefcaseCard: CardSettings = {
    title: 'Total Product',
    iconClass: 'nb-e-commerce',
    type: 'primary',
    total: "100000",
    totalType:"text"
  };
  moneyCard: CardSettings = {
    title: 'Total Sales',
    iconClass: 'nb-bar-chart',
    type: 'success',
    total: "100000",
    totalType:"text"
  };
  profitCard: CardSettings = {
    title: 'Total Sale Amount',
    iconClass: 'nb-arrow-thin-up',
    type: 'success',
    total: "100000",
    totalType:"number"
  };
  expanseCard: CardSettings = {
    title: 'Total Invoice',
    iconClass: 'nb-compose',
    type: 'warning',
    total: "100000",
    totalType:"text"
  };

  briefcaseCard2: CardSettings = {
    title: 'Cashier',
    iconClass: 'nb-person',
    type: 'primary',
    total: "0",
    totalType:"text"
  };
  moneyCard2: CardSettings = {
    title: 'Supplier',
    iconClass: 'nb-person',
    type: 'primary',
    total: "0",
    totalType:"text"
  };
  profitCard2: CardSettings = {
    title: 'Customer',
    iconClass: 'nb-person',
    type: 'warning',
    total: "0",
    totalType:"text"
  };
  expanseCard2: CardSettings = {
    title: 'Total Invoice Amount',
    iconClass: 'nb-compose',
    type: 'warning',
    total: "0",
    totalType:"number"
  };

  statusCards: string;
  statusCards2: string;

  salesOverviewCards: CardSettings[] = [
    this.briefcaseCard,
    this.moneyCard,
    this.profitCard,
    this.expanseCard,
  ];

  usersOverviewCards: CardSettings[] = [
    this.briefcaseCard2,
    this.moneyCard2,
    this.profitCard2,
    this.expanseCard2,
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
          ...this.briefcaseCard,
          type: 'warning',
        },
        {
          ...this.moneyCard,
          type: 'primary',
        },
        {
          ...this.profitCard,
          type: 'danger',
        },
        {
          ...this.expanseCard,
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
          ...this.briefcaseCard2,
          type: 'warning',
        },
        {
          ...this.moneyCard2,
          type: 'primary',
        },
        {
          ...this.profitCard2,
          type: 'danger',
        },
        {
          ...this.expanseCard2,
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
    this.subscription.push(this.getSupplier())
    this.subscription.push(this.getCustomer())
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
      this.briefcaseCard2.total = total
    })
  }

  getSupplier(): Subscription {
    return this.userService.getbyRole('supplier').subscribe(res=>{
      const total = res.length || 0
      this.moneyCard2.total = total
    })
  }
  
  getCustomer(): Subscription {
    return this.userService.getbyRole('customer').subscribe(res=>{
      const total = res.length || 0
      this.profitCard2.total = total
    })
  }
  
  

  getInvoice(): Subscription {
    return this.invoiceService.get().subscribe(res=>{
      const totalInvoiceAmount = res.map(x => x.netAmount).reduce((a, b) => (a ? parseInt(a) : 0) + (b ? parseInt(b) : 0), 0);
      const total = res.length||0
      this.expanseCard.total = total
      this.expanseCard2.total = totalInvoiceAmount
      this.invoices = res
    })
  }
  
  getProduct(): Subscription {
    return this.productService.get().subscribe(res => {
      const total = res.length||0
      this.briefcaseCard.total = total;
      this.products = res
    });
  }

  private getSales() {
    return this.salesService.get().subscribe(res => {
      const totalSalesAmount = res.map(x => x.totalPrice).reduce((a, b) => (a ? parseInt(a) : 0) + (b ? parseInt(b) : 0), 0);
      const totalSales = res.length ||0;
      this.moneyCard.total = totalSales;
      this.profitCard.total = totalSalesAmount
    });
  }

  ngOnDestroy() {
    this.subscription.forEach(x=> x.unsubscribe())
    this.alive = false;
  }
}
