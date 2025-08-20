import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-container',
  imports: [CommonModule],
  templateUrl: './table-container.component.html',
  styleUrl: './table-container.component.scss'
})
export class TableContainerComponent {
  @Input() class: string = '';
}
