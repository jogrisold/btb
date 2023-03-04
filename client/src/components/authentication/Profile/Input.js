// Styled components
import styled from "styled-components"

// Simple input for re-use
const Input = ({type, placeholder, name, required, handleChange}) => {
    return (
        <StyledInput 
            type={type} 
            placeholder={placeholder} 
            required={required} 
            onChange={(e) => handleChange(name, e.target.value)}
        />
    )
}

export default Input;

// Styling
const StyledInput = styled.input`
    font-size: 24px;
    width: 100%;
    height: 40px;
    border-radius: 5px;
    border: none;
    margin: 5px 0;
    ::placeholder {
        color: var(--color-secondary);
    }
`;