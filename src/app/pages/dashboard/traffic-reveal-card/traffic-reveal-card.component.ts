import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { TrafficList, TrafficListData } from '../../../@core/data/traffic-list';
import { TrafficBarData, TrafficBar } from '../../../@core/data/traffic-bar';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-traffic-reveal-card',
  styleUrls: ['./traffic-reveal-card.component.scss'],
  templateUrl: './traffic-reveal-card.component.html',
})
export class TrafficRevealCardComponent implements OnDestroy, OnChanges {

  private alive = true;
  @Input() products= []
  trafficBarData: TrafficBar;
  trafficListData: TrafficList[];
  revealed = false;
  period: string = 'week';

  constructor(private trafficListService: TrafficListData,
    private trafficBarService: TrafficBarData) {
    this.getTrafficFrontCardData(this.period);
    this.getTrafficBackCardData(this.period);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.products){
      this.getTrafficFrontCardData(this.period);
    }
  }

  

  toggleView() {
    this.revealed = !this.revealed;
  }

  setPeriodAngGetData(value: string): void {
    this.period = value;

    this.getTrafficFrontCardData(value);
    this.getTrafficBackCardData(value);
  }

  getTrafficBackCardData(period: string) {
    this.trafficBarService.getTrafficBarData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(trafficBarData => {
        this.trafficBarData = trafficBarData;
      });
  }

  getTrafficFrontCardData(period: string) {
    this.trafficListService.getTrafficListData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(trafficListData => {
        this.getRecentProduct();
      });
  }

  private getRecentProduct() {
    let data: TrafficList[] = [];
    if (this.products?.length > 0)
      this.products.forEach(product => {
        data.push({
          comparison: { prevDate: 'Sun', prevValue: 24, nextDate: 'Mon', nextValue: 29 },
          date: product.productName,
          delta: { up: product.unitInStock > 10, value: product.unitInStock },
          value: product.unitPrice
        });
      });
    this.trafficListData = data.slice(0, 5);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
