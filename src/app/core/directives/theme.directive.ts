import { Directive, effect, ElementRef, inject } from '@angular/core';
import { Themes, ThemeService } from '../services/theme.service';

@Directive({
  selector: '[appTheme]',
})
export class ThemeDirective {
  private readonly themeService = inject(ThemeService);

  constructor(elementRef: ElementRef) {
    effect(() => {
      const theme = this.themeService.getCurrentTheme()();

      if (theme === Themes.DARK) {
        elementRef.nativeElement.classList.add('dark-theme');
        elementRef.nativeElement.classList.remove('light-theme');
      } else {
        elementRef.nativeElement.classList.remove('dark-theme');
        elementRef.nativeElement.classList.add('light-theme');
      }
    });
  }
}
