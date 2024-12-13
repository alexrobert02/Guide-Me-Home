import { APIProvider, Map } from '@vis.gl/react-google-maps';
import * as React from "react";
import { observer } from "mobx-react"
import { LocationStore } from '../stores/LocationStore';
import { locator } from '../InitApp';
import CurrentPositionMarker from './CurrentPositionMarker';

// import { LocationService } from '../services/LocationService';


const MapWrapper = observer (() => {
  
  // get the markers from the LocationService
  // const markers: Marker[];
  const locationStore = locator.get("LocationStore") as LocationStore;

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        mapId={process.env.REACT_APP_MAP_ID}
        style={{width: '100vw', height: '100vh'}}
        defaultCenter={{lat: locationStore.coordonates.latitude, lng: locationStore.coordonates.latitude}}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <CurrentPositionMarker />
        </Map>
    </APIProvider>
)
});

export default MapWrapper;