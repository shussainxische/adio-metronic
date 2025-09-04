import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.scss',
  host: {
    class: 'contents',
  },
})
export class TableRowComponent {
  @Input() customClass: string = '';

  @Output() dblclick = new EventEmitter<MouseEvent>();


  onDoubleClick(evt: MouseEvent) {
    // re-emit it so parent templates can bind to (dblclick)
    this.dblclick.emit(evt);
  }

}
