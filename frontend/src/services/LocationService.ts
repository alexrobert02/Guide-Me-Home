import { Geolocation } from "@capacitor/geolocation";
import { Motion } from "@capacitor/motion";
import type { Position } from "@capacitor/geolocation";
import { DEFAULT_BACKEND_API_URL } from "../ProjectDefaults";
import { getUserId } from "./tokenDecoder";

export interface LocationObserver {
  onLocationChanged: (position: Position) => void;
}

export interface LocationService{
  registerObserver(observer: LocationObserver): void;
  unregisterObserver(observer: LocationObserver): void;
}

export class LocationServiceImpl implements LocationService {
  private _observers: LocationObserver[] = [];

  constructor() {
    this._watchPosition();
  }

  registerObserver(observer: LocationObserver) {
    this._observers.push(observer);
  }

  unregisterObserver(observer: LocationObserver) {
    const index = this._observers.indexOf(observer);
    if (index !== -1) {
      this._observers.splice(index, 1);
    }
  }

  private async _printCurrentPosition() {
    // request permission to access location
    const permission = await Geolocation.requestPermissions();
    console.log("Permission:", permission);

    const coordinates = await Geolocation.getCurrentPosition();

    console.log("Current position:", coordinates);
  }

  private async _watchPosition() {
    await Geolocation.requestPermissions();

    const watchId = Geolocation.watchPosition(
      { enableHighAccuracy: true },
      async (position, err) => {
        if (err) {
          console.error("Error watching position:", err);
          throw err;
        }
        for (const observer of this._observers) {
          observer.onLocationChanged(position);
        }
        await this._sendLocationToServer(position);
      }
    );

    return watchId;
  }

  private async _startPrintingDirection() {
    console.log("Start printing direction");

    Motion.addListener("orientation", (event) => {
      console.log("direction:", event);
    });
  }

  private async _stopPrintingDirection() {
    Motion.removeAllListeners();
    console.log("Stop printing direction");
  }

  private async _sendLocationToServer(position: Position) {
    try {
      console.log("Sending location to server:", position); // Just for debugging, delete this line after finishing the implementation
      const response = await fetch(
        `${DEFAULT_BACKEND_API_URL}/api/v1/current-location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: getUserId(),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          }),
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to send location to server:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error sending location to server:", error);
    }
  }
}
