export class MarkerModel {
    private _lat: number;
    private _lng: number;

    constructor(lat: number, lng: number) {
        this._lat = lat;
        this._lng = lng;
    }

    get position(): google.maps.LatLngLiteral {
        return { lat: this._lat, lng: this._lng };
    }

    get lat(): number {
        return this._lat;
    }

    get lng(): number {
        return this._lng;
    }
}


export class MarkerModelFactory {
    static createMarker(lat: number, lng: number): MarkerModel {
        return new MarkerModel(lat, lng);
    }
    
    static createFromPoint(point: google.maps.LatLngLiteral): MarkerModel {
        return new MarkerModel(point.lat, point.lng);
    }
}