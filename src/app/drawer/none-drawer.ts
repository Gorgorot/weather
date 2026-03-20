import type { YMapFeature, YMapFeatureProps } from 'ymaps3';
import type { DomEvent, DomEventHandlerObject } from '@yandex/ymaps3-types/imperative/YMapListener';
import { MapDrawerBaseExecutor } from './map-drawer.models';

export class NoneDrawer extends MapDrawerBaseExecutor {
  clickAction(object: DomEventHandlerObject, event: DomEvent): YMapFeature | null {
    return null;
  }

  createFigure(): YMapFeature | null {
    return null;
  }

  rightClickAction(): YMapFeatureProps | null {
    return null;
  }
}
