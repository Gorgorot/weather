import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IPolygon } from '../../../../../services/polygons-store.service';
import { PolygonSettings } from './polygon-settings-section';
import { MapService } from '../../../map.service';

@Component({
  selector: 'app-polygon-settings-component',
  templateUrl: './polygon-settings-component.html',
  styleUrl: './polygon-settings-component.scss',
  standalone: false,
})
export class PolygonSettingsComponent implements OnInit {
  mapsService = inject(MapService);
  dialogRef = inject<MatDialogRef<PolygonSettingsComponent>>(MatDialogRef);
  data: IPolygon = inject(MAT_DIALOG_DATA);
  sections: PolygonSettings[] = [];

  ngOnInit() {

    this.sections = this.data.requestedParameters!.map(item => {
      return new PolygonSettings(item.type, item.selected);
    });
  }

  save() {
    const parameters = this.sections.map(section => section.toPolygonSetting());

    this.mapsService.updatePolygon({
      ...this.data,
      requestedParameters: parameters,
    })
      .subscribe(() => this.close())
  }

  close() {
    this.dialogRef.close();
  }
}
