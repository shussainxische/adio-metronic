import { Component, Input } from '@angular/core';
import { LucideAngularModule, Mail, AlertCircle, FileText, Users, Calendar, Clock, CheckCircle, Filter, FileCheck, Search, Award, Archive, LayoutGrid, List, Building, User, Building2, Bell, ArrowLeft, Check, ChevronLeft, ChevronRight, Download, ShieldCheck, ClipboardCheck, ThumbsUp, DollarSign, FilePlus, Eye, Send, Quote, Folder, Inbox } from 'lucide-angular';

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
    'check-circle': CheckCircle,
    'filter': Filter,
    'file-check': FileCheck,
    'search': Search,
    'award': Award,
    'archive': Archive,
    'layout-grid': LayoutGrid,
    'list': List,
    'building': Building,
    'user': User,
    'building-2': Building2,
    'bell': Bell,
    'arrow-left': ArrowLeft,
    'check': Check,
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'download': Download,
    'shield-check': ShieldCheck,
    'clipboard-check': ClipboardCheck,
    'thumbs-up': ThumbsUp,
    'dollar-sign': DollarSign,
    'file-plus': FilePlus,
    'eye': Eye,
    'send': Send,
    'quote': Quote,
    'folder': Folder,
    'inbox': Inbox
  };

  getIcon() {
    return this.iconMap[this.name] || Mail;
  }
}