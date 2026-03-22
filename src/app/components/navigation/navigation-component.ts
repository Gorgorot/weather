import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ThemeDirective } from '../../directives/theme.directive';

@Component({
  selector: 'app-navigation',
  imports: [
    RouterLink,
    MatIcon,
    RouterLinkActive,
    MatTooltip
  ],
  hostDirectives: [
    ThemeDirective,
  ],
  templateUrl: './navigation-component.html',
  styleUrl: './navigation-component.scss',
})
export class NavigationComponent {
  collapsed = input(false);

  links = [
    {
      text: 'Карта',
      path: '/map',
      icon: 'map',
      description: 'Добавление объектов'
    },
    {
      text: 'Объекты',
      path: '/objects',
      icon: 'list_alt',
      description: 'Информация об объектах'
    }
  ];
}
