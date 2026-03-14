import { Component, inject, model } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-polygon-modal',
  templateUrl: './add-polygon-modal.component.html',
  styleUrl: './add-polygon-modal.component.scss',
  standalone: false,
})
export class AddPolygonModalComponent {
  readonly dialogRef: MatDialogRef<AddPolygonModalComponent> = inject(MatDialogRef<AddPolygonModalComponent>);

  name = model();

  save() {
    this.dialogRef.close(this.name());
  }
}
