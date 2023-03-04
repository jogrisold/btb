import {useState, useContext} from 'react';
import styled from 'styled-components';
import { UserContext } from '../../UserContext';

const DestinationTypeAhead = () => {
    // Bring in user data to access the previous searches
    const {currentUser, destinationInput, setDestinationInput} = useContext(UserContext);
    // State to hold changes in input
    const [destinationTypeAheadInputValue, setDestinationTypeAheadInputValue] = useState("");
    // State to conditionally render based on whether an item in the list has been clicked on
    const [searchNotSelected, setSearchNotSelected] = useState(true);

    // Return results that match what the user types
    const previousSearches = currentUser.previous_searches.filter(search => {
        return search.destination.toLowerCase().includes(destinationTypeAheadInputValue.toLowerCase())
    })
    
    // When a user clicks on a suggestion, navigate to the item details page and clear the input field
    const handleSuggestionClick = (destination) => {
        setDestinationTypeAheadInputValue(destination);
        // Clear the list of searches
        setSearchNotSelected(false);
    } 

    return (
        <>
        <FlexCol>
            <FlexRow>
                <SearchBar 
                    type="text" 
                    value={destinationTypeAheadInputValue} 
                    onChange={(e) => {setDestinationTypeAheadInputValue(e.target.value);setDestinationInput(e.target.value); console.log(destinationInput) }} 
                />
                <ClearBtn type = "button" onClick={()=> {setDestinationTypeAheadInputValue("")}}>Clear</ClearBtn>
            </FlexRow>
        {previousSearches.length > 0 && destinationTypeAheadInputValue.length >= 2 && searchNotSelected &&
        // If the previous searches has been populated and the user has typed enough input to render 
        // a meaningful result, and a search item has not been selected, render the search list
            <SearchList>
                {previousSearches.map(search => {
                    // Find index of word and split for styling
                    let indexOfsecondHalf = search.destination.toLowerCase().indexOf(destinationTypeAheadInputValue.toLowerCase())
                    let firstHalf = search.destination.slice(0, indexOfsecondHalf + destinationTypeAheadInputValue.length)
                    let secondHalf = search.destination.slice(indexOfsecondHalf + destinationTypeAheadInputValue.length)
                    // Clicking a suggestion navigates to the search details page
                    return (
                        <SearchListItem 
                            onClick={()=> {handleSuggestionClick(search.destination)}}
                            >
                            {firstHalf}
                            <Prediction>{secondHalf}</Prediction> 
                        </SearchListItem>
                    )
                })
                }
            </SearchList> 
        }
        </FlexCol>
        </>
    );
};

export default DestinationTypeAhead;

const SearchBar = styled.input`
    font-size: 16px;
    height: 34px;
    width: 100%;
    border: 2px solid var(--color-secondary);
    &:focus-visible {
        outline: 2px solid var(--color-secondary);
    }
`;
const ClearBtn = styled.button`
    color: var(--color-secondary);
    background-color: white;
    border-top: 2px solid var(--color-secondary);
    border-bottom: 2px solid var(--color-secondary);
    border-right: none;
    border-left: 1px solid var(--color-secondary);
    font-size: 19px;
    padding: 5px 10px 5px 10px;
    margin: 0px 0 0 -30px;
    transition: ease-in-out 100ms;
`;

const SearchList = styled.ul`
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    padding: 10px;
    width: 100%;
    background-color: white;
    font-size: 12px;
`;
const SearchListItem = styled.li`
    z-index: 1;
    padding: 5px;
    font-size: 14px;
    &:hover {
        background-color: whitesmoke;;
    }
`;
const Prediction = styled.span`
    font-weight: bold;
`;
const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
`;
const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;