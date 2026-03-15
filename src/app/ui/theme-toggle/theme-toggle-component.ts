import {Component, inject} from '@angular/core';
import {Themes, ThemeService} from '../../services/theme.service';
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

  readonly THEMES = Themes;

  currentTheme = this.themeService.getCurrentTheme();

  onButtonClick() {
    this.themeService.toggle();
  }
}
