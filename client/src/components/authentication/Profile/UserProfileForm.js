// React essentials
import { useState } from "react";
import styled from "styled-components";
// Input component
import Input from "./Input";

// Returns the form to edit the user profile information
const UserProfileForm = ({ handleSubmit }) => {
    // Create a state to hold the updated profile information
    const [profileData, setProfileData] = useState({});

    // Handles the change in input based on key value pair
    const handleChange = (key, value) => {
        setProfileData({
        ...profileData,
        [key]: value,
        });
    };

    return (
        <ProfileForm onSubmit={(e) => handleSubmit(e, profileData)}>
            <Input
                type="text"
                placeholder="Given Name"
                name={"given_name"}
                required={true}
                handleChange={handleChange}
            />
            <Input
                type="text"
                placeholder="Family Name"
                name={"family_name"}
                required={true}
                handleChange={handleChange}
            />
            <Input
                type="email"
                placeholder="Email"
                name={"email"}
                required={true}
                handleChange={handleChange}
            />
            <Input
                type="home"
                placeholder="Home Address"
                required={true}
                name={"home"}
                handleChange={handleChange}
            />
            <Input
                type="work"
                placeholder="Work Address"
                name={"work"}
                required={true}
                handleChange={handleChange}
            />
            <UserProfileSubmit type="submit" >
                Confirm
            </UserProfileSubmit>
        </ProfileForm>
    );
};

export default UserProfileForm;

// Create our form
const ProfileForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

// Button for form submission
const UserProfileSubmit = styled.button`
  font-family: var(--font-heading);
  font-weight: bold;
  color: white;
  background-color: var(--color-quarternary);
  font-size: 24px;
  border-radius: 5px;
  border: 1px solid white;
  border-radius: 10px;
  margin: 10px 0 0 0;
  padding: 10px;
  cursor: pointer;
    transition: ease-in-out 100ms;
    &:hover{
      color: var(--color-quarternary);
      background-color: white;
    }
    &:active{
        transform: scale(.8);
    }
`;