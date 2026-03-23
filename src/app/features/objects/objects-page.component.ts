import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ObjectsService } from '@features/weather/services/objects.service';
import { PolygonsStoreService } from '@features/weather/services/polygons-store.service';
import { ThemeDirective } from '@core/directives/theme.directive';
import { WeatherCardComponent } from '@shared/components/weather-card/weather-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { QuickObjectInfoComponent } from './components/quick-object-info/quick-object-info.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-objects-page',
  imports: [
    WeatherCardComponent,
    QuickObjectInfoComponent,
    MatProgressSpinner,
    RouterLink,
  ],
  templateUrl: './objects-page.component.html',
  styleUrl: './objects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    ThemeDirective,
  ],
  providers: [
    ObjectsService,
  ]
})
export class ObjectsPageComponent {
  private readonly objectsService = inject(ObjectsService);
  weatherPending = this.objectsService.weatherPending;
  displayEmptyState = computed(() => {
    const objects = this.objectsService.objects();
    const isLoading = this.loading();

    return !isLoading && !objects.length;
  })
  private router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly polygonsStoreService = inject(PolygonsStoreService);
  private readonly activatedRoute = inject(ActivatedRoute);
  objectWeatherInfo = this.objectsService.objectWeatherInfo;
  loading = this.objectsService.loading;
  currentWeatherInfo = computed(() => {
    const currentObjectId = this.currentObjectId();
    const objectWeatherInfo = this.objectWeatherInfo();

    return objectWeatherInfo?.find(info => info.objectId === currentObjectId);
  });
  currentObjectId = toSignal(
    this.activatedRoute.queryParams.pipe(
      map(data => Number(data['id'])),
    )
  );

  constructor() {
    effect(() => {
      const a = this.objectsService.objectWeatherInfo();

      console.log(a);
    });
  }

  onCardAdditionalInfo(objectId: number): void {
    const objectWithIdHasInfoParams = this.objectsService.objectWithIdHasInfoParams(objectId);

    if (!objectWithIdHasInfoParams) {
      this.toastr.error('Для этого объекта не заданы параметры', 'Ошибка');

      return;
    }

    this.router.navigate(['/objects'], {
      queryParams: {
        'id': objectId,
      },
    });
  }

  onDeleteObject(objectId: number): void {
    this.polygonsStoreService.remove(objectId);
  }

  onCloseQuickInfo() {
    this.router.navigate(['/objects']);
  }
}
