import { MapMouseEvent } from "@vis.gl/react-google-maps";
import { MapController } from "./MapController";
import { MarkerModel, MarkerModelFactory } from "../models/MarkerModel";
import { MapStore } from "../../stores/MapStore";
import { RouteService } from "../../services/RouteService";

export class RouteCreationMapController extends MapController {

    constructor(private readonly mapStore: MapStore,
                private readonly routesService: RouteService
    ) {
        super();
    }

    private _points: google.maps.LatLngLiteral[] = [];

    onClick(e: MapMouseEvent): void {
        this._points.push(e.detail.latLng);
        this.mapStore.setMarkers(this._getMarkers());
        this._getRouteResult().then(result => {
            if (result) {
                this.mapStore.setRouteResult(result);
            }
        });
    }

    get points(): google.maps.LatLngLiteral[] {
        return this._points;
    }

    private _getMarkers(): MarkerModel[] {
        return this._points.map(point => MarkerModelFactory.createFromPoint(point));
    }

    private async _getRouteResult(): Promise<google.maps.DirectionsResult> {
        if (this._points.length < 2) {
            return undefined;
        }
        const routeResult = await this.routesService.getRoute(
            this._points[0],
            this._points[this._points.length - 1],
            this._points.slice(1, this._points.length - 1)
        );

        return routeResult;
    }


}