// React essentials
import { useContext } from "react";

import styled from "styled-components";

import { useNavigate } from "react-router-dom";

// Icons
import { MdTripOrigin } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { UserContext } from "../../UserContext";

const PreviousTrips = () =>{
    // Import required context states
    const {userData, setOriginInput, setDestinationInput, setRoutesData, setSearchForRoute} = useContext(UserContext);

    // For navigation to the main page on previous trip click
    const navigate = useNavigate();

    // Create a function to re-search a previous trip on the main page
    const searchTrip = (origin, destination) => {
        // Set the input values of the search bar
        setOriginInput(origin);
        setDestinationInput(destination);
        // Reset the data for the route to avoid multiple trip distances
        // being summed in TripDetails
        setRoutesData([]);
        // Navigate to the homepage
        navigate("/");
        // Fixes render issue of homepage displaying as scrolled halfway
        // down on load
        window.scrollTo({
            top: 0,
            left: 100,
        });
        // Set the state that calls the geoJSON fetch and
        // corresponding routing functions
        setSearchForRoute(true);
    }

    // Return the Previous Trips element to render in Profile
    return(
        <>
        <FlexHeader>
            <H1>Previous Trips</H1>
        </FlexHeader>
        <Line></Line> 
        <Wrapper>
        {userData // If the data has been fetched from the backend (i.e. userData.previous_searches is available)
            && userData.previous_searches.length > 0 // Then check if the user has populated the previous_searches array
                ? // If so, return the previous searches
                  userData.previous_searches.map((search)=>{
                    return(
                        <Trip
                            onClick={()=>searchTrip(search.origin, search.destination)}>
                            <Origin><MdTripOrigin />{search.origin}</Origin>
                            <Dots><BsThreeDotsVertical/></Dots>
                            <Destination><FaMapMarkerAlt/>{search.destination}</Destination>
                        </Trip>
                    )
                    })
                : // Otherwise, let the user know that they need to search first to populate the array
                  <NoTrips>You have not completed any previous trips</NoTrips>
        }
        </Wrapper>
        </>
    )
}

export default PreviousTrips;
const Wrapper= styled.div`
    margin: 10px 0 20px 0;
`;
const Line = styled.div`
    border: 1px solid white;
    margin: 10px 0 30px 0;
`;
const Origin = styled.div`
    font-size: 12px;
    display: flex;
    align-items: center;
    
    color: white;
`;
const Dots = styled.div`
    font-size: 12px;
    display: flex;
    align-items: center;
    color: white;
    margin: 1px 0 3px;
`;
const Destination = styled.div`
    font-size: 12px;
    display: flex;
    align-items: center;
    color: white;
`;
const Trip = styled.div`
    margin: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 0 0 30px 0;
`;
const FlexHeader = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const H1 = styled.h1`
    text-align: left;
    margin: 40px 0 10px 0;
    font-size: 30px !important;
    color: white;
    background-color: var(--color-secondary);
`;
const NoTrips = styled.div`
    margin: 0 0 70px 0;
`;