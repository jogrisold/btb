//**************************************************************** */
// Imports
//**************************************************************** */

// React dependencies
import styled from "styled-components"
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Local component dependencies

import UserProfileForm from "./UserProfileForm";

// Circular Progress animation for loading
import CircularProgress from '@mui/material/CircularProgress';
import ProfileHeader from "./ProfileHeader";
import Settings from "./Settings";
import UserData from "./UserData";
import PreviousTrips from './PreviousTrips';
import { UserContext } from "../../UserContext";

// It's your profile! 
const Profile = () => {

    //**************************************************************** */
    // Constants
    //**************************************************************** */

    // Use context to bring in needed states
    const { 
        currentUser,
        isLoggedIn,
        userData, 
        setUserData
    } = useContext(UserContext);

    // State for conditional rendering of page whilst waiting on fetches to back end\
    const [isLoading, setIsLoading] = useState(true);
    // State for toggling the view of the edit profile form
    const [editProfile, setEditProfile] = useState(false);

    // Use effect to load user data from database, in order to 
    // render updates to database live without need for page refresh
    useEffect(()=>{
        // If the user is logged in and they are not editing
        // their profile
        if (isLoggedIn && currentUser && isLoading === true) {
            // Give the server somt time to update
            setTimeout(()=>{
                // Get the user data from the database
                fetch(`/api/users/${currentUser._id}`)
                .then((res)=>res.json())
                .then((data)=>{
                    console.log(data.data);
                    // Store it in the userData state
                    setUserData(data.data)      
                })
            }, 2300)
            // Render the page
            setIsLoading(false);
        }
    }, [isLoading])

    // Create a function to handle submission of the 
    // updateUserProfile form
    const updateUserProfile = (e, profileData) => {
        // Stop the page from refreshing
        e.preventDefault()
        // Create an object using the data held in the profileData 
        // state as set onChange in the Input elements of the form
        const updatedProfile = {
            _id: currentUser._id,
            given_name: profileData.given_name,
            family_name: profileData.family_name,
            email: profileData.email,
            home: profileData.home,
            work: profileData.work
          };
        // Send a patch request with the object stringified into JSON format
        fetch("/api/update-profile", {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProfile),
        })
        // Reset the loading state to recall the fetch
        setIsLoading(true);
        // Close the form
        setEditProfile(false);
    }

    // Function to toggle the view of the profile form
    const toggleEditProfile = () => {
        if(editProfile){
            setEditProfile(false);
        } else {
            setEditProfile(true);
        }
    }

    return (
    <Center>
        <Wrapper>
            {isLoggedIn // If the user is logged in
                ? isLoading === false && userData !== null && userData !== undefined
                    // Check if the fetch has finished loading, and userData state has been correctly set.
                    ? // If so, return the user profile   
                      <>
                      <ProfileHeader toggleEditProfile = {toggleEditProfile}/>
                      <Line></Line> 
                      {editProfile // Check if the editProfile button has been clicked,
                          ? // If so, show the edit profile form
                              <UserProfileForm handleSubmit={updateUserProfile}/>
                          : // If not, display the user data
                              <UserData />
                      }
                      <Settings isLoading = {isLoading} setIsLoading = {setIsLoading}/>
                      <PreviousTrips />
                      </>
                    : // Otherwise, display a loading animation
                      <><Center><CenterCircular><CircularProgress/></CenterCircular></Center></>
                
                : // Otherwise, direct the user to log in to see profile
                <Login>Please <LoginLink to ={"/login"}>login</LoginLink>  to continue</Login>
            }   
        </Wrapper>
    </Center>
    )
}

// Export the component for use in /profile
export default Profile;

//**************************************************************** */
// Styled Components
//**************************************************************** */

const Center= styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    font-size: 18px;
    font-family: var(--font-body);
    color: white;
`;
const CenterCircular= styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    font-size: 18px;
    font-family: var(--font-body);
`;
const Login = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
`;
const LoginLink = styled(Link)`
   padding: 0 5px;
   font-weight: bold;
   text-decoration: none;
   color: var(--color-quarternary);
   &:hover {
        color: var(--color-primary);
   }
`;
const Wrapper= styled.div`
    display: flex;
    width: 80%;
    flex-direction: column;
    align-items: left;
    margin-top: 50px;
`;
const Line = styled.div`
    border: 1px solid white;
    margin: 10px 0 30px 0;
`;