import { Component, Input } from '@angular/core';
import { LucideAngularModule, Mail, AlertCircle, FileText, Users, Calendar, Clock, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <lucide-angular 
      [img]="getIcon()" 
      [size]="size"
      [class]="className">
    </lucide-angular>
  `,
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @Input() name: string = 'mail';
  @Input() size: number = 20;
  @Input() className: string = '';

  readonly iconMap = {
    'mail': Mail,
    'alert-circle': AlertCircle,
    'file-text': FileText,
    'users': Users,
    'calendar': Calendar,
    'clock': Clock,
    'check-circle': CheckCircle
  };

  getIcon() {
    return this.iconMap[this.name] || Mail;
  }
}