import { DomEvent, DomEventHandlerObject } from '@yandex/ymaps3-types/imperative/YMapListener';
import { MapDrawerBaseExecutor } from './map-drawer.models';
import type { DrawingStyle, YMapFeatureProps } from 'ymaps3';
import { MathHelper } from '@shared/utils/math-helper';

export class LineDrawer extends MapDrawerBaseExecutor {
  override isRemovable = true;
  readonly maxPointsCount = 4;

  readonly baseColor = MathHelper.randomHexColor();
  override drawingStyle: DrawingStyle = {
    stroke: [
      {
        color: this.baseColor,
        width: 3
      }
    ],
    fill: MathHelper.addAlphaToHex(this.baseColor, .6)
  };

  clickAction(object: DomEventHandlerObject, event: DomEvent) {
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

  createFigure() {
    const line = new ymaps3.YMapFeature({
      geometry: {
        type: 'LineString',
        coordinates: [],
      },
      style: {
        simplificationRate: 0,
        stroke: [{ color: this.baseColor, dash: [8, 8], width: 4 }]
      }
    });

    this.currentFigure = line;

    return line;
  }

  rightClickAction(): YMapFeatureProps {
    return {
      geometry: {
        type: 'Polygon',
        coordinates: [this.coordinates],
      },
      style: this.drawingStyle,
    };
  }
}
