
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import * as L from 'leaflet';
declare var bootstrap: any;



@Component({
  selector: 'app-company-info',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.css'
})
export class CompanyInfoComponent implements OnInit {
  CompanyForm = new FormGroup({
    CompanyName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    WebsiteUrl: new FormControl('', Validators.pattern('https?://.+')),
    ContactPhone: new FormControl('', Validators.pattern('^\\+?[0-9\\-\\s]{8,11}$')),
    ContactEmail: new FormControl('', Validators.email),
    DomainUrl: new FormControl('', Validators.required),
    Address: new FormControl('', Validators.required),
    Latitude: new FormControl<number | null>(null, Validators.required),
    Longitude: new FormControl<number | null>(null, Validators.required),
    AllowedRadiusMeters: new FormControl(100, [Validators.required, Validators.min(10)]),
    CompanyLogo: new FormControl(''),
    CompanyHeader: new FormControl(''),
    CompanyFooter: new FormControl(''),
    TaxRegistrationNumber: new FormControl('', Validators.required),
    CommercialNumber: new FormControl('', Validators.required),
    WorkStartTime: new FormControl<number | null>(null, [Validators.required]),
    WorkEndTime: new FormControl<number | null>(null, [Validators.required, this.checkTime()])
  });

  companyId?: number;
  latitude?: number;
  longitude?: number;

  loading = false;
  selectedLogo: File | null = null;
  selectedHeader: File | null = null;
  selectedFooter: File | null = null;

  private map?: L.Map;
  private marker?: L.Marker;
  private mapInitialized = false;

  constructor(private companyService: CompanyService) {
  }

  ngOnInit() {
    this.loadCompany();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
  }
  onLogoSelected(event: any): void {
    this.selectedLogo = event.target.files[0] as File;
  }
  onHeaderSelected(event: any): void {
    this.selectedHeader = event.target.files[0] as File;
  }
  onFooterSelected(event: any): void {
    this.selectedFooter = event.target.files[0] as File;
  }
  checkTime(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const startVal = Number(this.CompanyForm.get('WorkStartTime')?.value);
      const endVal = Number(control.value);

      if (!isNaN(startVal) && !isNaN(endVal) && startVal >= endVal) {
        return { invalidTimeRange: true };
      }
      return null;
    };
  }
  loadCompany() {
    this.loading = true;
    this.companyService.getCompanySetting().subscribe({
      next: (data) => {
        this.companyId = data.id;
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.CompanyForm.patchValue({
          CompanyName: data.companyName,
          WebsiteUrl: data.websiteUrl,
          ContactPhone: data.contactPhone,
          ContactEmail: data.contactEmail,
          DomainUrl: data.domainUrl,
          Address: data.address,
          Latitude: data.latitude,
          Longitude: data.longitude,
          AllowedRadiusMeters: data.allowedRadiusMeters,
          CompanyLogo: data.companyLogo ? this.companyService.getCompanyImagesUrl(data.companyLogo) : '',
          CompanyHeader: data.companyHeader ? this.companyService.getCompanyImagesUrl(data.companyHeader) : '',
          CompanyFooter: data.companyFooter ? this.companyService.getCompanyImagesUrl(data.companyFooter) : '',
          TaxRegistrationNumber: data.taxRegistrationNumber,
          CommercialNumber: data.commercialNumber,
          WorkStartTime: data.workStartTime,
          WorkEndTime: data.workEndTime
        });
        this.loading = false;
      },
      error: (err) => {
        debugger
        this.loading = false;
        console.error(err);
      }
    });
  }
  SaveCompanyInfo() {
    if (this.CompanyForm.valid) {
      const formData = new FormData();
      formData.append('id', this.companyId ? this.companyId.toString() : '0');
      Object.keys(this.CompanyForm.value).forEach(key => {
        const val = this.CompanyForm.value[key as keyof typeof this.CompanyForm.value];
        if (val !== null) formData.append(key, val ? val.toString().trim() : '');
      });
      if (this.selectedLogo)
        formData.append('logoFile', this.selectedLogo, this.selectedLogo.name);

      if (this.selectedHeader)
        formData.append('headerFile', this.selectedHeader, this.selectedHeader.name);

      if (this.selectedFooter)
        formData.append('footerFile', this.selectedFooter, this.selectedFooter.name);

      // console.log('FormData contents:');
      // formData.forEach((value, key) => {
      //   console.log(key, ':', value);
      // });
      // const companyObj = {
      //   id: this.companyId,
      //   companyName: this.CompanyForm.value.CompanyName?.trim(),
      //   address: this.CompanyForm.value.Address?.trim(),
      //   latitude: this.CompanyForm.value.Latitude,
      //   longitude: this.CompanyForm.value.Longitude,
      //   allowedRadiusMeters: this.CompanyForm.value.AllowedRadiusMeters,
      //   commercialNumberontactEmail: this.CompanyForm.value.ContactEmail?.trim(),
      //   contactPhone: this.CompanyForm.value.ContactPhone?.trim(),
      //   websiteUrl: this.CompanyForm.value.WebsiteUrl?.trim(),
      //   domainUrl: this.CompanyForm.value.DomainUrl?.trim(),
      //   companyLogo: this.CompanyForm.value.CompanyLogo?.trim(),
      //   logoFile: this.selectedLogo,
      //   companyHeader: this.CompanyForm.value.CompanyHeader?.trim(),
      //   headerFile: this.selectedHeader,
      //   companyFooter: this.CompanyForm.value.CompanyFooter?.trim(),
      //   footerFile: this.selectedFooter,
      //   taxRegistrationNumber: this.CompanyForm.value.TaxRegistrationNumber?.trim(),
      //   commercialNumber: this.CompanyForm.value.CommercialNumber?.trim()
      // } as ICompanyUpdated;

      this.loading = true;
      this.companyService.saveCompanySetting(formData).subscribe({
        next: (data) => {
          this.loading = false;
          alert('Company information saved successfully.');
          this.loadCompany();
        },
        error: (err) => {
          this.loading = false;
        }
      });
    }
  }

  openMapModal() {
    const modalElement = document.getElementById('staticMap')!;
    const modal = new bootstrap.Modal(modalElement);

    modalElement.addEventListener('shown.bs.modal', () => {
      this.initMap();
    }, { once: true });

    modal.show();
  }

  private initMap(): void {
    if (this.mapInitialized) return;

    const centerLat = this.latitude || 30.0444; // set current zone or cairo zone
    const centerLng = this.longitude || 31.2357;

    this.map = L.map('map').setView([centerLat, centerLng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onMapClick(e);
    });

    this.mapInitialized = true;

    setTimeout(() => {
      this.map?.invalidateSize();

      if (centerLat && centerLng) {
        this.setLocation(centerLat, centerLng);
      }
    }, 100);
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;
    this.setLocation(lat, lng);
  }

  private setLocation(lat: number, lng: number): void {
    debugger
    this.latitude = Number(lat.toFixed(6));
    this.longitude = Number(lng.toFixed(6));


    if (this.marker) {
      this.map?.removeLayer(this.marker); // remove marker
    }

    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        width: 30px;
        height: 30px;
        background-color: #EA4335;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -42]
    });

    this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map!); // draw marker
    this.map?.setView([lat, lng], 15);

    this.getAddressFromCoordinates(lat, lng);
  }

  private async getAddressFromCoordinates(lat: number, lng: number): Promise<void> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Angular-Leaflet-App'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();
      this.CompanyForm.patchValue({
        Address: data.display_name,
        Longitude: this.longitude,
        Latitude: this.latitude
      });
      if (this.marker) {
        this.marker.bindPopup(
          `<strong>Coordinates:</strong><br>
           ${lat.toFixed(6)}, ${lng.toFixed(6)}<br>
           <strong>Address:</strong><br>
           ${data.display_name}`
        ).openPopup();
      }

    } catch (error) {
      console.error('Error fetching address:', error);

    }
  }

  closeModel() {

    const modalElement = document.getElementById('staticMap')!;
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

  }

}
