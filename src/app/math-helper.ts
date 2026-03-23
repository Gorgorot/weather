import type { LngLat } from 'ymaps3';

const EARTH_RADIUS = 6371000; // метры

function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

function haversineDistance(a: LngLat, b: LngLat): number {
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h));
}

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

  /** Площадь полигона в м² (сферическая формула) */
  static getPolygonArea(points: LngLat[]): number {
    const n = points.length;
    if (n < 3) return 0;

    let sum = 0;
    for (let i = 0; i < n; i++) {
      const [lon1, lat1] = points[i];
      const [lon2, lat2] = points[(i + 1) % n];
      sum += toRad(lon2 - lon1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
    }

    return Math.abs(sum * EARTH_RADIUS * EARTH_RADIUS / 2);
  }

  /** Периметр полигона в метрах */
  static getPolygonPerimeter(points: LngLat[]): number {
    let perimeter = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
      perimeter += haversineDistance(points[i], points[(i + 1) % n]);
    }

    return perimeter;
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
