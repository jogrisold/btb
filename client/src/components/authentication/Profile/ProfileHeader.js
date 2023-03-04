// React essentials
import { FiEdit } from "react-icons/fi";
import styled from "styled-components";

// Returns the header element at the top of the profile page
const ProfileHeader = ({toggleEditProfile}) =>{

    // Nothing to see here, return the header element   
    return(
        <FlexHeader>
            <H1>Profile</H1>
            <Edit>
                <FiEdit 
                    onClick={toggleEditProfile}
                    size = {30}/>
            </Edit>
        </FlexHeader>
    )
}

export default ProfileHeader;

const Edit = styled.button`
    border: none;
    background-color: white;
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
`;
const H1 = styled.h1`
    text-align: left;
    margin: 10px 0 10px 0;
    font-size: 30px !important;
    color: white;
`;