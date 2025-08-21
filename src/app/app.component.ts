import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from './components/ui/loader/loader.component';
import { LoaderService } from './services/loader/loader.service';
import KTComponents from '../metronic/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    // MsalModule,
    CommonModule,
    TranslateModule,
    LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'adio-metronic';
  constructor(private router: Router, public loaderService: LoaderService) {
  }

    ngAfterViewInit(): void {
    KTComponents.init();
    KTLayout.init();
  }

  ngOnInit() {
    //this.langService.initLanguage(); // Call the initialization function
  }
}
