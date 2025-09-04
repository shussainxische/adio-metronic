import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-row',
  imports: [],
  templateUrl: './card-row.component.html',
  styleUrl: './card-row.component.scss',
})
export class CardRowComponent {
  @Input() className: string = '';
}
