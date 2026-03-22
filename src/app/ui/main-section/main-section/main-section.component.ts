import { Component, signal } from '@angular/core';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { ThemeDirective } from '../../../directives/theme.directive';

@Component({
  selector: 'app-main-section',
  imports: [
    MatDrawerContainer,
    MatDrawer
  ],
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
