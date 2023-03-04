// React essentials
import { useContext } from "react";

import styled from "styled-components";
import { UserContext } from "../../UserContext";

// Displays the user data based on the fetch from the server
const UserData = () =>{
    const {userData} = useContext(UserContext);
    console.log(userData);
    return(
        <>
            <FlexRow>
                <Name><Bold>Name:</Bold> {userData.given_name}</Name>
                <Surname>{userData.family_name}</Surname>
            </FlexRow>
            <Email><Bold> Email: </Bold> {userData.email}</Email>
            <Email><Bold> Home: </Bold> {userData.home}</Email>
            <Email><Bold> Work: </Bold> {userData.work}</Email>
        </>
    )
}

export default UserData;

const Name = styled.div`
    font-size: 20px;
`;
const Surname = styled.div`
    margin:  0 0 0 10px;
    font-size: 20px;
`;
const Email = styled.div`
    margin: 10px 0 10px 0;
    font-size: 20px;
`;
const FlexRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: top;
    align-items: top;
    text-align: top;
    margin: 10px 0 10px 0;
`;
const Bold = styled.span`
    font-weight: 800;
    margin-right: 2px;
`;