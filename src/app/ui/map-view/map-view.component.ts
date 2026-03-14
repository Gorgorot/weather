import { Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MapApiLoadState, MapService } from './map.service';
import { DrawingMode } from '../../drawer/map-drawer.models';
import { FormControl } from '@angular/forms';
import { IDaDataSuggestion } from '../../services/da-data.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
  standalone: false,
})
export class MapViewComponent implements OnInit {
  mapService = inject(MapService);

  readonly DrawingMode = DrawingMode;

  mapContainer = viewChild<ElementRef<HTMLElement>>('mapContainer');

  mapSize = signal({ width: 100, height: 100 });
  weatherInfo = this.mapService.weatherInfo;
  selectedDrawingMode = this.mapService.selectedDrawingMode;

  resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[], observer: ResizeObserver) => {
    if (entries.length > 0) {
      this.mapSize.set({
        width: this.element.nativeElement.clientWidth,
        height: this.element.nativeElement.clientHeight,
      })
    }
  });

  searchControl = new FormControl(null);

  constructor(
    private element: ElementRef,
  ) {
    effect(() => {
      const mapContainer = this.mapContainer();
      const mapLoadState = this.mapService.apiState();

      if (!mapContainer || mapLoadState === MapApiLoadState.LOAD) {
        return;
      }

      this.mapService.initMap(mapContainer.nativeElement);
    });
  }

  ngOnInit() {
    this.mapService.loadApi();
    this.resizeObserver.observe(this.element.nativeElement);
  }

  openPolygonsList() {
    this.mapService.openPolygonsList();
  }

  startDrawLine() {
    this.mapService.setDrawingMode(DrawingMode.LINE);
  }

  onCitySelected(data: IDaDataSuggestion) {
    const [long, lat] = [+data.data.geo_lon, +data.data.geo_lat];

    this.mapService.focusMapOnLocation([long, lat]);
  }
}
