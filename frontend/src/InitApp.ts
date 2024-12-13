import { LocationService } from "./services/LocationService";
import { LocationStore } from "./stores/LocationStore";

export var locator = new Map();

export function initApp() {
    const locationService = new LocationService();
    const locationStore = new LocationStore(locationService);
    
    locator.set("LocationService", locationService);
    locator.set("LocationStore", locationStore);
}