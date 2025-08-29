import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

export interface InfoData {
  name: string;
  position: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-info-widget',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './info-widget.component.html',
  styleUrl: './info-widget.component.scss'
})
export class InfoWidgetComponent {
  @Input() data!: InfoData;
  @Input() title: string = 'Contact Information';
  @Input() collapsed: boolean = true;
  
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
}