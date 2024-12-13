import { makeAutoObservable} from "mobx";
import { LocationObserver, LocationService } from "../services/LocationService";

export interface Coordonates {
    latitude: number;
    longitude: number;
}


export class LocationStore implements LocationObserver {

    private _coordonates: Coordonates = {
        latitude: 0,
        longitude: 0
    };
    private _heading: number | null = null;

    constructor(private readonly _locationService: LocationService) {
        makeAutoObservable(this);
        this._init();
    }

    private async _init(): Promise<void> {
        this._locationService.registerObserver(this);
    }

    onLocationChanged(position: GeolocationPosition): void {
        this._updateLocation(position);
    }

    get coordonates(): Coordonates {
        if (!this._coordonates) {
            throw new Error('No coordonates available');
        }
        return this._coordonates;
    }

    get heading(): number | null {
        return this._heading;
    }

    private _updateLocation(position: GeolocationPosition): void {
        this._coordonates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        this._heading = position.coords.heading;
    }

}