import type { DrawingStyle, LngLat, YMapFeature, YMapFeatureProps } from 'ymaps3';
import type { DomEvent, DomEventHandlerObject } from '@yandex/ymaps3-types/imperative/YMapListener';

export enum DrawingMode {
  NONE,
  LINE,
}

export abstract class MapDrawerBaseExecutor<T = LngLat> {
  coordinates: T[] = [];
  currentFigure: YMapFeature | null = null;
  isRemovable: boolean = false;
  drawingStyle: DrawingStyle = {};

  abstract clickAction(object: DomEventHandlerObject, event: DomEvent): YMapFeature | null;

  abstract createFigure(): YMapFeature | null;

  abstract rightClickAction(...args: any[]): YMapFeatureProps | null;
}
