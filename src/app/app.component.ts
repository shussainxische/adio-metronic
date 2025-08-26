import { Component } from '@angular/core';
import { RoutesRecognized } from '@angular/router';
import KTComponents from '../metronic/core/index';
import KTLayout from '../metronic/app/layouts/demo1';
// import { MsalModule, MsalService } from "@azure/msal-angular";
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { LanguageService } from './services/language/language.service';
import { Router, NavigationEnd, NavigationStart, NavigationError, NavigationCancel } from '@angular/router';
import { LoaderComponent } from './components/ui/loader/loader.component';
import { LoaderService } from './services/loader/loader.service';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TranslateModule, LoaderComponent, MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'adio-metronic';
  constructor(private router: Router, private translate: TranslateService, public loaderService: LoaderService) {
  
    this.router.events.subscribe(event => {

    });
  }

    ngAfterViewInit(): void {
    KTComponents.init();
    KTLayout.init();
  }

  ngOnInit() {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    //this.langService.initLanguage(); // Call the initialization function
  }
}
