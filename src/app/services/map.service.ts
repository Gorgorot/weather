import { inject, Injectable, signal } from '@angular/core';
import { MAP_API_KEY } from '../app.module';
import { fromEvent } from 'rxjs';
import { YMapLocationRequest } from 'ymaps3';
import { MapDrawer } from '../drawer/map-drawer';
import { DrawingMode } from '../drawer/map-drawer.models';

export enum MapApiLoadState {
  RESOLVED,
  LOAD,
  REJECTED,
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  apiKey = inject(MAP_API_KEY);

  apiState = signal<MapApiLoadState>(MapApiLoadState.LOAD);

  drawer: MapDrawer;

  loadApi() {
    const script = document.createElement('script');

    script.src = `https://api-maps.yandex.ru/v3/?apikey=${ this.apiKey }&lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      this.apiState.set(MapApiLoadState.RESOLVED);
    };
    script.onerror = () => {
      this.apiState.set(MapApiLoadState.REJECTED);
    };

    document.head.appendChild(script);
  }

  async initMap(mapContainer: any): Promise<void> {
    await ymaps3.ready;

    const LOCATION: YMapLocationRequest = {
      center: [37.588144, 55.733842],
      zoom: 9
    };

    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener } = ymaps3;

    const map = new YMap(mapContainer, { location: LOCATION });
    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

    this.drawer = new MapDrawer(map);
  }

  setDrawingMode(mode: DrawingMode) {
    this.drawer.setDrawMode(mode);
  }

  focusMapOnLocation(location: YMapLocationRequest) {
    this.drawer.focusMapOnLocation(location);
  }
}
