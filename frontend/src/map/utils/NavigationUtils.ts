import { LocationStore } from "../../stores/LocationStore";
import { MapStore } from "../../stores/MapStore";
import { DistanceUtils, Point } from "./DistanceUtils";

const MAX_DISTANCE_FROM_ROUTE = 100;

export class NavigationUtils {

    constructor(
        private readonly _distanceUtils: DistanceUtils,
        private readonly _locationStore: LocationStore,
        private readonly _mapStore: MapStore
    ) {}

    public isCloseToRoute(): boolean {
        const currentPoint: Point = {
            lat: this._locationStore.coordonates.latitude,
            lng: this._locationStore.coordonates.longitude
        }
        const routeResult = this._mapStore.routeResult;
        if (!routeResult) {
            console.error("No route result is active. You should not navigate without a route set.");
            return false;
        }
        const distance = this._distanceUtils.distanceFromPath(currentPoint, this._distanceUtils.resultToPath(routeResult));
        
        return distance < MAX_DISTANCE_FROM_ROUTE;
    }


}