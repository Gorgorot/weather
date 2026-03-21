import {Component, effect, ElementRef, HostListener, inject, OnDestroy, OnInit, signal, viewChild} from '@angular/core';
import {MapApiLoadState, MapService} from './map.service';
import {DrawingMode} from '../../drawer/map-drawer.models';
import {IDaDataSuggestion} from '../../services/da-data.service';
import {Themes, ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
  standalone: false,
  host: {
    '[class.dark]': 'themeService.getCurrentTheme()() === Themes.DARK',
    '[class.light]': 'themeService.getCurrentTheme()() === Themes.LIGHT'
  }
})
export class MapViewComponent implements OnInit, OnDestroy {
  readonly themeService = inject(ThemeService);
  readonly Themes = Themes;
  private readonly mapService = inject(MapService);

  readonly DrawingMode = DrawingMode;

  mapContainer = viewChild<ElementRef<HTMLElement>>('mapContainer');

  mapSize = signal({ width: 100, height: 100 });
  weatherInfo = this.mapService.weatherInfo;
  selectedDrawingMode = this.mapService.selectedDrawingMode;
  cursorPos = signal({x: 0, y: 0});
  cursorAnimating = signal(false);

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const rect = this.element.nativeElement.getBoundingClientRect();
    this.cursorPos.set({x: event.clientX - rect.left, y: event.clientY - rect.top});
  }

  @HostListener('click')
  onMapClick() {
    if (this.selectedDrawingMode() !== DrawingMode.LINE) return;
    this.cursorAnimating.set(false);
    requestAnimationFrame(() => {
      this.cursorAnimating.set(true);
      setTimeout(() => this.cursorAnimating.set(false), 300);
    });
  }

  resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[], observer: ResizeObserver) => {
    if (entries.length > 0) {
      this.mapSize.set({
        width: this.element.nativeElement.clientWidth,
        height: this.element.nativeElement.clientHeight,
      })
    }
  });

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

  ngOnInit() {
    if (!this.mapService.apiLoaded) {
      this.mapService.loadApi();
    }
    this.resizeObserver.observe(this.element.nativeElement);
  }

  ngOnDestroy() {
    this.mapService.detachMap();
  }
}
