import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-card-row',
  imports: [],
  templateUrl: './top-card-row.component.html',
  styleUrl: './top-card-row.component.scss',
})
export class TopCardRowComponent {
  @Input() className: string = '';
}
