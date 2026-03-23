import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { RouterOutlet } from '@angular/router';
import { MainSectionComponent } from '@layout/main-section/main-section.component';
import { NavigationComponent } from '@layout/navigation/navigation-component';
import { HeaderComponent } from '@layout/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    RouterOutlet,
    MainSectionComponent,
    NavigationComponent,
    HeaderComponent,
  ],
})
export class App implements OnInit {
  appName = environment.appName;

  ngOnInit() {
    document.title = this.appName;
  }
}
