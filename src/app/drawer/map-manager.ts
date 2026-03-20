import { DrawingStyle, LngLat, YMap, YMapFeature, YMapLocationRequest } from 'ymaps3';
import { LineDrawer } from './line-drawer';
import { DrawingMode, MapDrawerBaseExecutor } from './map-drawer.models';
import type { Geometry } from '@yandex/ymaps3-types/imperative/YMapFeature/types';
import type { DomEvent } from '@yandex/ymaps3-types/imperative/YMapListener';
import { MathHelper } from '../math-helper';
import { IPolygon } from '../services/polygons-store.service';
import type { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';
import { NoneDrawer } from './none-drawer';
import { MapDrawerEvents } from './map-drawer-events';


export interface IMapDrawerAddPolygonEvent {
  geometry: Geometry;
  style: DrawingStyle | undefined;
  center: LngLat;
  domCenter: LngLat;
  data: DomEvent;
}

export class MapManager {
  readonly events = new MapDrawerEvents();
  private readonly map: YMap;
  private drawingMode: DrawingMode = DrawingMode.NONE;
  private drawExecutor: MapDrawerBaseExecutor = new NoneDrawer();
  private markerCreator: typeof YMapDefaultMarker;
  private currentListener: InstanceType<typeof ymaps3.YMapListener> | null = null;
  private readonly polygonToMapObjectMap = new Map<number, YMapFeature>();
  private readonly polygonMarkerToMapObjectMap = new Map<number, YMapDefaultMarker>();

  constructor(map: YMap) {
    this.map = map;
  }

  async init(): Promise<void> {
    // @ts-ignore — ymaps3.import не типизирован для default-ui-theme
    const { YMapDefaultMarker } = await ymaps3.import('@yandex/ymaps3-default-ui-theme');
    this.markerCreator = YMapDefaultMarker;
  }

  setDrawMode(drawingMode: DrawingMode): void {
    if (this.drawingMode === drawingMode) {
      return;
    }

    this.drawingMode = drawingMode;
    this.events.emitDrawingModeChange(drawingMode);

    this.removeCurrentListener();
    this.createExecutor();

    const mapListener = new ymaps3.YMapListener({
      layer: 'any',
      onClick: (obj, event) => this.drawExecutor.clickAction(obj, event),
      onContextMenu: (_obj, event) => this.handleRightClick(event),
    });

    this.currentListener = mapListener;
    this.map.addChild(mapListener);
  }

  focusMapOnLocation(location: YMapLocationRequest): void {
    this.map.setLocation(location);
  }

  drawPolygons(polygons: IPolygon[]): void {
    polygons.forEach(polygon => this.drawPolygon(polygon));
  }

  drawPolygon(polygon: IPolygon): void {
    const feature = new ymaps3.YMapFeature({
      geometry: polygon.geometry,
      style: polygon.style,
    });

    this.map.addChild(feature);
    this.polygonToMapObjectMap.set(polygon.id, feature);
    this.drawPolygonMarker(polygon);
  }

  removePolygon(polygon: IPolygon): void {
    const mapObject = this.polygonToMapObjectMap.get(polygon.id);
    const mapMarker = this.polygonMarkerToMapObjectMap.get(polygon.id);

    if (mapObject) {
      this.map.removeChild(mapObject);
      this.polygonToMapObjectMap.delete(polygon.id);
    }

    if (mapMarker) {
      this.map.removeChild(mapMarker);
      this.polygonMarkerToMapObjectMap.delete(polygon.id);
    }
  }

  destroy(): void {
    this.removeCurrentListener();
    this.events.destroy();
  }

  private handleRightClick(event: DomEvent): void {
    const result = this.drawExecutor.rightClickAction();
    if (!result) {
      return;
    }

    const coordinates = result.geometry.coordinates[0] as LngLat[];
    if (!coordinates?.length) {
      return;
    }

    if (this.drawExecutor.isRemovable && this.drawExecutor.currentFigure) {
      this.map.removeChild(this.drawExecutor.currentFigure);
    }

    const center = MathHelper.getPolygonCenter(coordinates);

    this.events.emitAddPolygon({
      geometry: result.geometry,
      style: this.drawExecutor.drawingStyle,
      data: event,
      center,
      domCenter: this.extractDomCenter(center),
    });

    this.setDrawMode(DrawingMode.NONE);
  }

  private createExecutor(): void {
    switch (this.drawingMode) {
      case DrawingMode.LINE: {
        this.drawExecutor = new LineDrawer();
        this.drawExecutor.createFigure();

        if (this.drawExecutor.currentFigure) {
          this.map.addChild(this.drawExecutor.currentFigure);
        }
        break;
      }
      default:
        this.drawExecutor = new NoneDrawer();
    }
  }

  private removeCurrentListener(): void {
    if (this.currentListener) {
      this.map.removeChild(this.currentListener);
      this.currentListener = null;
    }
  }

  private extractDomCenter(center: LngLat): LngLat {
    const tempMarker = new ymaps3.YMapMarker({ coordinates: center });

    this.map.addChild(tempMarker);

    const transform = getComputedStyle(tempMarker.element.parentElement!).transform;
    const matchResult = transform.match(/\d+\.?\d+/g) ?? ['0', '0'];
    const domCenter: LngLat = [+matchResult[0], +matchResult[1]];

    this.map.removeChild(tempMarker);

    return domCenter;
  }

  private drawPolygonMarker(polygon: IPolygon): void {
    const marker = new this.markerCreator({
      coordinates: polygon.center,
      color: 'lavender',
      title: polygon.name,
      // @ts-ignore — size 'normal' не типизирован
      size: 'normal',
      iconName: 'fallback',
      onClick: () => this.events.emitPolygonClick(polygon),
    });

    this.map.addChild(marker);
    this.polygonMarkerToMapObjectMap.set(polygon.id, marker);
  }
}
