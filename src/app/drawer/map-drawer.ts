import { DrawingStyle, LngLat, YMap, YMapFeature, YMapLocationRequest } from 'ymaps3';
import { LineDrawer } from './line-drawer';
import { DrawingMode, MapDrawerBaseExecutor } from './map-drawer.models';
import { YMapEntity } from '@yandex/ymaps3-types/imperative/YMapEnities';
import { Constructor } from '@angular/cdk/schematics';
import { EventEmitter } from '@angular/core';
import type { Geometry } from '@yandex/ymaps3-types/imperative/YMapFeature/types';
import type { DomEvent } from '@yandex/ymaps3-types/imperative/YMapListener';
import { MathHelper } from '../math-helper';
import { IPolygon } from '../services/polygons-store.service';
import type { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';
import { NoneDrawer } from './none-drawer';


export interface IMapDrawerAddPolygonEvent {
  geometry: Geometry;
  style: DrawingStyle | undefined;
  center: LngLat;
  domCenter: LngLat;
  data: DomEvent;
}

export class MapDrawer {
  private _map: YMap;
  private _drawingMode: DrawingMode = DrawingMode.NONE;
  private _drawExecutor: MapDrawerBaseExecutor | null = null;
  onAddPolygon = new EventEmitter<IMapDrawerAddPolygonEvent>();
  onPolygonClick = new EventEmitter<IPolygon>();
  onDrawingModeChange = new EventEmitter<DrawingMode>();
  private markerCreator: typeof YMapDefaultMarker;
  private polygonToMapObjectMap = new Map<string, YMapFeature>();
  private polygonMarkerToMapObjectMap = new Map<string, YMapDefaultMarker>();

  constructor(map: YMap) {
    this._map = map;
  }

  async init() {
    // @ts-ignore
    const { YMapDefaultMarker } = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    this.markerCreator = YMapDefaultMarker;
  }

  setDrawMode(drawingMode: DrawingMode) {
    if (this._drawingMode === drawingMode) {
      return;
    }

    this._drawingMode = drawingMode;

    this.onDrawingModeChange.emit(drawingMode);
    this.selectExecutorByMode();

    const mapListener = new ymaps3.YMapListener({
      layer: 'any',
      onClick: this._drawExecutor!.clickAction.bind(this._drawExecutor),
      onContextMenu: (obj, event) => {
        const result = this._drawExecutor!.rightClickAction();
        const coordinates = result?.geometry.coordinates[0] as LngLat[];

        if (coordinates?.length) {
          if (this._drawExecutor!.isRemovable) {
            this._map.removeChild(this._drawExecutor!.currentFigure!);
          }

          const center = MathHelper.getPolygonCenter(coordinates);

          this.onAddPolygon.emit({
            geometry: result!.geometry,
            style: this._drawExecutor!.drawingStyle,
            data: event,
            center,
            domCenter: this.extractDomCenter(center),
          });
        }

        this.setDrawMode(DrawingMode.NONE);
      },
    });

    const currentListenerIndex = this.findEntityIndex(ymaps3.YMapListener);

    this.removeFromMap(currentListenerIndex);

    this._map.addChild(mapListener);
  }

  findEntityIndex(entity: Constructor<YMapEntity<any>>) {
    return this._map.children.findIndex(v => v instanceof entity);
  }

  findMemberIndex(member: YMapEntity<any>) {
    return this._map.children.findIndex(v => v === member);
  }

  removeFromMap(index: number) {
    if (index !== -1) {
      this._map.children.splice(index, 1);
    }
  }

  selectExecutorByMode() {
    switch (this._drawingMode) {
      case DrawingMode.LINE: {
        this._drawExecutor = new LineDrawer();

        this._drawExecutor.createFigure();

        return this._map.addChild(this._drawExecutor.currentFigure!);
      }
      default:
        return this._drawExecutor = new NoneDrawer();
    }
  }

  focusMapOnLocation(location: YMapLocationRequest) {
    this._map.setLocation(location);
  }

  focus() {
  }

  extractDomCenter(center: LngLat): LngLat {
    const popupWithImage = new ymaps3.YMapMarker({
      coordinates: center,
      onClick(ob, e) {
        console.log(e);
      },
    });

    this._map.addChild(popupWithImage);

    const matchResult = getComputedStyle(popupWithImage.element.parentElement!).transform.match(/\d+\.?\d+/g) ?? [0, 0];

    return [+matchResult[0], +matchResult[1]];
  }

  drawPolygons(polygons: IPolygon[]): void {
    polygons.forEach(polygon => this.drawPolygon(polygon));
  }

  drawPolygon(polygon: IPolygon): void {
    const obj = new ymaps3.YMapFeature({
      geometry: polygon.geometry,
      style: polygon.style,
    });

    this._map.addChild(obj);

    this.polygonToMapObjectMap.set(polygon.id, obj);

    this.drawPolygonMarker(polygon);
  }

  drawPolygonMarker(polygon: IPolygon) {
    const marker = new this.markerCreator({
      coordinates: polygon.center,
      color: 'lavender',
      title: polygon.name,
      // @ts-ignore
      size: 'normal',
      iconName: 'fallback',
      onClick: () => this.onPolygonClick.emit(polygon),
    });

    this._map.addChild(marker);

    this.polygonMarkerToMapObjectMap.set(polygon.id, marker);
  }

  removePolygon(polygon: IPolygon): void {
    const mapObject = this.polygonToMapObjectMap.get(polygon.id);
    const mapMarker = this.polygonMarkerToMapObjectMap.get(polygon.id);

    if (!mapObject || !mapMarker) {
      return;
    }

    this._map.removeChild(mapObject);
    this._map.removeChild(mapMarker);
  }
}
