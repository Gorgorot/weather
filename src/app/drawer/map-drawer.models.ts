import type { LngLat, YMap, YMapFeature } from 'ymaps3';
import type { DomEvent, DomEventHandlerObject } from '@yandex/ymaps3-types/imperative/YMapListener';

export enum DrawingMode {
  NONE,
  LINE,
}

export class MapDrawerBaseExecutor<T = LngLat> {
  coordinates: T[] = [];
  currentFigure: YMapFeature | null;
  isRemovable: boolean = false;

  constructor() {
  }

  clickAction(object: DomEventHandlerObject, event: DomEvent): YMapFeature | null {
    return null;
  }

  createFigure(): YMapFeature | null {
    return null;
  }

  rightClickAction(...args: any[]): YMapFeature | null {
    return null;
  }
}
