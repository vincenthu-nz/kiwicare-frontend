'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { OrdersTable } from '@/app/lib/definitions';
import { Feature } from "geojson";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function MapboxMap(
  {
    order,
  }: {
    order: OrdersTable;
  }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const origin: [number, number] = [
    order.customer_longitude,
    order.customer_latitude,
  ];

  const destination: [number, number] = [
    order.provider_longitude,
    order.provider_latitude,
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: origin,
      zoom: 13,
      attributionControl: false,
    });

    function addCustomMarker(
      coordinates: [number, number],
      imgUrl: string,
      name: string,
      isCustomer: boolean = false,
    ) {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';

      const avatar = document.createElement('div');
      avatar.style.backgroundImage = `url(${imgUrl})`;
      avatar.style.width = '48px';
      avatar.style.height = '48px';
      avatar.style.borderRadius = '50%';
      avatar.style.backgroundSize = 'cover';
      avatar.style.boxShadow = '0 0 0 2px white';

      avatar.addEventListener('click', () => {
      });

      const label = document.createElement('div');
      label.innerHTML = `${name}<br><span style="display:block; text-align:center; color: gray;">${isCustomer ? '(Customer)' : '(Provider)'}</span>`;
      label.style.marginTop = '4px';
      label.style.color = '#111';
      label.style.fontWeight = 'bold';
      label.style.fontSize = '12px';
      label.style.background = 'white';
      label.style.padding = '2px 6px';
      label.style.borderRadius = '4px';
      label.style.boxShadow = '0 0 2px rgba(0,0,0,0.3)';

      container.appendChild(avatar);
      container.appendChild(label);

      new mapboxgl.Marker(container).setLngLat(coordinates).addTo(map);
    }

    map.on('load', async () => {
      addCustomMarker(origin, order.customer_avatar, order.customer_name, true);
      addCustomMarker(destination, order.provider_avatar, order.provider_name);

      let routeGeoJson = order.route_geometry;

      // If no stored route exists → call the Directions API to generate one.
      if (!routeGeoJson) {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.join(',')};${destination.join(',')}?geometries=geojson&access_token=${mapboxgl.accessToken}`
        );
        const json = await query.json();
        const route = json.routes?.[0];

        if (!route?.geometry || !route?.geometry.coordinates) {
          console.warn('Route geometry missing');
          return;
        }

        routeGeoJson = route.geometry;
      }

      const geojson: Feature = {
        type: 'Feature',
        geometry: routeGeoJson,
        properties: {},
      };

      map.addSource('route', {
        type: 'geojson',
        data: geojson,
      });

      map.addLayer({
        id: 'route-casing',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#bbbbbb',
          'line-width': 12,
        },
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#2563eb',
          'line-width': 8,
        },
      });

      const bounds = new mapboxgl.LngLatBounds(origin, origin);
      routeGeoJson.coordinates.forEach((coord) =>
        bounds.extend(coord as [number, number]),
      );
      map.fitBounds(bounds, { padding: 60 });
    });

    mapRef.current = map;

    const recenterButton = document.createElement('button');
    recenterButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
        <path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    `;
    recenterButton.style.position = 'absolute';
    recenterButton.style.top = '12px';
    recenterButton.style.right = '12px';
    recenterButton.style.zIndex = '10';
    recenterButton.style.backgroundColor = '#fff';
    recenterButton.style.border = '1px solid #ccc';
    recenterButton.style.borderRadius = '4px';
    recenterButton.style.padding = '4px 10px';
    recenterButton.style.cursor = 'pointer';
    recenterButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

    map.getContainer().appendChild(recenterButton);

    recenterButton.addEventListener('click', () => {
      const bounds = new mapboxgl.LngLatBounds(origin, origin);
      const source = map.getSource('route') as mapboxgl.GeoJSONSource;
      const data = source?.serialize?.().data as Feature;

      if (data && data.geometry.type === 'LineString') {
        const coords = data.geometry.coordinates as [number, number][];
        coords.forEach((coord) => bounds.extend(coord));
        map.fitBounds(bounds, { padding: 60 });
      }
    });

    return () => {
      if (recenterButton && map.getContainer().contains(recenterButton)) {
        map.getContainer().removeChild(recenterButton);
      }
      
      map.remove();
    };
  }, [
    origin,
    destination,
    order.customer_avatar,
    order.provider_avatar,
    order.customer_name,
    order.provider_name,
  ]);

  return (
    <div
      ref={mapContainerRef}
      className="h-[400px] w-full rounded-lg sm:h-[670px]"
    />
  );
}
