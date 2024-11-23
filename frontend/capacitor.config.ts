import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.guidemehome",
  appName: "guide-me-home",
  webDir: "build",
  android: {
    allowMixedContent: true,
  }
};

export default config;
