import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MapViewModule} from '../../ui/map-view/map-view.module';
import {TitleService} from '../../services/title.service';

@Component({
  selector: 'app-map-page',
  imports: [
    MapViewModule
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
