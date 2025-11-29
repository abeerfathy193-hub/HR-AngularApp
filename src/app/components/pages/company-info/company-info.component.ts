import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMap, MapMarker, MapCircle } from '@angular/google-maps';
import { CompanyService, Company, CompanyCreateDto, CompanyUpdateDto } from '../../../services/company.service';

declare const google: any;

@Component({
  selector: 'app-company-info',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMap, MapMarker, MapCircle, ReactiveFormsModule],
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.css'
})
export class CompanyInfoComponent implements OnInit {
  CompanyForm = new FormGroup({
    CompanyName: new FormControl('', Validators.required),
});
  companies: Company[] = [];
  selectedCompany: Company | null = null;
  isEditing = false;
  isCreating = false;
  loading = false;
  error: string | null = null;

  formData: CompanyCreateDto | CompanyUpdateDto = {
    name: '',
    address: '',
    latitude: null,
    longitude: null,
    radiusInMeters: null,
    phone: '',
    email: '',
    website: '',
    taxId: '',
    registrationNumber: ''
  };

  private readonly DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 30.0444, lng: 31.2357 };
  private readonly DEFAULT_RADIUS = 100;

  showMapModal = false;
  mapCenter: google.maps.LatLngLiteral = { ...this.DEFAULT_CENTER };
  mapZoom = 15;
  markerPosition: google.maps.LatLngLiteral | null = null;
  mapRadius = this.DEFAULT_RADIUS;
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  circleOptions: google.maps.CircleOptions = {
    strokeColor: '#0d6efd',
    strokeOpacity: 0.6,
    strokeWeight: 2,
    fillColor: '#0d6efd',
    fillOpacity: 0.15
  };
  mapError: string | null = null;
  geocoding = false;
  private geocoder?: google.maps.Geocoder;
  pendingSelection: { lat: number; lng: number; radius: number; address: string } | null = null;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.error = null;
    this.companyService.getAll().subscribe({
      next: (data) => {
        this.companies = data;
        if (data.length > 0 && !this.selectedCompany) {
          this.selectCompany(data[0]);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load companies';
        this.loading = false;
        console.error(err);
      }
    });
  }

  selectCompany(company: Company): void {
    this.selectedCompany = company;
    this.isEditing = false;
    this.isCreating = false;
    this.formData = { ...company };
    this.ensureFormLocationDefaults();
  }

  startCreate(): void {
    this.isCreating = true;
    this.isEditing = false;
    this.selectedCompany = null;
    this.formData = {
      name: '',
      address: '',
      latitude: null,
      longitude: null,
      radiusInMeters: null,
      phone: '',
      email: '',
      website: '',
      taxId: '',
      registrationNumber: ''
    };
  }

  startEdit(): void {
    if (this.selectedCompany) {
      this.isEditing = true;
      this.isCreating = false;
      this.formData = { ...this.selectedCompany };
      this.ensureFormLocationDefaults();
    }
  }

  cancel(): void {
    this.isEditing = false;
    this.isCreating = false;
    if (this.selectedCompany) {
      this.formData = { ...this.selectedCompany };
      this.ensureFormLocationDefaults();
    }
  }

  save(): void {
    if (this.isCreating) {
      this.createCompany();
    } else if (this.isEditing && this.selectedCompany) {
      this.updateCompany();
    }
  }

  createCompany(): void {
    this.loading = true;
    this.error = null;
    this.companyService.create(this.formData as CompanyCreateDto).subscribe({
      next: (company) => {
        this.companies.push(company);
        this.selectCompany(company);
        this.isCreating = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to create company';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateCompany(): void {
    if (!this.selectedCompany) return;
    
    this.loading = true;
    this.error = null;
    this.companyService.update(this.selectedCompany.id, this.formData as CompanyUpdateDto).subscribe({
      next: (company) => {
        const index = this.companies.findIndex(c => c.id === company.id);
        if (index !== -1) {
          this.companies[index] = company;
        }
        this.selectCompany(company);
        this.isEditing = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update company';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteCompany(id: number): void {
    if (!confirm('Are you sure you want to delete this company?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.companyService.delete(id).subscribe({
      next: () => {
        this.companies = this.companies.filter(c => c.id !== id);
        if (this.selectedCompany?.id === id) {
          this.selectedCompany = this.companies.length > 0 ? this.companies[0] : null;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to delete company';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get hasLocation(): boolean {
    return this.formData.latitude != null && this.formData.longitude != null;
  }

  get previewCenter(): google.maps.LatLngLiteral {
    if (this.hasLocation) {
      return {
        lat: Number(this.formData.latitude),
        lng: Number(this.formData.longitude)
      };
    }
    return { ...this.DEFAULT_CENTER };
  }

  openMapModal(): void {
    const lat = this.formData.latitude ?? this.DEFAULT_CENTER.lat;
    const lng = this.formData.longitude ?? this.DEFAULT_CENTER.lng;
    this.markerPosition = { lat, lng };
    this.mapCenter = { lat, lng };
    this.mapRadius = this.formData.radiusInMeters ?? this.DEFAULT_RADIUS;
    this.pendingSelection = {
      lat,
      lng,
      radius: this.mapRadius,
      address: this.formData.address ?? ''
    };
    this.mapError = null;
    this.showMapModal = true;
  }

  closeMapModal(): void {
    this.showMapModal = false;
    this.pendingSelection = null;
    this.mapError = null;
  }

  handleMapClick(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent | Event): void {
    const mapEvent = event as google.maps.MapMouseEvent;
    if (!mapEvent.latLng) return;
    this.setMarker(mapEvent.latLng.lat(), mapEvent.latLng.lng());
  }

  handleMarkerDrag(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent | Event): void {
    const mapEvent = event as google.maps.MapMouseEvent;
    if (!mapEvent.latLng) return;
    this.setMarker(mapEvent.latLng.lat(), mapEvent.latLng.lng());
  }

  handleRadiusChange(value: number | string | null): void {
    const numericValue = typeof value === 'string' ? Number(value) : value;
    const sanitized = numericValue && numericValue > 0 ? numericValue : this.DEFAULT_RADIUS;
    this.mapRadius = sanitized;
    if (this.pendingSelection) {
      this.pendingSelection.radius = sanitized;
    } else {
      this.pendingSelection = {
        lat: this.markerPosition?.lat ?? this.DEFAULT_CENTER.lat,
        lng: this.markerPosition?.lng ?? this.DEFAULT_CENTER.lng,
        radius: sanitized,
        address: this.formData.address ?? ''
      };
    }
  }

  applyMapSelection(): void {
    if (!this.markerPosition || !this.pendingSelection) {
      this.mapError = 'Please pick a location on the map.';
      return;
    }

    this.formData = {
      ...this.formData,
      address: this.pendingSelection.address || this.formData.address,
      latitude: this.markerPosition.lat,
      longitude: this.markerPosition.lng,
      radiusInMeters: this.pendingSelection.radius
    };
    this.mapRadius = this.pendingSelection.radius;
    this.closeMapModal();
  }

  private setMarker(lat: number, lng: number): void {
    this.markerPosition = { lat, lng };
    this.mapCenter = { lat, lng };
    const address = this.pendingSelection?.address ?? this.formData.address ?? '';
    const radius = this.pendingSelection?.radius ?? this.mapRadius ?? this.DEFAULT_RADIUS;
    this.pendingSelection = { lat, lng, radius, address };
    this.reverseGeocode(lat, lng);
  }

  private reverseGeocode(lat: number, lng: number): void {
    const geocoder = this.ensureGeocoder();
    if (!geocoder) {
      return;
    }

    this.geocoding = true;
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      this.geocoding = false;
      if (status === 'OK' && results && results.length > 0) {
        const formatted = results[0].formatted_address;
        if (this.pendingSelection) {
          this.pendingSelection.address = formatted;
        }
        this.mapError = null;
      } else {
        this.mapError = 'Unable to retrieve address for the selected location.';
      }
    });
  }

  private ensureGeocoder(): google.maps.Geocoder | null {
    if (typeof google === 'undefined' || !google?.maps) {
      this.mapError = 'Google Maps SDK is not available. Please try again later.';
      return null;
    }

    if (!this.geocoder) {
      this.geocoder = new google.maps.Geocoder();
    }
    return this.geocoder ?? null;
  }

  private ensureFormLocationDefaults(): void {
    if (this.formData.latitude === undefined) {
      this.formData.latitude = null;
    }
    if (this.formData.longitude === undefined) {
      this.formData.longitude = null;
    }
    if (this.formData.radiusInMeters === undefined) {
      this.formData.radiusInMeters = null;
    }
  }
}


