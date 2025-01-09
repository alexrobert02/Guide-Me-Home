import { MapModel } from "./MapModel";

export interface RouteModel {
    waypoints: google.maps.LatLngLiteral[];
    name: string;
}

export class RouteModelFactory {
    static createEmpty(): RouteModel {
        return { waypoints: [], name: "" };
    }

    static createFromMapModel(mapModel:MapModel, name: string): RouteModel {
        return { waypoints: mapModel.markers.map(m => m.position), name: name };
    }
}