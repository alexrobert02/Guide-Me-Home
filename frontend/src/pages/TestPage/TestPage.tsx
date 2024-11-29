import * as React from "react";
import { LocationService } from "../../services/LocationService";

/**
 * Component used for debug and testing purposes
 */
const TestPage = () => {
    return (
        <div>
           <button onClick={LocationService.printCurrentPosition}>Print position</button>
           <button onClick={LocationService.startPrintingDirection}>Start print direction</button>
            <button onClick={LocationService.stopPrintingDirection}>Stop print direction</button>
        </div>
    );
};

export default TestPage;