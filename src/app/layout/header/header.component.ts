import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle-component';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    ThemeToggleComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
}
