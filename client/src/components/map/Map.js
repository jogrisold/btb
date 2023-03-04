// React essentials
import{ useRef, useEffect, useState, useContext } from "react";
import styled from "styled-components";

// required by mabox
import mapboxgl from 'mapbox-gl'; 

import NavSearch from "./NavSearch";
import { UserContext } from "../UserContext";
import TripDetails from "./TripDetails";

// my mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug';

const Map = () => {
    // *****************************************************
    // States required by mapbox base
    // *****************************************************
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    // Set position of map to Montreal
    const [lng, setLng] = useState(-73.5674); 
    const [lat, setLat] = useState(45.5019); 
    const [zoom, setZoom] = useState(9);
    
    // *****************************************************
    // States for customization
    // *****************************************************
    // Create a state to hold map initialization for easier
    // useEffect customization implementation
    const [mapInit, setMapInit] = useState(false);
    
    // For rendering the waypoints only once, and only after data 
    // has been fetched
    const [bikeDataRetrieved, setBikeDataRetrieved] = useState(false);
    // Create a state to hold the markers added to the map to remove 
    // them on submission of addRoute
    const [currentMarkers, setCurrentMarkers] = useState([]);
    // State to hold bike station location data
    const [bikeLocations, setBikeLocations] = useState([]);
    // Required context states
    const {
        origin,
        destination,
        setRoutesData,
        stationStatus,
        setStationStatus,
        bikeStations, 
        setBikeStations,
        addStations, 
    } = useContext(UserContext)



    // *****************************************************
    // useEffects required by mapbox base - DO NOT EDIT
    // *****************************************************
    // Initialize the map
    useEffect(() => {
        if (mapRef.current) return; // initialize map only once
            mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        // Set the map initialization state to true,
        // which will trigger our customization useEffect
        setMapInit(true);
        // console.log('line 50: mapinitialization end:' + bikeDataRetrieved, mapInit);
    },[]);
    // Store the new co-ordinates 
    useEffect(() => {
        if (!mapRef.current) return; // wait for map to initialize
        mapRef.current.on('move', () => {
            setLng(mapRef.current.getCenter().lng.toFixed(4));
            setLat(mapRef.current.getCenter().lat.toFixed(4));
            setZoom(mapRef.current.getZoom().toFixed(2));
        });
    },[]);
    // *****************************************************
    // Mapbox essentials end
    // *****************************************************

    // Retrieve stations from backend
    useEffect(() => {
        if (bikeDataRetrieved === false){
        fetch("/stations")
            .then((res) => {
                if(!res.ok){
                    throw new Error('Bad api request');
                }
                return res.json();
            })
            .then((json) => {
                // Store the station data in a state
                setBikeLocations(json.data);
                // Set a state to trigger the bikeStations.map useEffect
                // in order to render the waypoints on the map
                fetch("/station-status")
                    .then((res) => res.json())
                    .then((json) => {
                        // Store the station data in a state
                        setStationStatus(json.data);
                        // Set a state to trigger the bikeStations.map useEffect
                        // in order to render the waypoints on the map
                        setBikeDataRetrieved(true);
                    });

            });
        }
    },[])


    // Use effect to render the location and station status data
    // into a single array of objects for more efficient reference
    useEffect(()=>{
        // Check if the data has been fetched
        if (bikeDataRetrieved && bikeLocations.length > 0 && stationStatus !== null){
            // Initialize an empty array and object
            let stations = [];
            let stationResponse = {};
           // Map through the stations in the locations array
           bikeLocations.map((station)=>{
            // Compare them to the stations in the detailed data
                stationStatus.map((data)=>{
                // If the IDs match
                    if(station.station_id === data.station_id){
                    // Create a new object with all of the required
                    // data in the one place
                        stationResponse = {
                            station_id: station.station_id,
                            name: station.name,
                            position: station.position,
                            capacity: station.capacity,
                            bikes: data.bikes,
                            e_bikes: data.e_bikes,
                            docks: data.docks,
                            renting: data.renting,
                            returning: data.returning
                        }

                    }
                // Add the object to an array and return it
                return stationResponse;
            })
            stations = [...stations, stationResponse]
            return stations;
        })
        setBikeStations(stations);
        }
    },[bikeDataRetrieved])

    // Customization useEffect to avoid multiple elements 
    useEffect(() => {
        // console.log('81: customization useeffect start');
        // wait for map to initialize
        if (mapInit === true) {
            // console.log('84: mapinit true passes');
            // Retrieve the user's location if they allow access
            mapRef.current.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
                }))

            // Allow fullscreen mode    
            mapRef.current.addControl(new mapboxgl.FullscreenControl({container: mapContainer.current}));

            // Add navigation + / - for easier desktop useability
            mapRef.current.addControl(new mapboxgl.NavigationControl());
        }
    },[mapInit]);
        
    // Add bike station markers
    useEffect(()=>{
        // 112: bikestations triggered
        // Check that the station data has been retrieved successfully
        // in the fetch above, and that the map has been rendered
        if (bikeStations.length > 0 && mapInit === true){
            // Map through the stations
            bikeStations.forEach((station) => {                
                // Define a popup that will display the required station infomration
                let popup = new mapboxgl.Popup()
                    .setHTML(`<h3> Bikes: ${station.bikes}</h3>`
                            + `<h4> E-bikes: ${station.e_bikes}</h4>`
                            + `<div> Docks: ${station.docks}</div>`
                            )
                    .addTo(mapRef.current);
                // Add the marker to the map
                let marker = new mapboxgl.Marker()
                marker.setLngLat(station.position);
                marker.addTo(mapRef.current);
                marker.setPopup(popup);
                // Set the popup to default as not visible so that the base map
                // is more clear and we can retrieve the popup only when the station
                // is clicked
                popup.remove();
                // Store the markers in an array in order to clear the map 
                // when a user submits getDirections and it calls removeMarkers();
                setCurrentMarkers(currentMarkers =>[...currentMarkers, marker])
            })
            // Set the retrieval trigger false to avoid
            // additional re-rendering on map navigation
            setBikeDataRetrieved(false);
        }
    },[stationStatus, addStations])

    
    // Create a function that will remove all markers when a user submits the form
    // in NavSearch, triggering getDirections();
    const removeMarkers = (originStation, destinationStation) => {
        console.log("removemarkers starts")
        if (currentMarkers!==null) {
            for (var i = currentMarkers.length - 1; i >= 0; i--) {
                // Remove all marker except the stations except those used in the trip
                if(
                    (
                    (currentMarkers[i]._lngLat.lng !== originStation[0]) 
                    && 
                    (currentMarkers[i]._lngLat.lat !== originStation[1])
                    ) || (
                    (currentMarkers[i]._lngLat.lng !== destinationStation[0]) 
                    && 
                    (currentMarkers[i]._lngLat.lat !== destinationStation[1])
                    )
                    ){
                    currentMarkers[i].remove();
                }
            }
        }
    }
       
    // Create a function to make a directions request
    const getRoute = async(start, finish, routeName, routeColor, profile, triptype) => {
        if(mapInit){
            // make a directions request using cycling profile
            // an arbitrary start, will always be the same
            // only the finish or finish will change
            try{
                const query = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${finish[0]},${finish[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
                    { method: 'GET' }
                );

                const json = await query.json();
               
                const data = json.routes[0];
        
                // Push the route information for use in duration calculation
                if(triptype === "biketrip"){
                    setRoutesData(routesData => [...routesData, data]);
                }
        
        
                const route = data.geometry.coordinates;
                const geojson = {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: route
                    }
                };
                // if the route already exists on the map, we'll reset it using setData
                if (mapRef.current.getSource(`${routeName}`)) {
                    mapRef.current.getSource(`${routeName}`).setData(geojson);
                }
                // otherwise, we'll make a new request
                else {
                    mapRef.current.addLayer({
                        id: `${routeName}`,
                        type: 'line',
                        source: {
                        type: 'geojson',
                        data: geojson
                        },
                        layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                        },
                        paint: {
                        'line-color': `${routeColor}`,
                        'line-width': 5,
                        'line-opacity': 0.75
                        }
                    });
                }
            } catch {
                window.alert("You can't bike across water! Unless you're superman? In which case, just fly. Try again")
            }
        }
    }

    // Define a function to add the route to the map 
    // as a mapbox layer
    const addRouteLayer = (layerOrigin, layerDestination, routeName, routeColor, profile, triptype, addStations) =>{
        if(mapInit){
            if (addStations){
                let originStationMarker = new mapboxgl.Marker()
                    originStationMarker.setLngLat(layerOrigin);
                    originStationMarker.addTo(mapRef.current);
                    // Store the markers in an array in order to clear the map 
                    // when a user submits getDirections and it calls removeMarkers();
                    setCurrentMarkers(currentMarkers =>[...currentMarkers, originStationMarker])
                let destinationStationMarker = new mapboxgl.Marker()
                    destinationStationMarker.setLngLat(layerDestination);
                    destinationStationMarker.addTo(mapRef.current);
                    setCurrentMarkers(currentMarkers =>[...currentMarkers, destinationStationMarker])
            }
            // Call the function that returns the route
            // getRoute(origin, destination);
            // Add origin point to the map
            // Route to nearest station
            getRoute(layerOrigin, layerDestination, routeName, routeColor, profile, triptype);
            mapRef.current.addLayer({
                id: 'point',
                type: 'circle',
                source: {
                    type: 'geojson',
                    data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: layerOrigin,
                        }
                        }
                    ]
                    }
                },
                paint: {
                    'circle-radius': 10,
                    'circle-color': '#BFCCFF'
                }
            });
        }
        };
    
    // Create a function that will center the map on the 
    // origin when the user submits the getDirections form
    const centerMapOnOrigin = () => {
        if(mapInit){
            const start = {
                center: destination,
                zoom: 1,
                pitch: 0,
                bearing: 0
                };
            const end = {
                center: origin,
                zoom: 16.5,
                bearing: 0,
                pitch: 0
            };
        
            let isAtStart = true;
                
            const target = isAtStart ? end : start;
            isAtStart = !isAtStart;
                
            mapRef.current.flyTo({
            ...target, // Fly to the selected target
            duration: 5000, // Animate over 10 seconds
            essential: true // This animation is considered essential with
            //respect to prefers-reduced-motion
            });
        }
    }

    return(<>
        <Wrapper>
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <NavSearch 
                addRouteLayer = {addRouteLayer}
                mapboxgl = {mapboxgl}
                removeMarkers = {removeMarkers}
                centerMapOnOrigin = {centerMapOnOrigin}
            />
            <MapContainer ref={mapContainer} className="map-container" />
            <TripDetails />
        </Wrapper>


    </>
    )
};
export default Map;

const Wrapper = styled.div`
    
`;
const MapContainer = styled.div`
    height: 900px;
`;