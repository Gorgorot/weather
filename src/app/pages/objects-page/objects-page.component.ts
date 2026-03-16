import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ObjectsService } from '../../services/objects.service';
import { ThemeDirective } from '../../directives/theme.directive';
import { WeatherCardComponent } from '../../ui/weather-card/weather-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { QuickObjectInfoComponent } from '../../ui/quick-object-info/quick-object-info.component';

@Component({
  selector: 'app-objects-page',
  imports: [
    WeatherCardComponent,
    QuickObjectInfoComponent
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
  private router = inject(Router);
  objectWeatherInfo = this.objectsService.objectWeatherInfo;
  currentWeatherInfo = computed(() => {
    const currentObjectId = this.currentObjectId();
    const objectWeatherInfo = this.objectWeatherInfo();

    return objectWeatherInfo?.find(info => info.objectId === currentObjectId);
  });
  private readonly activatedRoute = inject(ActivatedRoute);
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
    this.router.navigate(['/objects'], {
      queryParams: {
        'id': objectId,
      },
    });
  }

  onCloseQuickInfo() {
    this.router.navigate(['/objects']);
  }
}
