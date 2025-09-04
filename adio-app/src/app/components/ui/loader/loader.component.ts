import { Component, Input } from '@angular/core';
import { LoaderService } from '../../../services/loader/loader.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  isLoading$!: Observable<boolean>;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() inline = false;
  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.isLoading$;
  }
}
