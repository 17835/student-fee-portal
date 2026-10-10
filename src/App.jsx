// Import React Router components.
// BrowserRouter allows us to navigate between pages.
// Routes contains all our available routes.
// Route connects a URL to a specific page.
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Import our fee context provider.
// This allows all our pages to share the same
// financial information.
import { FeeProvider } from "./context/FeeContext";

// Import our reusable layout.
import Layout from "./components/Layout";

// Import all the pages in our Student Fee Portal.
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import FeeBreakdown from "./pages/FeeBreakdown";
import Receipts from "./pages/Receipts";
import HelpSupport from "./pages/HelpSupport";
import Settings from "./pages/Settings";

function App() {
  return (
    // BrowserRouter controls navigation
    // throughout the application.
    <BrowserRouter>

      {/* 
        FeeProvider gives all pages access to
        the same fee and payment information.
      */}
      <FeeProvider>

        {/* Routes contains all the pages
            of our application. */}
        <Routes>

          {/* Layout is the main structure
              of our portal. */}
          <Route path="/" element={<Layout />}>

            {/* Dashboard is our default/home page. */}
            <Route
              index
              element={<Dashboard />}
            />

            {/* Payments page */}
            <Route
              path="payments"
              element={<Payments />}
            />

            {/* Fee Breakdown page */}
            <Route
              path="fee-breakdown"
              element={<FeeBreakdown />}
            />

            {/* Receipts page */}
            <Route
              path="receipts"
              element={<Receipts />}
            />

            {/* Help & Support page */}
            <Route
              path="help-support"
              element={<HelpSupport />}
            />

            {/* Settings page */}
            <Route
              path="settings"
              element={<Settings />}
            />

          </Route>

        </Routes>

      </FeeProvider>
    </BrowserRouter>
  );
}

export default App;