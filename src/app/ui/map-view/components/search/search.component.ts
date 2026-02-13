import { Component, forwardRef, HostBinding, inject, OnInit, output, signal } from '@angular/core';
import { MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, noop, of, switchAll, switchMap } from 'rxjs';
import { MatIconButton } from '@angular/material/button';
import { DaDataService, IDaDataSuggestion } from '../../../../services/da-data.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search',
  standalone: false,
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
