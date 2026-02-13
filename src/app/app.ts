import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapViewComponent } from './ui/map-view/map-view.component';
import { AppModule, MAP_API_KEY } from './app.module';
import { MapService } from './services/map.service';
import { HeaderComponent } from './ui/header/header.component';
import { environment } from '../environments/environment';
import { MainSectionComponent } from './ui/main-section/main-section/main-section.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: false,
})
export class App implements OnInit {
  mapService = inject(MapService);
  appName = environment.appName;

  ngOnInit() {
    this.mapService.loadApi();
    document.title = this.appName;
  }
}
