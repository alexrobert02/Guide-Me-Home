import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { LocationService, LocationServiceImpl } from "./services/LocationService";
import { LocationStore } from "./stores/LocationStore";
import { RouteService } from "./services/RouteService";
import React from "react";
import { MapStore } from "./stores/MapStore";
import { RoutesStore } from "./stores/RoutesStore";
import { dummyRoutes } from "./dummyData";
import { NavigationContext } from "./map/models/NavigationContext";
import { DistanceUtils } from "./map/utils/DistanceUtils";
import { NavigationUtils } from "./map/utils/NavigationUtils";
import { LocationServiceMocked } from "./services/LocationServiceMocked";

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


    const locationService = new LocationServiceImpl();
    // const locationService = new LocationServiceMocked();
    const locationStore = new LocationStore(locationService);
    const routesService = new RouteService(routesLibrary);
    const mapStore = new MapStore(routesService);
    const routesStore = new RoutesStore();
    const distanceUtils = new DistanceUtils();
    const navigationUtils = new NavigationUtils(distanceUtils, locationStore);
    const navigationContext = new NavigationContext(
        locationService,
        distanceUtils,
        navigationUtils,
        routesService,
        mapStore
    )
    routesStore.setRoutes(dummyRoutes);

    
    locator.set("LocationService", locationService);
    locator.set("LocationStore", locationStore);
    locator.set("RouteService", routesService);
    locator.set("MapStore", mapStore);
    locator.set("RoutesStore", routesStore);
    locator.set("NavigationContext", navigationContext);
    locator.set("DistanceUtils", distanceUtils);
    locator.set("NavigationUtils", navigationUtils);
    

    appInitializedCallback();
    return (null);
}