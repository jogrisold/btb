import { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../UserContext";

import { MdDirectionsBike } from "react-icons/md";
import { FaWalking } from "react-icons/fa";
import { FaBus } from "react-icons/fa";
import { RiPinDistanceFill } from "react-icons/ri";

const TripDetails = () => {
    // Required states from useContext
    const {
        routesData, 
        tripDetails,
        setTripDetails,
        busDuration,
        setBusDuration,
        publicTransitResult,
    } = useContext(UserContext);

    // State to store the data from the trip
    const [displayTripDetails, setDisplayTripDetails] = useState(false);

    // Use effect to run the bikeTripDuration calculation once routesData is set
    useEffect(()=>{
        if (publicTransitResult !== null && routesData.length > 0){
            bikeTripDuration();
            publicTransitDuration();
            setDisplayTripDetails(true);
        }
    },[publicTransitResult, routesData])

    // Create a function that will calculate the total trip duration 
    // to display to the user in minutes and kilometers
    const bikeTripDuration = () => {
        let totalTripTime = 0;
        let totalTripDistance = 0;
        let walkingTime = 0;
        let walkingDistance = 0;
        routesData.map((i) => {
            // For each leg, sum duration and distance
            totalTripTime += i.duration;
            totalTripDistance += i.distance;
            // If the data is for pedestrian travel,
            // sum the walking distance and duration
            if(i.weight_name === "pedestrian"){
                    walkingTime += i.duration;
                    walkingDistance += i.distance; 
            }
            return (walkingTime, walkingDistance)
        })
        setTripDetails(
            {
            ...tripDetails,
            "totalTripTime": Math.round(totalTripTime/60), 
            "totalTripDistance": Math.round(100*totalTripDistance/1000)/100, 
            "walkingTime": Math.round(walkingTime/60),
            "walkingDistance": Math.round(100*walkingDistance/1000, 2)/100
            }
        )
    }

    const publicTransitDuration = () => {
        const sections = publicTransitResult.routes[0].sections
        const departure = new Date(sections[0].departure.time);
        const arrival = new Date(sections[sections.length - 1].arrival.time);
        const travelTime = (arrival.getTime() - departure.getTime()) / (1000 * 60);
        setBusDuration(travelTime);
    }

    return (<>
            {displayTripDetails
            ? 
            <>

            <TripDetailsInfo>
            <FlexCol>
                <FlexRow>
                    <TripDistance> <Text><RiPinDistanceFill/></Text>{tripDetails.totalTripDistance}km</TripDistance>
                    <TripTime> <Text><MdDirectionsBike /></Text> {tripDetails.totalTripTime}mins</TripTime>
                    <WalkingTime> <Text><FaWalking /></Text> {tripDetails.walkingTime}mins</WalkingTime>
                </FlexRow>
                <FlexRow>
                    <TripDistance> <Text><RiPinDistanceFill/></Text>{tripDetails.totalTripDistance}km</TripDistance>
                    <BusDuration><Text><FaBus/></Text> {busDuration} mins</BusDuration>
                </FlexRow>
                </FlexCol>
            </TripDetailsInfo>
            </>
            : <></>
            }
            </>
    ) 
}

export default TripDetails;

const TripDetailsInfo = styled.div`
    position: absolute;
        z-index: 1;
        bottom: 0;
        left: 0;
    display: flex;
    gap: 0px;
    width: 100%;
    height: 70px;
    padding-top: 10px;
    background-color: var(--color-secondary);
    font-size: 20px;
`;

const TripDistance = styled.div`
    color: white;
`;
const TripTime = styled.div`
    color: white;
`;
const WalkingTime = styled.div`
    color: white;
`;
const BusDuration = styled.div`
    color: white;
    margin:  0 0 0 0px;
`;
const Text = styled.span`
    color: var(--color-tertiary);
`;
const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px;
`;
const FlexRow = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin: 0px 20px 5px 0;
`;