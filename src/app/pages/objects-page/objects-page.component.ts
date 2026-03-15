import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ObjectsService} from '../../services/objects.service';

@Component({
  selector: 'app-objects-page',
  imports: [],
  templateUrl: './objects-page.component.html',
  styleUrl: './objects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectsPageComponent {
  private readonly objectsService = inject(ObjectsService);

  objects = this.objectsService.objects;
}
