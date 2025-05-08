import { css } from "lit";

// These are example reset styles based on common needs.
// You should ideally copy the relevant rules from your actual
// packages/proto/public/styles/reset.css file for consistency.
const styles = css`
  * {
    margin: 0;
    padding: 0; /* Added padding reset as in your original reset.css */
    box-sizing: border-box;
  }

  /* Minimal set for components - add more from your global reset.css as needed */
  h1, h2, h3, h4, h5, h6 {
    font-size: inherit; /* Reset heading sizes within components if desired */
    font-weight: inherit; /* Reset heading weights within components if desired */
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  ul, ol, menu { /* Added menu as in lab example */
    list-style: none;
    /* display: flex; and flex-direction: column; from lab example might be too specific for a generic reset */
    /* Consider if you want these flex properties in your base component reset */
    padding: 0; /* Ensure padding is reset here too */
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default styles; // Export the css literal directly 