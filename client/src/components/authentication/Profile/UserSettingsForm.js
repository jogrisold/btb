// React essentials
import { useState, useContext } from "react";
import styled from "styled-components";

// User context dependency
import { UserContext } from "../../UserContext";

// React icons
import { BsToggleOff } from "react-icons/bs";
import { BsToggleOn } from "react-icons/bs";
import { MdDirectionsBike } from "react-icons/md";
import { MdElectricBike } from "react-icons/md";

const UserSettingsForm = ({ handleSubmit}) => {
    // Use context to bring in the current user that is logged in
    const {userData} = useContext(UserContext);
    // Create a state to hold the new settings information entered by user
    const [settingsData, setSettingsData] = useState({});
    // Create a state to toggle the conditional rendering
    const [useBikePaths, setUseBikePaths] = useState(userData.settings.use_bike_paths);

    // Function that toggles conditional render and sets
    // state for form submission
    const toggleUseBikePaths = (e) => {
        e.preventDefault()
        if(useBikePaths){
            setUseBikePaths(false);
            setSettingsData({
                ...settingsData,
                use_bike_paths: false,
                });
        } else {
            setUseBikePaths(true);
            setSettingsData({
                ...settingsData,
                use_bike_paths: true,
                });
        }
    }

    return (<>
        <SettingsForm onSubmit={(e) => handleSubmit(e, settingsData)}>
            <Center>
                <FlexRow>
                    <Label>Use bike paths:</Label>
                    <ToggleBikePaths 
                        onClick = {toggleUseBikePaths}>
                        <FlexRow>
                            <Electric><MdElectricBike size = {40} /></Electric>
                            {useBikePaths
                            ?<BsToggleOn size = {40}/>
                            :<BsToggleOff size = {40}/>
                            }
                            <Regular><MdDirectionsBike size = {40}/></Regular>
                        </FlexRow>
                    </ToggleBikePaths>
                </FlexRow>
            </Center>
            <UserSettingsSubmit  >
                Confirm
            </UserSettingsSubmit>
        </SettingsForm>
    </>
    );
};

export default UserSettingsForm;

// Create our form
const SettingsForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;
const Center= styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    
`;
const FlexRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const Electric = styled.div`
    margin: 0 5px 0 0;
`;
const Regular = styled.div`
    margin: 0 0 0 5px;
`;
// Create our label styling
const Label = styled.label`
    font-size: 1rem;
    text-align: left;
    font-size: 24px;
    width: 100%;
    color: white;
    background-color: var(--color-secondary);
`;
const ToggleBikePaths = styled.button`
    color: white;
    background-color: var(--color-secondary);
    text-align: left;
    width: 200px;
    height: 50px;
    border: none;
    
`;
// Button for form submission
const UserSettingsSubmit = styled.button`
  font-family: var(--font-heading);
  font-weight: bold;
  color: white;
  background-color: var(--color-quarternary);
  font-size: 24px;
  border-radius: 5px;
  border: 1px solid white;
  border-radius: 10px;
  margin: 30px 0 0 0;
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