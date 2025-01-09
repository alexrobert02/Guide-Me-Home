import { MapMouseEvent } from "@vis.gl/react-google-maps";

export class MapController {

    onClick(e: MapMouseEvent): void {
        return;
    }

    onDoubleClick?(): void {
        return;
    }
}

export const DEFAULT_MAP_CONTROLLER = new MapController();