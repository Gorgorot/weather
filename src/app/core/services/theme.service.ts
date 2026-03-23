import { Injectable, signal } from '@angular/core';

export enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
}

const THEME_KEY = 'THEME_KEY';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme = signal<Themes>((localStorage.getItem(THEME_KEY) as Themes) ?? Themes.DARK);

  init(): void {
    const currentTheme = this.currentTheme();

    this.setTheme(currentTheme === Themes.LIGHT ? Themes.LIGHT : Themes.DARK);
  }

  toggle() {
    const theme = this.currentTheme();

    this.setTheme(theme === Themes.DARK ? Themes.LIGHT : Themes.DARK);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  private setTheme(theme: Themes) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    this.currentTheme.set(theme);
  }
}
