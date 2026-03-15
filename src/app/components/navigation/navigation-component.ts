import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-navigation',
  imports: [
    RouterLink,
    MatIcon,
    RouterLinkActive
  ],
  templateUrl: './navigation-component.html',
  styleUrl: './navigation-component.scss',
})
export class NavigationComponent {
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
