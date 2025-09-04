import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-adio-logo',
  imports: [CommonModule],
  templateUrl: './adio-logo.component.html',
  styleUrl: './adio-logo.component.scss'
})
export class AdioLogoComponent {
  @Input() variant: 'compact' | 'full' = 'compact';
}
