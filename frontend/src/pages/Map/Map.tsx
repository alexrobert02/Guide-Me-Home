import * as React from "react";
import MapWrapper from "../../components/MapWrapper";
import { useNavigate } from "react-router-dom";
import { LeftCircleOutlined } from "@ant-design/icons";

const Map = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/");
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
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
};

export default Map;
