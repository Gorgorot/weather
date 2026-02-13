import { NgModule } from '@angular/core';
import { SearchComponent } from './map-view/components/search/search.component';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MapViewComponent } from './map-view/map-view.component';
import { MatIconButton } from '@angular/material/button';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MapWeatherCardComponent } from './map-view/components/map-weather-card/map-weather-card.component';
import { MapViewModule } from './map-view/map-view.module';

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

}
