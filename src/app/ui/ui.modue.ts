import { NgModule } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MapViewModule } from './map-view/map-view.module';
import { ICONS } from './icons';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
    MapViewModule,
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class UiModule {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  private registerIcons() {
    ICONS.forEach(icon => {
      this.iconRegistry.addSvgIcon(icon.name, this.sanitizer.bypassSecurityTrustResourceUrl(icon.fileName));
    })
  }
}
