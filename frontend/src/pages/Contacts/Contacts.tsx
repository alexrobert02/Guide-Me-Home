import * as React from "react";
import {useEffect, useState} from "react";
import { Input, Button, List, Typography } from "antd";
import {getUserEmail, getUserId} from "../../services/tokenDecoder";
import axios from "axios";
import {DEFAULT_BACKEND_API_URL} from "../../ProjectDefaults";

const Contacts: React.FC = () => {
    const [isModified, setIsModified] = useState<boolean>(false);
    const [email, setEmail] = useState("");
    const [contacts, setContacts] = useState([]);

    const fetchData = () => {
        const userId = getUserId();
        if (userId) {
            axios.get(`${DEFAULT_BACKEND_API_URL}/api/v1/user/getAllAssistants/${userId}`)
                .then(response => {
                    setContacts(response.data)
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    alert("Error getting assistants!")
                });
        }

    }

    const handleSendEmail = async () => {

        console.log("Email sent to:", email);
        console.log("User id:", getUserId())
        setEmail("");

        try {
            const response = await axios.post(
                `${DEFAULT_BACKEND_API_URL}/api/v1/invitation`, {
                    senderId: getUserId(),
                    recipientEmail: email
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                console.log("Invitation sent successfully!")
                alert("Invitation sent successfully!")
            } else {
                alert("Invalid email.");
            }
        } catch (error) {
            console.error("Error sending invitation:", error);
            if (error.response) {
                alert(
                    `Invitation failed: ${error.response.data.message || "Please try again."}`
                );
            } else {
                alert("An error occurred. Please try again later.");
            }
        }

    };

    useEffect(() => {
        fetchData();
    }, [isModified]);

    return (
        <div style={{ padding: "16px" }}>
            <div style={{ marginBottom: "16px" }}>
                <Input
                    placeholder="Enter an assistant's email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: "8px" }}
                />
                <Button type="primary" onClick={handleSendEmail} block>
                    Send
                </Button>
            </div>
            <List
                header={<Typography.Title level={4}>Emergency Contacts</Typography.Title>}
                bordered
                dataSource={contacts}
                renderItem={(item) => (
                    <List.Item>
                        <Typography.Text>{item}</Typography.Text>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Contacts;
