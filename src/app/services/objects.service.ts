import {inject, Injectable} from '@angular/core';
import {PolygonsStoreService} from './polygons-store.service';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  private readonly polygonsStoreService = inject(PolygonsStoreService);

  objects = this.polygonsStoreService.allPolygons;
}
