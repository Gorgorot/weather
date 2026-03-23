import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MapViewComponent } from './components/map-view/map-view.component';
import { TitleService } from '../../core/services/title.service';

@Component({
  selector: 'app-map-page',
  imports: [
    MapViewComponent,
  ],
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPageComponent implements OnInit {
  private readonly titleService = inject(TitleService);

  ngOnInit() {
    this.titleService.setTitle('Карта');
  }
}
