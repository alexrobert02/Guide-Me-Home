import * as React from "react";

import { BackButton } from "../../components/BackButton";
import { observer } from "mobx-react";
import { RoutesStore } from "../../stores/RoutesStore";
import { locator } from "../../AppInitializer";
import { useNavigate } from "react-router-dom";
import { MapStore } from "../../stores/MapStore";
import { MapModelFactory } from "../../map/models/MapModel";
import { RouteService } from "../../services/RouteService";
import { MarkerModel } from "../../map/models/MarkerModel";
import { Button, Layout, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons"; // Import the Plus icon
import { Tooltip } from "antd"; // Tooltip for additional context

const { Content } = Layout;


export const RoutesMenu: React.FC = observer(() => {
    const navigate = useNavigate();
    const routesStore = locator.get("RoutesStore") as RoutesStore;
    const mapStore = locator.get("MapStore") as MapStore;
    const routeService = locator.get("RouteService") as RouteService;

    return (
        <div>
            <BackButton/>
            <Layout style={{minWidth: 240 , maxWidth: 300, margin: "0 auto" }}>
                <Content style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
                    {
                        routesStore.routes.map((route, index) => {
                            return (
                                <Button
                                    size="large"
                                    style = {{ marginBottom: 16 , width: "100%"}}
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
                                    }>{route.name}</Button>
                            );
                        })
                    }
                    <Tooltip title="Add New Route">
                    <Button
                        size="large"
                        shape="circle" // Makes it circular
                        icon={<PlusOutlined />} // Adds the plus icon
                        onClick={
                            () => {
                                routesStore.unselectRoute();
                                routesStore.setEditable(true);
                                mapStore.setCurrentMapModel(MapModelFactory.createEmpty());

                                navigate("/map");
                            }
                        }/>
                    </Tooltip>

                </Content>
            </Layout>
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