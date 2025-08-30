import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { BaseApplicationFilterService } from './services/base-application-filter.service';
import { RealApplicationFilterService } from './services/real-application-filter.service';
import { MockApplicationFilterService } from './services/mock-application-filter.service';
import { BaseApplicationsService } from './services/base-applications.service';
import { RealApplicationsService } from './services/real-applications.service';
import { MockApplicationsService } from './services/mock-applications.service';
import { BaseApplicationsSummaryService } from './services/base-applications-summary.service';
import { RealApplicationsSummaryService } from './services/real-applications-summary.service';
import { MockApplicationsSummaryService } from './services/mock-applications-summary.service';
import { BaseRfqApplicationService } from './services/base-rfq-application.service';
import { RealRfqApplicationService } from './services/real-rfq-application.service';
import { MockRfqApplicationService } from './services/mock-rfq-application.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function applicationFilterServiceFactory(http: HttpClient): BaseApplicationFilterService {
  if (environment.useMockData) {
    return new MockApplicationFilterService();
  } else {
    return new RealApplicationFilterService(http);
  }
}

export function applicationsServiceFactory(http: HttpClient): BaseApplicationsService {
  if (environment.useMockData) {
    return new MockApplicationsService();
  } else {
    return new RealApplicationsService(http);
  }
}

export function applicationsSummaryServiceFactory(http: HttpClient): BaseApplicationsSummaryService {
  if (environment.useMockData) {
    return new MockApplicationsSummaryService();
  } else {
    return new RealApplicationsSummaryService(http);
  }
}

export function rfqApplicationServiceFactory(http: HttpClient): BaseRfqApplicationService {
  if (environment.useMockData) {
    return new MockRfqApplicationService();
  } else {
    return new RealRfqApplicationService(http);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })),
    // Provide the application filter service
    {
      provide: BaseApplicationFilterService,
      useFactory: applicationFilterServiceFactory,
      deps: [HttpClient]
    },
    // Provide the applications service
    {
      provide: BaseApplicationsService,
      useFactory: applicationsServiceFactory,
      deps: [HttpClient]
    },
    // Provide the applications summary service
    {
      provide: BaseApplicationsSummaryService,
      useFactory: applicationsSummaryServiceFactory,
      deps: [HttpClient]
    },
    // Provide the RFQ application service
    {
      provide: BaseRfqApplicationService,
      useFactory: rfqApplicationServiceFactory,
      deps: [HttpClient]
    }
  ]
};
