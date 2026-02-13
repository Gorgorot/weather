import { Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MapApiLoadState, MapService } from '../../services/map.service';
import { DrawingMode } from '../../drawer/map-drawer.models';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { IDaDataSuggestion } from '../../services/da-data.service';
import { WeatherApiService } from '../../services/weather-api.service';
import { OpenmeteoDaily } from '../../weather/openmeteo-dailty';
import { OpenmeteoHourly } from '../../weather/openmeteo-hourly';
import { OpenMeteoCurrent } from '../../weather/openmeteo-current';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss',
  standalone: false,
})
export class MapViewComponent implements OnInit {
  mapService = inject(MapService);
  weatherApiService = inject(WeatherApiService);

  mapContainer = viewChild<ElementRef<HTMLElement>>('mapContainer');

  mapSize = signal({ width: 100, height: 100 });

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
    this.resizeObserver.observe(this.element.nativeElement);
  }

  startDrawLine() {
    this.mapService.setDrawingMode(DrawingMode.LINE);
  }

  onCitySelected(data: IDaDataSuggestion) {
    const [long, lat] = [+data.data.geo_lon, +data.data.geo_lat];

    this.mapService.focusMapOnLocation({
      center: [long, lat],
      zoom: 13,
      duration: 1000,
    });

    this.weatherApiService.fetch({
      longitude: long,
      latitude: lat,
      hourly: 'temperature_2m',
      daily: 'temperature_2m_max',
      current: 'temperature_2m,relative_humidity_2m',
    })
      .subscribe(v => {
        console.log(new OpenmeteoDaily(v.daily()!, v.utcOffsetSeconds()))
        console.log(new OpenmeteoHourly(v.hourly()!, v.utcOffsetSeconds()))
        console.log(new OpenMeteoCurrent(v.current()!, v.utcOffsetSeconds()))
      });
  }
}
