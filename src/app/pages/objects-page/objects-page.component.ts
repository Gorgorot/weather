import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ObjectsService } from '../../services/objects.service';
import { ThemeDirective } from '../../directives/theme.directive';
import { WeatherCardComponent } from '../../ui/weather-card/weather-card.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-objects-page',
  imports: [
    WeatherCardComponent,
    RouterOutlet
  ],
  templateUrl: './objects-page.component.html',
  styleUrl: './objects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    ThemeDirective,
  ]
})
export class ObjectsPageComponent {
  private readonly objectsService = inject(ObjectsService);
  objectWeatherInfo = this.objectsService.objectWeatherInfo;
  private activatedRoute = inject(ActivatedRoute);

  objects = this.objectsService.objects;
  currentObjectId = toSignal(
    this.activatedRoute.firstChild!.paramMap.pipe(
      map(data => String(data.get('id'))),
    )
  );
  private router = inject(Router);

  constructor() {
    effect(() => {
      const a = this.objectsService.objectWeatherInfo();
      const b = this.currentObjectId();

      console.log(a);
      console.log(b);
    });
  }

  onCardAdditionalInfo(objectId: string): void {
    this.router.navigate(['/objects/', objectId]);
  }
}
