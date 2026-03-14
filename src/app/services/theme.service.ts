import {Injectable} from '@angular/core';

export enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
}

const THEME_KEY = 'THEME_KEY';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  init(): void {
    const currentTheme = this.getCurrentTheme();

    this.setTheme(currentTheme === Themes.LIGHT ? Themes.LIGHT : Themes.DARK);
  }

  toggle() {
    const theme = this.getCurrentTheme();

    this.setTheme(theme === Themes.DARK ? Themes.LIGHT : Themes.DARK);
  }

  private setTheme(theme: Themes) {
    document.documentElement.setAttribute('data-theme', theme);

    localStorage.setItem(THEME_KEY, theme);
  }

  private getCurrentTheme() {
    return localStorage.getItem(THEME_KEY);
  }
}
