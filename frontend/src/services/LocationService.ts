import { Geolocation } from '@capacitor/geolocation';
import { Motion } from '@capacitor/motion';


export class LocationService {
    static async printCurrentPosition() {
        // request permission to access location
        const permission = await Geolocation.requestPermissions();
        console.log('Permission:', permission);

        const coordinates = await Geolocation.getCurrentPosition();
    
        console.log('Current position:', coordinates);
    }

    static async startPrintingDirection() {
        console.log('Start printing direction');

        Motion.addListener('orientation', (event) => {
            console.log('direction:', event);
        });
        
    }

    static async stopPrintingDirection() {
        Motion.removeAllListeners();
        console.log('Stop printing direction');
    }
}