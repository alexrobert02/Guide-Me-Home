import * as React from "react";
import { useState, useEffect } from "react";
import { Menu, Button, Drawer, Typography, Layout } from "antd";
import { HomeOutlined, SettingOutlined, InfoCircleOutlined, UpSquareOutlined, ExclamationCircleOutlined, QuestionCircleOutlined, PoweroffOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MapStore } from "../../stores/MapStore";
import { locator } from "../../AppInitializer";
import axios from "axios";
import { DEFAULT_BACKEND_API_URL } from "../../ProjectDefaults";
import { getUserId, getUserRole } from "../../services/tokenDecoder";
import { RouteService } from "../../services/RouteService";
import { TrackingContext } from "../../map/utils/TrackingContext";
import { clearFcmToken } from "../../services/NotificationService";

const { Content } = Layout;
const { Title } = Typography;

const Home: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const routeService = locator.get("RouteService") as RouteService;
    const locationStore = locator.get("LocationStore");
    const trackingContext = locator.get("TrackingContext") as TrackingContext;

    const navigate = useNavigate();
    const mapStore = locator.get("MapStore") as MapStore;

    useEffect(() => {
        // Fetch the user's role when the component mounts
        const fetchRole = async () => {
            const userRole = await getUserRole(); // Assuming getUserRole returns a promise
            setRole(userRole);
        };
        fetchRole();
    }, []);

    const toggleDrawer = () => {
        setVisible(!visible);
    };

    const liveTracking = () => {
        console.log("live tracking started");
        trackingContext.startTracking();
        navigate("/map");
    };

    const handleMenuClick = (key: string) => {
        console.log("Clicked menu item: ", key);
        setVisible(false);
    };

    return (
        <div>
            <Button type="primary" onClick={toggleDrawer} style={{ position: "fixed", top: 10, left: 10 }}>
                Menu
            </Button>

            <Drawer
                title="Navigation"
                placement="left"
                onClose={toggleDrawer}
                visible={visible}
                bodyStyle={{ padding: 0 }}
            >
                <Menu
                    mode="inline"
                    onClick={(e) => handleMenuClick(e.key)}
                    style={{ borderRight: 0 }}
                >
                    <Menu.Item key="home" icon={<HomeOutlined />}>
                        Home
                    </Menu.Item>
                    <Menu.Item key="contacts" icon={<HomeOutlined />} onClick={(e) => navigate("/contacts")}>
                        Emergency Contacts
                    </Menu.Item>
                    <Menu.Item key="about" icon={<UpSquareOutlined />} onClick={(e) => { mapStore.reset(); navigate("/map") }}>
                        Free Roam
                    </Menu.Item>
                    <Menu.Item key="settings" icon={<SettingOutlined />}>
                        Settings
                    </Menu.Item>
                    <Menu.Item
                        key="panic"
                        icon={<ExclamationCircleOutlined />}
                    >
                        Panic
                    </Menu.Item>
                    <Menu.Item key="about" icon={<QuestionCircleOutlined />}>
                        About
                    </Menu.Item>
                    <Menu.Item
                        key="logout"
                        icon={<PoweroffOutlined />}
                        onClick={async () => {
                            localStorage.removeItem("isAuthenticated");
                            localStorage.removeItem("role");
                            clearFcmToken(localStorage.getItem("token"));
                            localStorage.removeItem("token");
                            navigate("/login");
                            window.location.reload();
                        }}
                    >
                        Logout
                    </Menu.Item>
                </Menu>
            </Drawer>
            <Title level={2}>GUIDE ME HOME</Title>
            <Layout style={{ maxWidth: 300, margin: "0 auto" }}>
                <Content style={{ display: "flex", flexDirection: "column" }}>
                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        style={{
                            height: "100px",
                            backgroundColor: role === "assistant" ? "blue" : "red",
                            borderColor: role === "assistant" ? "blue" : "red",
                            color: "white",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginTop: "60px",
                            marginBottom: "20px"
                        }}
                        onClick={async () => {
                            if (role === "assistant") {liveTracking()} else {
                                const currentUserId = getUserId();
                                const alertData = {
                                    senderId: currentUserId,
                                    reason: "User pressed alert button"
                                };

                                try {
                                    const response = await axios.post(
                                        `${DEFAULT_BACKEND_API_URL}/api/v1/alert`,
                                        alertData,
                                        {
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        }
                                    );

                                    if (response.status === 200) {
                                        alert("Alert sent successfully!");
                                    } else {
                                        alert("Failed to send alert. Please try again.");
                                    }
                                } catch (error) {
                                    console.error("Error sending alert:", error);
                                    alert("An error occurred while sending the alert. Please try again later.");
                                }
                            }
                        }}
                    >
                        {role === "assistant" ? "Track" : "Panic"}
                    </Button>

                    <Button
                        type="default"
                        size="large"
                        style={{ marginBottom: 16 }}
                        onClick={() => navigate("/contacts")}
                    >
                        Contacts
                    </Button>

                    <Button
                        type="default"
                        size="large"
                        style={{ marginBottom: 16 }}
                        onClick={() => navigate("/routes")}
                    >
                        Routes
                    </Button>
                </Content>
            </Layout>
        </div>
    );
};

export default Home;
