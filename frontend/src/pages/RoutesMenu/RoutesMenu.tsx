import * as React from "react";
import { useEffect, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { useNavigate } from "react-router-dom";
import { MapStore } from "../../stores/MapStore";
import { MapModelFactory } from "../../map/models/MapModel";
import { RouteService } from "../../services/RouteService";
import { MarkerModel } from "../../map/models/MarkerModel";
import { Button, Layout, Spin, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import {locator} from "../../AppInitializer";
import {DEFAULT_BACKEND_API_URL} from "../../ProjectDefaults";
import { getUserId } from "../../services/tokenDecoder";
import {RoutesStore} from "../../stores/RoutesStore"; // Import getUserId function

const { Content } = Layout;

interface Route {
    id: string;
    name: string;
    waypoints: { lat: number; lng: number }[];
}

export const RoutesMenu: React.FC = () => {
    const navigate = useNavigate();
    const mapStore = locator.get("MapStore") as MapStore;
    const routeService = locator.get("RouteService") as RouteService;
    const routesStore = locator.get("RoutesStore") as RoutesStore;

    const [routes, setRoutes] = useState<Route[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const userId = getUserId();
                const response = await axios.get(`${DEFAULT_BACKEND_API_URL}/api/v1/route/retrieveRouteList`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    params: {
                        userId, // Add userId as a query parameter
                    },
                });
                routesStore.setRoutes(response.data);
                console.log("response", response);
                setRoutes(response.data);
            } catch (error) {
                console.error("Failed to fetch routes", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    const handleSelectRoute = async (route: Route) => {
        routesStore.selectRoute(route);
        routesStore.setEditable(false);

        const newModel = MapModelFactory.createFromWaypoints(route.waypoints);
        const result = await _getRouteResult(newModel.markers, routeService);
        newModel.routeResult = result;

        mapStore.setCurrentMapModel(newModel);
        navigate("/map");
    };

    const handleAddRoute = () => {

        routesStore.unselectRoute()
        routesStore.setEditable(true)

        const emptyModel = MapModelFactory.createEmpty();
        mapStore.setCurrentMapModel(emptyModel);

        navigate("/map");
    };

    if (isLoading) {
        return <Spin size="large" style={{ display: "block", margin: "20% auto" }} />;
    }

    if (isLoading) {
        return <Spin size="large" style={{ display: "block", margin: "20% auto" }} />;
    }

    return (
        <div>
            <BackButton />
            <Layout style={{ minWidth: 240, maxWidth: 300, margin: "0 auto" }}>
                <Content style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {routes.map((route) => (
                        <Button
                            key={route.id}
                            size="large"
                            style={{ marginBottom: 16, width: "100%" }}
                            onClick={() => handleSelectRoute(route)}
                        >
                            {route.name}
                        </Button>
                    ))}
                    <Tooltip title="Add New Route">
                        <Button
                            size="large"
                            shape="circle"
                            icon={<PlusOutlined />}
                            onClick={handleAddRoute}
                        />
                    </Tooltip>
                </Content>
            </Layout>
        </div>
    );
};

async function _getRouteResult(markers: MarkerModel[], routeService: RouteService): Promise<google.maps.DirectionsResult> {
    const points = markers.map((m) => m.position);
    if (points.length < 2) {
        return undefined;
    }
    return routeService.getRoute(points[0], points[points.length - 1], points.slice(1, points.length - 1));
}
