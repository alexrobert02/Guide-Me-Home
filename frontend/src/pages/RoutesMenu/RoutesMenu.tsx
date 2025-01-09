import * as React from "react";

import { MenuButton } from "../../components/MenuButton";
import { BackButton } from "../../components/BackButton";
import { observer } from "mobx-react";
import { RoutesStore } from "../../stores/RoutesStore";
import { locator } from "../../AppInitializer";
import { useNavigate } from "react-router-dom";
import { MapStore } from "../../stores/MapStore";
import { MapModelFactory } from "../../map/models/MapModel";
import { RouteService } from "../../services/RouteService";
import { MarkerModel } from "../../map/models/MarkerModel";


export const RoutesMenu: React.FC = observer(() => {
    const navigate = useNavigate();
    const routesStore = locator.get("RoutesStore") as RoutesStore;
    const mapStore = locator.get("MapStore") as MapStore;
    const routeService = locator.get("RouteService") as RouteService;

    return (
        <div>
            <BackButton/>
            <div
                style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh"}}
            >
            {
                routesStore.routes.map((route, index) => {
                    return (
                        <MenuButton
                            text={route.name}
                            onClick={
                                async () => {
                                    // TODO: this logic should be moved from these
                                    routesStore.selectRoute(route);
                                    routesStore.setEditable(false);
                                    const newModel = MapModelFactory.createFromWaypoints(route.waypoints);
                                    const result = await _getRouteResult(newModel.markers, routeService); 
                                    newModel.routeResult = result;
                                    mapStore.setCurrentMapModel(newModel);
                                    navigate("/map");
                                }
                            }
                        />
                    );
                })
            }
            {/* TODO: this should be a + */}
            <MenuButton
                text="+"
                onClick={
                    () => {
                        routesStore.unselectRoute();
                        routesStore.setEditable(true);
                        mapStore.setCurrentMapModel(MapModelFactory.createEmpty());

                        navigate("/map");
                    }
                }
                ></MenuButton>
            </div>
        </div>
    );
});

//TODO: very important -- refactor this into a callback on model change
async function _getRouteResult(markers: MarkerModel[], routeService: RouteService): Promise<google.maps.DirectionsResult> {
    const points = markers.map(m => m.position);
    if (points.length < 2) {
        return undefined;
    }
    const routeResult = await routeService.getRoute(
        points[0],
        points[points.length - 1],
        points.slice(1, points.length - 1)
    );

    return routeResult;
}