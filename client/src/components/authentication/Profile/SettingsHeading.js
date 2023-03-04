// React essentials
import { FiSettings } from "react-icons/fi";
import styled from "styled-components";

// Header for the settings section in profile
const SettingsHeading = ({toggleEditSettings}) =>{
    // Nothing to see here, return the header element
    return(
        <FlexHeader>
        <H1>Settings</H1>
            <Edit>
                <FiSettings
                    onClick={toggleEditSettings}
                    size = {30}/>
            </Edit>
        </FlexHeader>
    )
}

export default SettingsHeading;

const Edit = styled.button`
    border: none;
    margin: 0 0 0 0;
    color: white;
    background-color: var(--color-secondary);
    &:hover{
        transform: scale(1.2);
        color: var(--color-quarternary);
        background-color: var(--color-secondary);
    }
`;
const FlexHeader = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 30px 0 0 0;
`;
const H1 = styled.h1`
    text-align: left;
    margin: 5px 0 10px 0;
    font-size: 30px !important;
    color: white;
`;