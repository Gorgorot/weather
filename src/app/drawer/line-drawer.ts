import { DomEvent, DomEventHandlerObject } from '@yandex/ymaps3-types/imperative/YMapListener';
import { MapDrawerBaseExecutor } from './map-drawer.models';

export class LineDrawer extends MapDrawerBaseExecutor {
  override isRemovable = true;
  readonly maxPointsCount = 4;

  constructor() {
    super();
  }

  override clickAction(object: DomEventHandlerObject, event: DomEvent) {
    if (!this.currentFigure) {
      return null;
    }

    this.coordinates.push(event.coordinates);

    this.currentFigure.update({
      geometry: {
        type: 'LineString',
        coordinates: this.coordinates,
      }
    });

    return this.currentFigure;
  }

  override createFigure() {
    const line = new ymaps3.YMapFeature({
      geometry: {
        type: 'LineString',
        coordinates: [],
      },
      style: {
        simplificationRate: 0,
        stroke: [{color: '#196DFF', dash: [8, 8], width: 4}]
      }
    });

    this.currentFigure = line;

    return line;
  }

  override rightClickAction() {
    return new ymaps3.YMapFeature({
      geometry: {
        type: 'Polygon',
        coordinates: [this.coordinates],
      },
      style: {
        stroke: [
          {
            color: '#196DFF99',
            width: 3
          }
        ],
        fill: '#196DFF14'
      }
    });
  }
}
