import { Component, signal } from '@angular/core';
import { ThemeDirective } from '@core/directives/theme.directive';

@Component({
  selector: 'app-main-section',
  imports: [],
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.scss',
  hostDirectives: [
    ThemeDirective,
  ]
})
export class MainSectionComponent {
  collapsed = signal(false);

  toggleSidenav() {
    this.collapsed.update(v => !v);
  }
}
