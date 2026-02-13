import { NgModule } from '@angular/core';
import { MapViewComponent } from './map-view.component';
import { MapWeatherCardComponent } from './components/map-weather-card/map-weather-card.component';
import { MatIcon } from '@angular/material/icon';
import { UiModule } from '../ui.modue';
import { SearchComponent } from './components/search/search.component';
import { MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';

@NgModule({
  declarations: [
    MapViewComponent,
    MapWeatherCardComponent,
    SearchComponent,
  ],
  imports: [
    MatIcon,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatInput,
  ],
  exports: [
    MapViewComponent,
    MapWeatherCardComponent,
  ]
})
export class MapViewModule {

}
