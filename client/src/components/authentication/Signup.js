//**************************************************************** */
// Imports
//**************************************************************** */

// React essentials
import { useState, useContext } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
// Local dependencies
import { UserContext } from "../UserContext";

// Images for user password visibility button
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

// Component to be used in /signup for new users
const SignUp = () => {
  //**************************************************************** */
  // Constants
  //**************************************************************** */
  
  // Bring in basics from UserContext
  const { 
    setCurrentUser, 
    isLoggedIn, 
    setIsLoggedIn 
    } =useContext(UserContext);
  // Set some new states for storage user input from form
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [inputType, setInputType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  // Some states to create a styled error message
  const [errorMsg, setErrorMsg] = useState("");
  const [popUp, setPopUp] = useState(false);
  
  //**************************************************************** */
  // Functions
  //**************************************************************** */
  
  // Create a function to toggle visibility of password and confirm 
  // password inputs by changing the type of input.
  const togglePassword =()=>{
    if(inputType === "password")
    {
     setInputType("text")
     return;
    }
    setInputType("password")
  }

  //Create a function to handle form submission
  const handleSubmit = (e) => {
    // Stop the page from reloading
    e.preventDefault();
    // Pass the data from the form into an object that
    // we can pass to the backend
    const userSignUpData = {
      given_name: userFirstName,
      family_name: userLastName,
      email: userEmail,
      password: passwordInput,
    };
    console.log(userSignUpData);
    // Define our options for the post method including 
    // stringifying our object to post to mongoDB
    const options = {
      method: "POST",
      body: JSON.stringify(userSignUpData),
      headers: { 
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin" : "*", 
        "Access-Control-Allow-Credentials" : true 
      },
    };

  // Create a function that will send a .post request containing the user
  // data, to be called only if the user passes the input handling below.
  const addUser = (options) => {
    fetch("/api/signup", options)
      .then((res) => res.json())
      .then((json) => {
        const {status, message} = json;
        if (status >= 400) {
          // If there is an error, display a styled error message
          setErrorMsg(message);
          setPopUp(true);
        } else if(status === 200){
          // If the response is a success, log the new user in and 
          // set the current user data for use in cart /profile,
          // This will also refresh the returned elements to show
          // a success message and a navlink to the main page
          setIsLoggedIn(true);
          setCurrentUser(json.data);
        }
      })
      // Uncaught fetch errors
      .catch((err) => console.log(err))
      // })
    };

    //**************************************************************** */
    // Input Handling
    //**************************************************************** */ 
    // Create a function using .test that checks
    // if a string contains only letters
    const alphaTest = (input) => {
      const alpha = /^[a-zA-Z]+$/;
      if (alpha.test(input)){
        return true; 
      } else {
        return false;
      }
    }
    
    // Create a function that will test if the password contains at least 
    // one lower case and upper case letter, as well as one number and one 
    // special character. 
    const passwordTest = (input) => {
      const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
      if (strongRegex.test(input)){
        return true; 
      } else {
        return false;
      }
    }

    // Most Importantly, check if they got the password right
    if(passwordInput !== confirmPasswordInput){
      // Set an error message to display on the page
      setErrorMsg("Passwords do not match");
      // Activate our styled popup that displays the message
      setPopUp(true);
    // Additional email verification (avoids string@string)
    // and user error @gmailcom
    } else if (userEmail.toString().includes(".") === false) {
      setErrorMsg("Email is not valid");
      setPopUp(true);
    // Use our above function to check the names are just letters
    } else if (alphaTest(userFirstName) === false || alphaTest(userLastName) === false) {
      setErrorMsg("Names cannot contain special characters or numbers");
      setPopUp(true);
    // Require passwords to be at least 8 characters
    } else if ( passwordInput.length < 8 ) {
      setErrorMsg("Password must be at least 8 characters long");
      setPopUp(true);
    // Require passwords to be at most 20 characters
    } else if ( passwordInput.length > 20 ) {
      setErrorMsg("Password must be less than 20 characters long");
      setPopUp(true);
    // Run our RegEx test from above
    } else if ( passwordTest(passwordInput) === false  ) {
      setErrorMsg("Password must contain at least one upper and lower case letter, at least one number and at least one special character");
      setPopUp(true);
    // If all tests pass, then call the POST request function
    } else {
      addUser(options);
    }
    };

  //**************************************************************** */
  // Page Rendering
  //**************************************************************** */
  return (
    <>
    {/* Conditional rendering of error message */}
    {popUp 
    ? (<Center>
        <PopUp> 
        <FlexCol>
        <H2>Ooopsie daisie!</H2>
        <Text>
          Sorry, it seems like something went wrong with the sign up process:
        </Text>
        <Text>
          {errorMsg}
        </Text>
        <Text>
          Please try again:
        </Text>
        <Submit 
        onClick = {()=>setPopUp(false)}
        type="ok">Ok</Submit>
        </FlexCol>
        </PopUp>
      </Center>)
    : (<></>)
    }
    {/* Conditional rendering of Sign Up based on whether the user 
    is logged in or not */}
      {isLoggedIn ? (
        <Center>
        <Wrapper>
          <H1>Congratulations, signup successful!</H1>
          <GoHome>
          {/* StyledNavLink to avoid page refresh which loses state */}
            <HomepageLink to = {"/"}>Let's Go!</HomepageLink>
          </GoHome>
          </Wrapper>
        </Center>
      ) : (
        <Center>
          <Wrapper>
            <SignUpForm 
              onSubmit={handleSubmit}>
              <SignUpText>Sign Up</SignUpText>
              <Label htmlFor='first-name'>First Name</Label>
                <Input
                  autoFocus
                  type="text"
                  placeholder="First Name"
                  value={userFirstName}
                  required={true}
                  onChange={(e) => setUserFirstName(e.target.value)}
                />
                <Label htmlFor='last-name'>Last Name</Label>
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={userLastName}
                  required={true}
                  onChange={(e) => setUserLastName(e.target.value)}
                />
                <Label htmlFor='email'>Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={userEmail}
                  required={true}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <Label htmlFor='password'>Password</Label>
              <FlexRow>
                {/* Create an input in which the type can be toggled by the 
                passwordInput function, called by clicking the button */}
                <Input 
                  type={inputType} 
                  placeholder="Password"
                  value={passwordInput} 
                  aria-describedby="password-constraints"
                  required = {true}
                  onChange={(e) => setPasswordInput(e.target.value)} 
                />
                {/* Set the type of button to be button to avoid form submission,
                call the function togglePassword when it is clicked, and add
                an aria label htmlFor vision impaired users */}
                <TogglePassword 
                  type="button"
                  aria-label="Show password as plain text.
                    Warning: this will display your password on the screen."
                  onClick={togglePassword}>
                  { inputType ==="password"
                  ? <AiOutlineEyeInvisible size = {25} />
                  : <AiOutlineEye size = {25}/>}
                </TogglePassword>
             </FlexRow>
              <Label htmlFor='confirm-password'>Confirm Password</Label>
              <FlexRow>
                <Input 
                  type={inputType} 
                  placeholder="Confirm Password"
                  aria-describedby="password-constraints"
                  value={confirmPasswordInput} 
                  required = {true}  
                  onChange={(e)=>setConfirmPasswordInput(e.target.value)} 
                  />
                <TogglePassword 
                  type="button"
                  aria-label="Show password as plain text.
                    Warning: this will display your password on the screen."
                  onClick={togglePassword}>
                  { inputType ==="password"
                  ? <AiOutlineEyeInvisible size = {25} />
                  : <AiOutlineEye size = {25}/>}
                </TogglePassword>
             </FlexRow>
              <SignUpSubmit type="submit">Sign Up!</SignUpSubmit>
            </SignUpForm>
          </Wrapper>
        </Center>
      )}
    </>
  );
};

// Export the component to be used in app router /signup
export default SignUp;

// Create a styled position absolute div that reqplicates
// a window.alert but looks better
const PopUp= styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    border: 1px solid black;
    position: absolute;
    z-index: 1;
    margin: 240px 0 0 0;
    font-size: 26px;
    font-family: var(--font-heading);
    background-color: white;
    width: 450px;
    padding: 20px;
`;
// Center our form
const Center= styled.div`
    font-family: var(--font-body);
    display: flex;
    width: 100%;
    justify-content: center;
`;
// Wrapper styling to contain form
const Wrapper = styled.div`
  border: none;
  border-radius: 20px;
  width: 450px;
  background-color: var(--color-secondary);
  color: white;
  padding: 50px;
  margin: 100px 0 100px 0;
`;
// Link to homepage in case user navigates back
// to signup page after successful sign up

const HomepageLink = styled(NavLink)`
  color: white;
  font-size: 26px;
  border: 1px solid white;
  border-radius: 10px;
  padding: 20px 0 20px 0;
  text-decoration: none;
  display: flex;
  justify-content: center;
  text-align: center;
    &:hover {
      color: var(--color-quarternary);
    }
`;
// Styled div to contain the link
const GoHome = styled.div`
    text-align: center;
    font-size: 36px;
`;
// Create our form
const SignUpForm = styled.form`
display: flex;
  flex-direction: column;
  gap: 10px;
`;
// Styling fo the header
const SignUpText = styled.div`
  color: white;
  font-size: 38px;
  font-weight: 600;
  font-family: var(--font-heading);
  margin: 10px 0 30px 0;
`;
// Create our label styling
const Label = styled.label`
  font-size: 1rem;
  color: white;
  text-align: left;
  font-size: 24px;
  width: 100%;
`;
// Same for inpiut
const Input = styled.input`
  font-size: 24px;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: none;
  margin: 0 10px 10px 0;
  ::placeholder {
    color: var(--color-secondary);
  }
`;
// Button for form submission
const Submit = styled.button`
  font-family: var(--font-heading);
  width: 100%;
  height: 45px;
  border-radius: 5px;
  border: none;
  margin: 10px 0;
`;
const SignUpSubmit = styled.button`
  font-family: var(--font-heading);
  font-weight: bold;
  color: white;
  background-color: var(--color-quarternary);
  font-size: 24px;
  border-radius: 5px;
  border: none;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
    transition: ease-in-out 100ms;
    &:hover{
      transform: scale(1.02);
    }
    &:active{
      transform: scale(.8);
      background-color: lightgray;
    }
`

// Styling for message on form submission
const H1 = styled.h1`
  text-align: left;
  padding: 0 0 30px 0;
  font-size: 36px;
  color:white;
`;
// Styling for message on form submission
const H2 = styled.h1`
  text-align: center;
  padding: 0 0 40px 0;
  font-size: 36px;
`;
const Text = styled.div`
  margin: 20px 0 20px 0 ;
`;
// Styling for toggling password visible 
const TogglePassword = styled.button`
  height: 40px;
  width: 40px;
  border-left: 1px solid var(--color-secondary) !important;
  background-color: white;
  padding: 4px 0 0 1px;
  border-top: none;
  border-right: none;
  border-bottom: none;
  margin: 1px 0 0 -60px;
`;
// Standard flex column
const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px 0;
`;
// Standard flex row
const FlexRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;