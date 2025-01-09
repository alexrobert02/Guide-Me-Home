import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { LocationService } from "./services/LocationService";
import { LocationStore } from "./stores/LocationStore";
import { RouteService } from "./services/RouteService";
import React from "react";
import { MapControllerStore } from "./stores/MapControllerStore";
import { MapStore } from "./stores/MapStore";

export var locator = new Map();

interface AppInitializerProps {
    appInitializedCallback: () => void;
}

export function AppInitializer({ appInitializedCallback }: AppInitializerProps) {
    locator.clear();
    
    // external services
    const routesLibrary = useMapsLibrary('routes');
    const drawingLibrary = useMapsLibrary('drawing');

    //if external services do not initialize, we cannot continue
    if (!routesLibrary || !drawingLibrary) {
        return (<div>Initializing the app</div>);
    }


    const locationService = new LocationService();
    const locationStore = new LocationStore(locationService);
    const routesService = new RouteService(routesLibrary);
    const mapControllerStore = new MapControllerStore();
    const mapStore = new MapStore();

    
    locator.set("LocationService", locationService);
    locator.set("LocationStore", locationStore);
    locator.set("RouteService", routesService);
    locator.set("MapControllerStore", mapControllerStore);
    locator.set("MapStore", mapStore);

    appInitializedCallback();
    return (null);
}