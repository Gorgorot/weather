import { inject, Injectable, Injector, signal } from '@angular/core';
import { MAP_API_KEY } from '../../app.module';
import { filter, map, of, switchMap, take, tap } from 'rxjs';
import { LngLat, YMapLocationRequest } from 'ymaps3';
import { MapDrawer } from '../../drawer/map-drawer';
import { DrawingMode } from '../../drawer/map-drawer.models';
import { IPolygon, PolygonsStoreService } from '../../services/polygons-store.service';
import { MapDialogsService } from './map-dialogs.service';
import { AddPolygonModalComponent } from './components/modal/add-polygon-modal/add-polygon-modal.component';
import { PolygonsListComponent } from './components/modal/polygons-list-component/polygons-list-component';
import { OpenMeteoDataTypes, WeatherInfo } from '../../weather/weather-info';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { WeatherApiService } from '../../services/weather-api.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

export enum MapApiLoadState {
  RESOLVED = 'RESOLVED',
  LOAD = 'LOAD',
  REJECTED = 'REJECTED',
}

@Injectable()
export class MapService {
  readonly apiKey = inject(MAP_API_KEY);
  readonly polygonsStoreService = inject(PolygonsStoreService);
  readonly mapDialogsService = inject(MapDialogsService);
  readonly bottomSheet = inject(MatBottomSheet);
  readonly weatherApiService = inject(WeatherApiService);

  apiState = signal<MapApiLoadState>(MapApiLoadState.LOAD);
  selectedDrawingMode = signal<DrawingMode>(DrawingMode.NONE);
  weatherInfo = toSignal(
    toObservable(this.polygonsStoreService.selectedPolygon).pipe(
      switchMap(polygon => polygon ? this.getWeatherInfo(polygon) : of(null)),
    ),
    { initialValue: null }
  );
  drawer: MapDrawer;
  polygons = this.polygonsStoreService.allPolygons;

  constructor(private injector: Injector) {
  }

  get apiLoaded() {
    return this.apiState() === MapApiLoadState.RESOLVED;
  }

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

    ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', '@yandex/ymaps3-default-ui-theme@0.0');

    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener } = ymaps3;
    // @ts-ignore

    const map = new YMap(mapContainer, { location: LOCATION });

    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

    this.drawer = new MapDrawer(map);

    await this.drawer.init();

    this.listenDrawerAddPolygonEvent();
    this.listenOnClickPolygonMarker();
    this.listenDrawingModeChange();
    this.drawAllPolygons();
  }

  updatePolygon(polygon: IPolygon) {
    return this.polygonsStoreService.update(polygon);
  }

  openPolygonsList() {
    this.bottomSheet.open(PolygonsListComponent, {injector: this.injector})
      .afterDismissed()
      .pipe(
        take(1),
      )
      .subscribe();
  }

  selectPolygon(polygon: IPolygon) {
    this.polygonsStoreService.setSelectedPolygonId(polygon.id);

    this.focusOnPolygon(polygon);
  }

  removePolygon(polygon: IPolygon) {
    this.polygonsStoreService.remove(polygon.id);
    this.drawer.removePolygon(polygon);
  }

  focusMapOnLocation(center: LngLat) {
    this.drawer.focusMapOnLocation({
      center: center,
      zoom: 13,
      duration: 1000,
    });
  }

  focusOnPolygon(polygon: IPolygon) {
    const lons = (polygon.geometry.coordinates[0] as LngLat[]).map(c => c[0]);
    const lats = (polygon.geometry.coordinates[0] as LngLat[]).map(c => c[1]);

    const bounds = [
      [Math.min(...lons), Math.min(...lats)], // southwest
      [Math.max(...lons), Math.max(...lats)]  // northeast
    ];

    this.drawer.focusMapOnLocation({
      // @ts-ignore
      bounds,
      duration: 1000,
    })
  }

  private listenDrawingModeChange() {
    this.drawer.onDrawingModeChange.subscribe(drawingMode => {
      this.selectedDrawingMode.set(drawingMode);
    });
  }

  private listenDrawerAddPolygonEvent() {
    this.drawer.onAddPolygon
      .pipe(
        switchMap((event) => {
          return this.mapDialogsService.open(AddPolygonModalComponent, {
            disableClose: true,
          })
            .afterClosed()
            .pipe(
              filter(Boolean),
              switchMap((data) => {
                return this.polygonsStoreService.add({
                  name: data,
                  center: event.center,
                  domCenter: event.domCenter,
                  style: event.style,
                  geometry: event.geometry,
                });
              })
            )
        }),
        tap(polygon => this.drawer.drawPolygon(polygon as unknown as IPolygon)),
      )
      .subscribe();
  }

  private getWeatherInfo(polygon: IPolygon) {
    const req = {
      current: [
        'temperature_2m',
        'relative_humidity_2m',
      ].join(','),
    };

    return this.weatherApiService.fetch(polygon.center, req)
      .pipe(
        map((data) => {
          return new WeatherInfo(
            polygon.name,
            polygon.style?.fill ?? '',
            polygon.id,
            data,
            [
              {
                type: OpenMeteoDataTypes.CURRENT,
                keys: [
                  'temperature_2m',
                  'relative_humidity_2m',
                ],
              }
            ],
          );
        })
      )
  }

  private listenOnClickPolygonMarker() {
    this.drawer.onPolygonClick.subscribe(polygon => {
      this.selectPolygon(polygon);
    })
  }

  setDrawingMode(mode: DrawingMode) {
    this.drawer.setDrawMode(mode);
  }

  private drawAllPolygons() {
    const polygons = this.polygons();

    if (polygons.length === 0) {
      return;
    }

    this.drawer.drawPolygons(this.polygons());

    this.selectPolygon(polygons[0]);
  }

  private drawPolygon(polygon: IPolygon) {
    this.drawer.drawPolygon(polygon);
  }
}
