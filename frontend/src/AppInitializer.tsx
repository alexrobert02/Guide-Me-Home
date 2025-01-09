import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { LocationService } from "./services/LocationService";
import { LocationStore } from "./stores/LocationStore";
import { RouteService } from "./services/RouteService";
import React from "react";
import { MapStore } from "./stores/MapStore";
import { RoutesStore } from "./stores/RoutesStore";
import { dummyRoutes } from "./dummyData";

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
    const mapStore = new MapStore(routesService);
    const routesStore = new RoutesStore();
    routesStore.setRoutes(dummyRoutes);

    
    locator.set("LocationService", locationService);
    locator.set("LocationStore", locationStore);
    locator.set("RouteService", routesService);
    locator.set("MapStore", mapStore);
    locator.set("RoutesStore", routesStore);

    appInitializedCallback();
    return (null);
}