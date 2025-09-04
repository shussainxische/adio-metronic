import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../components/ui/icon/icon.component';

@Component({
  selector: 'app-compact-search',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="relative w-48">
      <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
        <app-icon name="search" [size]="14" className="text-black"></app-icon>
      </div>
      <input 
        type="text" 
        [placeholder]="placeholder"
        (input)="onInput($event)"
        class="w-full h-8 pl-8 pr-3 text-xs border border-gray-300 rounded bg-white text-gray-700 focus:border-primary focus:outline-none">
    </div>
  `,
  styles: []
})
export class CompactSearchComponent {
  @Input() placeholder: string = 'Search...';
  @Output() search = new EventEmitter<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}