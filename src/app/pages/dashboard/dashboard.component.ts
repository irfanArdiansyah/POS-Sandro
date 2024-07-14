import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
  total: string;
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
    title: 'Total Purchase Due',
    iconClass: 'nb-e-commerce',
    type: 'primary',
    total: "Rp.100.000"
  };
  moneyCard: CardSettings = {
    title: 'Total Sales Due',
    iconClass: 'nb-bar-chart',
    type: 'success',
    total: "Rp.100.000"
  };
  profitCard: CardSettings = {
    title: 'Total Sale Amount',
    iconClass: 'nb-arrow-thin-up',
    type: 'success',
    total: "Rp.100.000"
  };
  expanseCard: CardSettings = {
    title: 'Total Expense Amount',
    iconClass: 'nb-arrow-thin-down',
    type: 'danger',
    total: "Rp.100.000"
  };

  briefcaseCard2: CardSettings = {
    title: 'Cashier',
    iconClass: 'nb-person',
    type: 'primary',
    total: "10"
  };
  moneyCard2: CardSettings = {
    title: 'Supplier',
    iconClass: 'nb-person',
    type: 'primary',
    total: "10"
  };
  profitCard2: CardSettings = {
    title: 'Purchase Invoice',
    iconClass: 'nb-compose',
    type: 'warning',
    total: "10"
  };
  expanseCard2: CardSettings = {
    title: 'Sales Invoice',
    iconClass: 'nb-compose',
    type: 'warning',
    total: "10"
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
  constructor(private themeService: NbThemeService,
              private solarService: SolarData) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
        this.statusCards2 = this.statusCardsByThemes2[theme.name]
    });

    // this.solarService.getSolarData()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe((data) => {
    //     this.solarValue = data;
    //   });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
