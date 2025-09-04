import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-body',
  imports: [CommonModule],
  templateUrl: './table-body.component.html',
  styleUrl: './table-body.component.scss',
  host: {
    class:
      'contents',
  },
})
export class TableBodyComponent {
@Input() showContent: boolean = true;
@Input() emptyContentMessage: string = "";
}
