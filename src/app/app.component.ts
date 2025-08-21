import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
// import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from './components/ui/loader/loader.component';
import { LoaderService } from './services/loader/loader.service';
import KTComponents from '../metronic/core/index';
import KTLayout from '../metronic/app/layouts/demo1';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoaderComponent, MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'adio-metronic';
  constructor(private router: Router, public loaderService: LoaderService) {
  
    this.router.events.subscribe(event => {

    });
  }

    ngAfterViewInit(): void {
    KTComponents.init();
    KTLayout.init();
  }

  ngOnInit() {
    //this.langService.initLanguage(); // Call the initialization function
  }
}
