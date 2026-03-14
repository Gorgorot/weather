import { Component, inject, OnInit } from '@angular/core';
import { MapService } from './ui/map-view/map.service';
import { environment } from '../environments/environment';

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
    document.title = this.appName;
  }
}
