import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeDirective } from '@core/directives/theme.directive';

@Component({
  selector: 'app-icon-accent-wrapper',
  templateUrl: './icon-accent-wrapper.component.html',
  styleUrl: './icon-accent-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    ThemeDirective,
  ]
})
export class IconAccentWrapper {

}
