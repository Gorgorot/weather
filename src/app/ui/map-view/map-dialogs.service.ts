import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class MapDialogsService extends MatDialog {
  constructor() {
    super();
  }
}
