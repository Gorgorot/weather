import {Component, OnInit, viewChild} from '@angular/core';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';

@Component({
  selector: 'app-main-section',
  imports: [
    MatDrawerContainer,
    MatDrawer
  ],
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.scss',
})
export class MainSectionComponent implements OnInit {
  drawer = viewChild<MatDrawer>('drawer');

  ngOnInit() {
  }

  toggleSidenav() {
    this.drawer()?.toggle();
  }
}
