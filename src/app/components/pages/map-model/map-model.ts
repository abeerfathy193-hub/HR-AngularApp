import { Component } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map-model',
  imports: [GoogleMap, MapMarker],
  templateUrl: './map-model.html',
  styleUrl: './map-model.css',
})
export class MapModel {
  zoom = 15;

  center: google.maps.LatLngLiteral = {
    lat: 30.0444,   // Default Cairo latitude
    lng: 31.2357    // Default Cairo longitude
  };

  marker: google.maps.LatLngLiteral | null = null;

  markerOptions: google.maps.MarkerOptions = {
    draggable: true
  };

  latitude!: number;
  longitude!: number;

  placeMarker(event: google.maps.MapMouseEvent) {
    this.marker = event.latLng!.toJSON();
    this.latitude = this.marker.lat;
    this.longitude = this.marker.lng;
  }

  updateMarkerPosition(event: any) {
    const mouseEvent = event as google.maps.MapMouseEvent;
    this.marker = mouseEvent.latLng!.toJSON();
    this.latitude = this.marker.lat;
    this.longitude = this.marker.lng;
  }

}
