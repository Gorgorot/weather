import { Component, inject, model } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-add-polygon-modal',
  templateUrl: './add-polygon-modal.component.html',
  styleUrl: './add-polygon-modal.component.scss',
  imports: [
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    FormsModule,
    MatIcon,
    MatIconButton,
  ],
})
export class AddPolygonModalComponent {
  readonly dialogRef: MatDialogRef<AddPolygonModalComponent> = inject(MatDialogRef<AddPolygonModalComponent>);

  name = model();

  save() {
    this.dialogRef.close(this.name());
  }
}
