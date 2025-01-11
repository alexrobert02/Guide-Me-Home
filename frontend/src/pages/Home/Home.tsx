import * as React from "react";
import { useState } from "react";
import {Menu, Button, Drawer, Typography, Layout} from "antd";
import { HomeOutlined, SettingOutlined, InfoCircleOutlined, UpSquareOutlined, ExclamationCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PanicButton } from "../../components/PanicButton";
import { MenuButton } from "../../components/MenuButton";

const { Content } = Layout;
const { Title } = Typography;

const Home: React.FC = () => {
    const [visible, setVisible] = useState(false);

    const navigate = useNavigate();

    const toggleDrawer = () => {
        setVisible(!visible);
    };

    const handleMenuClick = (key: string) => {
        console.log("Clicked menu item: ", key);
        setVisible(false); // Close the drawer after clicking a menu item
    };

    return (
        <div>
            {/* Button to open the menu */}
            <Button type="primary" onClick={toggleDrawer} style={{ position: "fixed", top: 10, left: 10 }}>
                Menu
            </Button>

            {/* Drawer component for mobile menu */}
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
                    <Menu.Item key="about" icon={<UpSquareOutlined /> } onClick={(e) => navigate("/map")}>
                        Free Roam
                    </Menu.Item>
                    <Menu.Item key="settings" icon={<SettingOutlined />}>
                        Settings
                    </Menu.Item>
                    <Menu.Item key="panic" icon={<ExclamationCircleOutlined />}>
                        Panic
                    </Menu.Item>
                    <Menu.Item key="about" icon={<QuestionCircleOutlined />}>
                        About
                    </Menu.Item>
                </Menu>
            </Drawer>
            <Title level={2}>
                GUIDE ME HOME
            </Title>
            <Layout style={{ maxWidth: 300, margin: "0 auto" }}>
                <Content style={{ display: "flex", flexDirection: "column"}}>


                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        style={{
                            height: "100px",
                            backgroundColor: "red",
                            borderColor: "red",
                            color: "white",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginTop: "60px",
                            marginBottom: "20px"
                        }}
                        onClick={() => console.log("Panic Button pressed")}
                    >
                        PANIC
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
