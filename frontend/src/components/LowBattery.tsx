import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Device } from "@capacitor/device";
import { DEFAULT_BACKEND_API_URL } from "../ProjectDefaults";
import { getUserId } from "../services/tokenDecoder"

export default function BatteryLowAlert() {
  const [batteryLevel, setBatteryLevel] = useState<number>(1);
  const [isCharging, setIsCharging] = useState<boolean>(false);


  const hasSentAlertRef = useRef<boolean>(false);

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const { batteryLevel, isCharging } = await Device.getBatteryInfo();
        setBatteryLevel(batteryLevel);
        setIsCharging(isCharging);

        checkAndSendAlert(batteryLevel, isCharging);
      } catch (error) {
        console.error("Error getting battery info:", error);
      }
    }, 60_000);


    (async () => {
      try {
        const { batteryLevel, isCharging } = await Device.getBatteryInfo();
        setBatteryLevel(batteryLevel);
        setIsCharging(isCharging);

        checkAndSendAlert(batteryLevel, isCharging);
      } catch (error) {
        console.error("Error getting battery info:", error);
      }
    })();

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  const checkAndSendAlert = (level: number, charging: boolean) => {
    if (level <= 0.2 && !charging && !hasSentAlertRef.current) {
      hasSentAlertRef.current = true;
      callLowBatteryAlert()
        .catch((err) => console.error("Failed sending low-battery alert:", err));
    }
  };

  const callLowBatteryAlert = async () => {
    const currentUserId = getUserId();

    const alertData = {
      senderId: currentUserId,
      reason: "Device battery is low",
    };

    try {
      const response = await axios.post(
        `${DEFAULT_BACKEND_API_URL}/api/v1/alert/mail`,
        alertData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Low-battery alert sent successfully!");
      } else {
        alert("Failed to send low-battery alert. Please try again.");
      }
    } catch (error) {
      console.error("Error sending low-battery alert:", error);
      alert("An error occurred while sending the low-battery alert.");
    }
  };

  return (
    <div></div>
  );
}
