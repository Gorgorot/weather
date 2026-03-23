import { Observable, Subject } from 'rxjs';
import { DrawingMode } from './map-drawer.models';
import { IPolygon } from '@features/weather/services/polygons-store.service';
import type { IMapDrawerAddPolygonEvent } from './map-manager';

export class MapDrawerEvents {
  private readonly addPolygon$ = new Subject<IMapDrawerAddPolygonEvent>();
  readonly onAddPolygon: Observable<IMapDrawerAddPolygonEvent> = this.addPolygon$.asObservable();
  private readonly polygonClick$ = new Subject<IPolygon>();
  readonly onPolygonClick: Observable<IPolygon> = this.polygonClick$.asObservable();
  private readonly drawingModeChange$ = new Subject<DrawingMode>();
  readonly onDrawingModeChange: Observable<DrawingMode> = this.drawingModeChange$.asObservable();

  emitAddPolygon(event: IMapDrawerAddPolygonEvent): void {
    this.addPolygon$.next(event);
  }

  emitPolygonClick(polygon: IPolygon): void {
    this.polygonClick$.next(polygon);
  }

  emitDrawingModeChange(mode: DrawingMode): void {
    this.drawingModeChange$.next(mode);
  }

  destroy(): void {
    this.addPolygon$.complete();
    this.polygonClick$.complete();
    this.drawingModeChange$.complete();
  }
}
