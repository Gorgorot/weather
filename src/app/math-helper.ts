import type { LngLat } from 'ymaps3';

export class MathHelper {
  static getPolygonCenter(points: LngLat[]): LngLat {
    let area = 0;
    let cx = 0;
    let cy = 0;

    const n = points.length;

    for (let i = 0; i < n; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[(i + 1) % n];

      const cross = x1 * y2 - x2 * y1;
      area += cross;
      cx += (x1 + x2) * cross;
      cy += (y1 + y2) * cross;
    }

    area *= 0.5;
    cx /= 6 * area;
    cy /= 6 * area;

    return [cx, cy];
  }

  static randomHexColor(): string {
    return '#' + Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0');
  }

  static addAlphaToHex(hex: string, opacity: number): string {
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0');

    return hex + alpha;
  }
}
