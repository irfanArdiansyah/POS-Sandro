import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card>
      <div class="icon-container">
        <div class="icon status-{{ type }}">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
      <div *ngIf="totalType == 'number'" class="title h5"> {{ total | currency:'':'Rp.' }}</div>
      <div *ngIf="totalType == 'text'" class="title h5"> {{ total }}</div>
        <div class="status paragraph-2">{{ title }}</div>
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {

  @Input() title: string;
  @Input() type: string;
  @Input() total: string;
  @Input() totalType: string;
  
  
}
