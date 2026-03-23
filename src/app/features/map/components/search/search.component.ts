import { Component, inject, OnInit, output, signal } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, of, switchMap } from 'rxjs';
import { MatIconButton } from '@angular/material/button';
import { DaDataService, IDaDataSuggestion } from '../../services/da-data.service';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';

@Component({
  selector: 'app-search',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatIconButton,
    ReactiveFormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  host: {
    '[class.collapsed]': 'collapsed()'
  },
})
export class SearchComponent implements OnInit {
  daDataService = inject(DaDataService);

  optionSelected = output<IDaDataSuggestion>();

  private _value: any = null;
  collapsed = signal(true);
  suggestions = signal<IDaDataSuggestion[]>([]);

  formControl: FormControl = new FormControl('');

  ngOnInit() {
    this.formControl
      .valueChanges
      .pipe(
        debounceTime(200),
        switchMap(value => {
          if (value) {
            return this.daDataService.requestCities({
              query: value,
            });
          }

          return of(null);
        }),
      )
      .subscribe(value => this.suggestions.set(value ?? []));
  }

  toggle() {
    this.collapsed.update(value => !value);
  }

  onCitySelected(event: MatAutocompleteSelectedEvent) {
    const suggestions = this.suggestions();
    const selected = suggestions.find(s => s.value === event.option.value);

    this.optionSelected.emit(selected!);
  }
}
