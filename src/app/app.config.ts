import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { routes } from './app.routes';
import { DA_DATA_API_KEY, MAP_API_KEY } from './core/tokens.provider';
import { dbConfig } from './core/db.config';
import { ThemeService } from './core/services/theme.service';
import { ICONS } from './core/icons';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideToastr({ positionClass: 'toast-bottom-left' }),
    importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)),
    {
      provide: MAP_API_KEY,
      useValue: environment.yandexMapsKey,
    },
    {
      provide: DA_DATA_API_KEY,
      useValue: environment.daDataKey,
    },
    provideAppInitializer(() => {
      const themeService = inject(ThemeService);
      themeService.init();
    }),
    provideAppInitializer(() => {
      const iconRegistry = inject(MatIconRegistry);
      const sanitizer = inject(DomSanitizer);

      ICONS.forEach(icon => {
        iconRegistry.addSvgIcon(icon.name, sanitizer.bypassSecurityTrustResourceUrl(icon.fileName));
      });
    }),
  ],
};
