import * as React from "react";
import MapWrapper from "../../map/components/MapWrapper";
import { locator } from "../../AppInitializer";
import { MapStore } from "../../stores/MapStore";
import { observer } from "mobx-react";
import { BackButton } from "../../components/BackButton";
import { RoutesStore } from "../../stores/RoutesStore";
import { RouteModelFactory } from "../../map/models/RouteModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DEFAULT_BACKEND_API_URL } from "../../ProjectDefaults";
import { Button, Modal, Input } from "antd";

const Map = observer(() => {
    const mapStore = locator.get("MapStore") as MapStore;
    const routesStore = locator.get("RoutesStore") as RoutesStore;
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = React.useState(false);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [routeName, setRouteName] = React.useState("");

    const saveRoute = (name: string) => {
        const route = RouteModelFactory.createFromMapModel(mapStore.currentMapModel, name);
        mapStore.reset();
        routesStore.addRoute(route);
        const payload = {
            name,
            routes: route,
        };
        // axios.post(
        //     `${DEFAULT_BACKEND_API_URL}/api/v1/route`,
        //     payload,
        //     {
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     }
        // ).then(r => console.log(route));
        navigate("/routes");
    };

    const handleSave = () => {
        if (mapStore.currentlyEditing) {
            setIsModalVisible(true);
        } else {
            startEdit();
        }
    };

    const handleOk = () => {
        saveRoute(routeName);
        setIsModalVisible(false);
        setRouteName("");
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setRouteName("");
    };

    const startEdit = () => {
        mapStore.setCurrentlyEditing(true);
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            {routesStore.editable && (
                <Button
                    type="primary"
                    onClick={handleSave}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 1000,
                    }}
                >
                    {mapStore.currentlyEditing ? "Save" : "Edit"}
                </Button>
            )}
            <Modal
                title="Save Route"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Save"
                cancelText="Cancel"
            >
                <Input
                    placeholder="Enter route name"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                />
            </Modal>
            <BackButton />
            <MapWrapper />
        </div>
    );
});

export default Map;
