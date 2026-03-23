import { Component, inject } from '@angular/core';
import { MapService } from '../../../services/map.service';
import { IPolygon } from '../../../../weather/services/polygons-store.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PolygonSettingsComponent } from '../polygon-settings/polygon-settings-component';
import { MatList, MatListItem, MatListItemMeta } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

export enum PolygonsListAction {
  FOCUS = 'FOCUS',
  REMOVE = 'REMOVE',
  EDIT = 'EDIT',
}

export interface IPolygonsListResult {
  polygon: IPolygon;
  action: PolygonsListAction;
}

@Component({
  selector: 'app-polygons-list-component',
  templateUrl: './polygons-list-component.html',
  styleUrl: './polygons-list-component.scss',
  imports: [
    MatList,
    MatListItem,
    MatListItemMeta,
    MatIcon,
    MatIconButton,
    MatTooltip,
  ],
})
export class PolygonsListComponent {
  mapService = inject(MapService);
  matDialog = inject(MatDialog);
  bottomSheetRef = inject<MatBottomSheetRef<PolygonsListComponent>>(MatBottomSheetRef);

  polygons = this.mapService.polygons;

  PolygonsListAction = PolygonsListAction;

  onListItemClick(polygon: IPolygon, action: PolygonsListAction) {
    switch (action) {
      case PolygonsListAction.FOCUS: {
        this.mapService.selectPolygon(polygon);
        break;
      }
      case PolygonsListAction.EDIT: {
        return this.matDialog.open(PolygonSettingsComponent, { data: polygon });
      }
      case PolygonsListAction.REMOVE: {
        return this.mapService.removePolygon(polygon);
      }
      default: {
        return;
      }
    }
    this.bottomSheetRef.dismiss(<IPolygonsListResult>{ polygon, action });
  }
}
