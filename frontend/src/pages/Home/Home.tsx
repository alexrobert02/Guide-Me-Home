import * as React from "react";
import { useState } from "react";
import { Menu, Button, Drawer } from "antd";
import { HomeOutlined, SettingOutlined, InfoCircleOutlined, UpSquareOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


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
                    <Menu.Item key="about" icon={<UpSquareOutlined /> } onClick={(e) => navigate("/map")}>
                        Map
                    </Menu.Item>
                    <Menu.Item key="settings" icon={<SettingOutlined />}>
                        Settings
                    </Menu.Item>
                    <Menu.Item key="about" icon={<InfoCircleOutlined />}>
                        About
                    </Menu.Item>
                </Menu>
            </Drawer>
        </div>
    );
};

export default Home;
