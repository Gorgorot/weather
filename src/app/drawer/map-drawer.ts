import type { DomEventHandler, LngLat, YMap, YMapFeature } from 'ymaps3';
import { noop } from 'rxjs';
import { LineDrawer } from './line-drawer';
import { DrawingMode, MapDrawerBaseExecutor } from './map-drawer.models';
import { YMapEntity } from '@yandex/ymaps3-types/imperative/YMapEnities';
import { Constructor } from '@angular/cdk/schematics';


export class MapDrawer {
  private _map: YMap;
  private _drawingMode: DrawingMode = DrawingMode.NONE;
  private _drawExecutor: MapDrawerBaseExecutor | null = null;

  constructor(map: YMap) {
    this.init(map);
  }

  private init(map: YMap) {
    this._map = map;
  }

  setDrawMode(drawingMode: DrawingMode) {
    this._drawingMode = drawingMode;

    this.selectExecutorByMode();

    const mapListener = new ymaps3.YMapListener({
      layer: 'any',
      onClick: this._drawExecutor!.clickAction.bind(this._drawExecutor),
      onContextMenu: () => {
        const result = this._drawExecutor!.rightClickAction();

        if (result instanceof ymaps3.YMapFeature) {
          this._map.addChild(result);
        }

        if (this._drawExecutor!.isRemovable) {
          this._map.removeChild(this._drawExecutor!.currentFigure!);
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
    this._drawExecutor = new LineDrawer();

    this._drawExecutor.createFigure();

    this._map.addChild(this._drawExecutor.currentFigure!);
  }
}
