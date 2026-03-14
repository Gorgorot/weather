import {Component, inject} from '@angular/core';
import {ThemeService} from '../../services/theme.service';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-theme-toggle',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './theme-toggle-component.html',
  styleUrl: './theme-toggle-component.scss',
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  onButtonClick() {
    this.themeService.toggle();
  }
}
