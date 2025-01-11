import { Position } from "@capacitor/geolocation";
import { LocationObserver, LocationService } from "../../services/LocationService";
import { NavigationUtils } from "../utils/NavigationUtils";
import { RouteService } from "../../services/RouteService";
import { DistanceUtils } from "../utils/DistanceUtils";
import { MapStore } from "../../stores/MapStore";
import { MapModel } from "./MapModel";
import { MarkerModelFactory } from "./MarkerModel";
import { MapController } from "../controllers/MapController";
import { RouteModel } from "./RouteModel";

const LOST_DISTANCE = 200;
const BACK_DISTANCE = 50;

enum NavigationState {
    LOST,
    ON_TRACK
}

export class NavigationContext implements LocationObserver {
    private _currentLocation?: Position;
    private _routeModel?: google.maps.DirectionsResult;
    private _mapModel?: MapModel;
    private _currentRouteResult?: google.maps.DirectionsResult;
    private _routeResultOverride?: google.maps.DirectionsResult;
    private _ongoingNavigation = false;
    private _navigationState: NavigationState = NavigationState.ON_TRACK;

    
    constructor(
        private readonly _locationService: LocationService,
        private readonly _distanceUtils: DistanceUtils,
        private readonly _navigationUtils: NavigationUtils,
        private readonly _routeService: RouteService,
        private readonly _mapStore: MapStore

    ) { 
        this._locationService.registerObserver(this);
    }        
    
    onLocationChanged(position: Position): void {
        this._currentLocation = position;

        if (!this._ongoingNavigation) {
           return;
        }
        this._checkIfCloseToRoute();
    }

    public startNavigation(routeResult: google.maps.DirectionsResult, routeModel: RouteModel): void {
        this.stopNavigation();
        this._routeModel = routeResult;
        this._currentRouteResult = routeResult;
        this._ongoingNavigation = true;
    }

    public stopNavigation(): void {
        this._currentRouteResult = undefined;
        this._ongoingNavigation = false;
    }

    private _checkIfCloseToRoute(): void {
        if(!this._currentLocation) {
            console.error("location should be available");
        }

        switch(this._navigationState) {
            case NavigationState.LOST:
                if (this._navigationUtils.isCloseToRoute(BACK_DISTANCE)) {
                    this._navigationState = NavigationState.ON_TRACK;
                    this._redirectToRoute();
                }
                break;
            case NavigationState.ON_TRACK:
                if (!this._navigationUtils.isCloseToRoute(LOST_DISTANCE)) {
                    this._navigationState = NavigationState.LOST;
                }
                break;
        }

        if (!this._navigationUtils.isCloseToRoute()) {
            this._redirectToRoute();
        } else {
            this._backOnTrack();
        }
    }

    private _redirectToRoute(): void {
        console.log("You are lost, rerouting");
        const currentLocationPoint: google.maps.LatLngLiteral = {
            lat: this._currentLocation!.coords.latitude,
            lng: this._currentLocation!.coords.longitude
        }
        const closestPoint = this._distanceUtils.closestPointOnPath(currentLocationPoint, this._distanceUtils.resultToPath(this._routeModel));
        this._routeService.getRoute(currentLocationPoint, closestPoint, []).then((result) => {
            this._routeResultOverride = result;
            this._mapModel = this._mapStore.currentMapModel;
            this._mapStore.reset();
            const newMapModel: MapModel = {
                markers: [MarkerModelFactory.createFromPoint(currentLocationPoint), MarkerModelFactory.createFromPoint(closestPoint)],
                showUserLocation: true,
                routeResult: result,
                controller: new MapController()
            }
            this._mapStore.setCurrentMapModel(newMapModel);
        });
    }

    private _backOnTrack(): void {
        console.log("You are back on track");
        this._routeResultOverride = undefined;
        this._mapStore.setCurrentMapModel(this._mapModel!);
    }

}