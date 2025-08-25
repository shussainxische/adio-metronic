import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-top-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './top-card.component.html',
  styleUrl: './top-card.component.scss',
  host: {
    class: 'text-gray-900',
  },
})
export class TopCardComponent {
  @Input() title = '';
  @Input() className = '';
  @Input() showShadow = true;
  @Input() titleMode: 'primary' | 'secondary' = 'primary';
}
