import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-cell',
  imports: [CommonModule],
  templateUrl: './table-cell.component.html',
  styleUrl: './table-cell.component.scss',
  host: {
    class:
      'contents',
  },
})
export class TableCellComponent {
  @Input() class='';
}
