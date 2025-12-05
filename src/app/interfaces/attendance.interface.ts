import { errorContext } from "rxjs/internal/util/errorContext";

export interface FaceData {
  image: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}
export interface AttendanceTaken {
  ImageBase64: string,
  latitude: number,
  longitude: number,
  checkTime: Date

}