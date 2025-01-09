import * as React from "react";
import MapWrapper from "../../map/components/MapWrapper";
import { locator } from "../../AppInitializer";
import { MapStore } from "../../stores/MapStore";
import { observer } from "mobx-react";
import { BackButton } from "../../components/BackButton";
import { RoutesStore } from "../../stores/RoutesStore";
import { RouteModelFactory } from "../../map/models/RouteModel";
import { useNavigate } from "react-router-dom";

const Map = observer(() => {

    const mapStore = locator.get("MapStore") as MapStore;
    const routesStore = locator.get("RoutesStore") as RoutesStore;
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = React.useState(false);

    //TODO: move this into the mapWrapper
    const saveRoute = () => {
        // TODO: this will be modified when we will have routes in backend
        const route = RouteModelFactory.createFromMapModel(mapStore.currentMapModel, "New Saved Route");
        mapStore.reset();
        routesStore.addRoute(route);
        navigate("/routes");
    };

    const startEdit = () => {
        mapStore.setCurrentlyEditing(true);
    }

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            { routesStore.editable &&
                <button 
            onClick={mapStore.currentlyEditing ? saveRoute: startEdit}
            style={{
                width: '100px',
                height: '50px',
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
            }}
            >{
                mapStore.currentlyEditing ? "Save": "Edit"
            }
            </button>}
            <BackButton/>
            <MapWrapper />
        </div>
    );
});

export default Map;
