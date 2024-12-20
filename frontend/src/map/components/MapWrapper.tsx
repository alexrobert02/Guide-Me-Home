import { AdvancedMarker, Map } from '@vis.gl/react-google-maps';
import * as React from "react";
import { observer } from "mobx-react"
import { LocationStore } from '../../stores/LocationStore';
import CurrentPositionMarker from './CurrentPositionMarker';
import { locator } from '../../AppInitializer';
import { MapControllerStore } from '../../stores/MapControllerStore';
import { MapStore } from '../../stores/MapStore';
import { RouteService } from '../../services/RouteService';
import { RouteRanditon } from './RouteRandition';

// import { LocationService } from '../services/LocationService';


const MapWrapper = observer (() => {
  
  // get the markers from the LocationService
  // const markers: Marker[];
  const locationStore = locator.get("LocationStore") as LocationStore;
  const controller = (locator.get("MapControllerStore") as MapControllerStore).currentController;
  const mapStore = locator.get("MapStore") as MapStore;
  const routeService = locator.get("RouteService") as RouteService;
  const directionRenderer = routeService.directionRenderer;

  return (
      <Map
        mapId={process.env.REACT_APP_MAP_ID}
        style={{width: '100vw', height: '100vh'}}
        defaultCenter={{lat: locationStore.coordonates.latitude, lng: locationStore.coordonates.latitude}}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        onClick={(e) => {console.log("map clicked", e); controller.onClick(e)}}
      >
        <CurrentPositionMarker />
        {
          mapStore.markers.map((marker, index) => {
            return (
              <AdvancedMarker
              position={marker.position}
              >

              </AdvancedMarker>
            )
          })
        }
        {
          mapStore.routeResult && (
            <RouteRanditon />
          )
        }
      </Map>
)
});

export default MapWrapper;