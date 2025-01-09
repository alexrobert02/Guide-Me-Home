import * as React from "react";
import { useNavigate } from "react-router-dom";
import { LeftCircleOutlined } from "@ant-design/icons";
import MapWrapper from "../../map/components/MapWrapper";
import { MapControllerStore } from "../../stores/MapControllerStore";
import { locator } from "../../AppInitializer";
import { RouteCreationMapController } from "../../map/controllers/RouteCreationMapController";
import { MapStore } from "../../stores/MapStore";
import { observer } from "mobx-react";
import { RouteService } from "../../services/RouteService";

const Map = observer(() => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = React.useState(false);

    const handleBackClick = () => {
        navigate("/");
    };

    const mapControllerStore = locator.get("MapControllerStore") as MapControllerStore;
    const mapStore = locator.get("MapStore") as MapStore;
    const routeService = locator.get("RouteService") as RouteService;

    const triggerMapEditMode = () => {
        if (!isEditing) {
            mapControllerStore.setCurrentController(new RouteCreationMapController(mapStore, routeService));
        } else {
            mapControllerStore.popController();
        }
        setIsEditing(!isEditing)
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <button 
            onClick={triggerMapEditMode}
            style={{
                width: '100px',
                height: '50px',
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
            }}
            >Edit</button>
            {/* Back Button */}
            <LeftCircleOutlined
                onClick={handleBackClick}
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 1000,
                    padding: '10px 15px',
                    backgroundColor: '#007BFF',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            />
            <MapWrapper />
        </div>
    );
});

export default Map;
