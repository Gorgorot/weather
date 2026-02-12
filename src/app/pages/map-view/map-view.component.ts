import { Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MapApiLoadState, MapService } from '../../services/map.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { DrawingMode } from '../../drawer/map-drawer.models';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-map-view',
  imports: [
    MatButton,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss',
})
export class MapViewComponent implements OnInit {
  mapService = inject(MapService);

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
}
