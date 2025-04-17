declare module 'leaflet' {
  export * from 'leaflet';
  
  export interface MapOptions {
    center?: [number, number];
    zoom?: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
    className?: string;
  }
  
  export interface Icon {
    options: any;
  }
  
  export class Icon {
    constructor(options: any);
    static Default: {
      mergeOptions(options: any): void;
      prototype: any;
    };
  }
}

declare module 'react-leaflet' {
  import L from 'leaflet';
  import React from 'react';

  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }

  export interface TileLayerProps {
    attribution?: string;
    url: string;
  }

  export interface MarkerProps {
    position: [number, number] | number[];
    icon?: any;
    eventHandlers?: {
      click?: () => void;
      [key: string]: (() => void) | undefined;
    };
    children?: React.ReactNode;
  }

  export interface PopupProps {
    children?: React.ReactNode;
  }

  export interface MapContextProps {
    map: L.Map;
  }

  export class MapContainer extends React.Component<MapContainerProps> {}
  export class TileLayer extends React.Component<TileLayerProps> {}
  export class Marker extends React.Component<MarkerProps> {}
  export class Popup extends React.Component<PopupProps> {}
  
  export function useMap(): L.Map;
}