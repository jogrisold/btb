// Import our favorite create Global Style, thaqt
// will allow us to pass all of the following CSS
// as one element that can be accessed in App
import { createGlobalStyle } from "styled-components";

// It's a constant!
const GlobalStyles = createGlobalStyle`

    // Color scheme and fonts defined as variables 
    // accessible in the root so we can call on them
    // in all of our styled components
    :root {
        --color-primary: #BFBA9F; /* #C6C9C0;*/
        --color-secondary: #BFCCFF;
        --color-tertiary: #5D5B67 ;
        --color-quarternary: #fec789; /* #ff9933 #6A6A5F;*/
        --color-gold:#BF9663;
        --font-heading: 'Noto Sans', Arial, Helvetica, sans-serif;
        --font-body: 'Helvetica', Arial, Helvetica, sans-serif;
        --padding-page: 24px;
    }

    // Set the page to fill the screen
    html, body {
        max-width: 100vw;
        height: 100vh;
        background-color: var(--color-secondary);
    }

    // Adjust css for mobile-first design:
    // DESKTOP
    @media (min-width: 750px) {


    }

    // TABLET
    @media (max-width: 750px) {



    }

    // PHONE
    @media (max-width: 550px) {



    }

    // Remove default margins, paddings and borders
    // to reduce repetitive code
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        box-sizing: border-box;
        font-size: 100%;
        vertical-align: baseline;
    }


    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }

    // Set the color/fonts for our headings,
    // labels and buttons.
    h1,
    h2,
    h3,
    label,
    button {
    color: var(--color-secondary);
    font-family: var(--font-heading);
    }

    // Set our font for the body elements
    p,
    a,
    li,
    blockquote,
    input {
    font-family: var(--font-body);
    }`;

    // Export that baby for use in App!
    // Bellissimo!
    export default GlobalStyles;