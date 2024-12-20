import { makeAutoObservable} from "mobx";
import { MarkerModel } from "../map/models/MarkerModel";

export class MapStore {

    private _markers: MarkerModel[] = [];
    private _showUserLocation: boolean = true;
    private _routeResult: google.maps.DirectionsResult | undefined;

    constructor() {
        makeAutoObservable(this);
    }

    get markers(): MarkerModel[] {
        return this._markers;
    }

    get routeResult(): google.maps.DirectionsResult | undefined {
        return this._routeResult;
    }

    public setMarkers(markers: MarkerModel[]) {
        this._markers = markers;
    }

    public setRouteResult(result: google.maps.DirectionsResult) {
        this._routeResult = result;
    }

}