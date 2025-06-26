declare module '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions' {
  import { IControl } from 'mapbox-gl';

  interface Route {
    distance: number;
    duration: number;
  }

  export default class MapboxDirections implements IControl {
    constructor(options?: any);

    onAdd(map: mapboxgl.Map): HTMLElement;

    onRemove(): void;

    setOrigin(coord: [number, number] | string): void;

    setDestination(coord: [number, number] | string): void;

    on(type: 'route', listener: (e: { route: Route[] }) => void): void;
  }
}
