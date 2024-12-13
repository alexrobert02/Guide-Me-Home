import { Geolocation } from '@capacitor/geolocation';
import { Motion } from '@capacitor/motion';

export interface LocationObserver {
    onLocationChanged: (position: GeolocationPosition) => void;
}


export class LocationService {

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

    async printCurrentPosition() {
        // request permission to access location
        const permission = await Geolocation.requestPermissions();
        console.log('Permission:', permission);

        const coordinates = await Geolocation.getCurrentPosition();
    
        console.log('Current position:', coordinates);
    }

    private async _watchPosition() {
        await Geolocation.requestPermissions();

        const watchId = Geolocation.watchPosition({enableHighAccuracy: true}, (position, err) => {
            if (err) {
                console.error('Error watching position:', err);
                throw err;
            }
            for (const observer of this._observers) {
                observer.onLocationChanged(position);
            }
            
        });

        return watchId;
    }


    async startPrintingDirection() {
        console.log('Start printing direction');

        Motion.addListener('orientation', (event) => {
            console.log('direction:', event);
        });
        
    }

    async stopPrintingDirection() {
        Motion.removeAllListeners();
        console.log('Stop printing direction');
    }
}