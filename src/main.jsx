// StrictMode helps us identify potential problems during development.
import { StrictMode } from "react";

// createRoot allows React to render our application.
import { createRoot } from "react-dom/client";

// Import our global stylesheet.
import "./index.css";

// Import the main App component.
import App from "./App.jsx";


// Find the HTML element with id="root"
// and render our React application inside it.
createRoot(document.getElementById("root")).render(

  <StrictMode>

    <App />

  </StrictMode>

);