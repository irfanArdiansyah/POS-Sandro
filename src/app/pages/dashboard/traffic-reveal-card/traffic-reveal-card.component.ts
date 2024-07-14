import { Component, OnDestroy } from '@angular/core';
import { TrafficList, TrafficListData } from '../../../@core/data/traffic-list';
import { TrafficBarData, TrafficBar } from '../../../@core/data/traffic-bar';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-traffic-reveal-card',
  styleUrls: ['./traffic-reveal-card.component.scss'],
  templateUrl: './traffic-reveal-card.component.html',
})
export class TrafficRevealCardComponent implements OnDestroy {

  private alive = true;

  trafficBarData: TrafficBar;
  trafficListData: TrafficList[];
  revealed = false;
  period: string = 'week';

  constructor(private trafficListService: TrafficListData,
    private trafficBarService: TrafficBarData) {
    this.getTrafficFrontCardData(this.period);
    this.getTrafficBackCardData(this.period);
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
        console.log("trafficBarData", trafficBarData)

      });
  }

  getTrafficFrontCardData(period: string) {
    this.trafficListService.getTrafficListData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(trafficListData => {
        let mockup:TrafficList[] =  [
          {
            comparison: { prevDate: 'Sun', prevValue: 24, nextDate: 'Mon', nextValue: 29 },
            date: "Lenevo 3rd Generation",
            delta: { up: false, value: 5 },
            value: 12500
          },
          {
            comparison: { prevDate: 'Sun', prevValue: 24, nextDate: 'Mon', nextValue: 29 },
            date: "Bold V3.2",
            delta: { up: true, value: 13 },
            value: 12500
          },
          {
            comparison: { prevDate: 'Sun', prevValue: 24, nextDate: 'Mon', nextValue: 29 },
            date: "Apple Series 5 Watch",
            delta: { up: false, value: 8 },
            value: 12500
          },
          {
            comparison: { prevDate: 'Sun', prevValue: 24, nextDate: 'Mon', nextValue: 29 },
            date: "Nike Jordan",
            delta: { up: true, value: 24 },
            value: 12500
          },
        ]
        this.trafficListData = mockup;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
