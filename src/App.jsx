import { Suspense, lazy } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import Footer from "./components/Footer";
import GoogleAnalytics from "./components/GoogleAnalytics";
import ScrollToTop from "./components/ScrollToTop";
import PageTransition from "./components/PageTransition";

const Home = lazy(() => import("./pages/Home"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const PlatformDetail = lazy(() => import("./pages/PlatformDetail"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Work = lazy(() => import("./pages/Work"));
const Projects = lazy(() => import("./pages/Projects"));
const Graphics = lazy(() => import("./pages/Graphics"));
const Websites = lazy(() => import("./pages/Websites"));
const AdminSubmissions = lazy(() => import("./pages/AdminSubmissions"));
const WebsiteProjectSummary = lazy(() => import("./pages/projects/WebsiteProjectSummary"));
const GraphicsProjectSummary = lazy(() => import("./pages/projects/GraphicsProjectSummary"));
const RequestSelector = lazy(() => import("./pages/request/RequestSelector"));
const RequestDiscovery = lazy(() => import("./pages/request/RequestDiscovery"));
const RequestSoftware = lazy(() => import("./pages/request/RequestSoftware"));
const RequestWebsite = lazy(() => import("./pages/RequestWebsite"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const DiscoveryService = lazy(() => import("./pages/services/DiscoveryService"));
const SoftwareService = lazy(() => import("./pages/services/SoftwareService"));
const WebsiteService = lazy(() => import("./pages/services/WebsiteService"));

function RouteLoader() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        padding: "6rem 1.5rem",
      }}
    >
      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "999px",
          border: "1px solid rgba(157,220,255,0.18)",
          background: "rgba(255,255,255,0.04)",
          color: "rgba(255,255,255,0.8)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontSize: "0.78rem",
        }}
      >
        Loading experience
      </div>
    </div>
  );
}

function routeElement(node) {
  return (
    <PageTransition>
      <Suspense fallback={<RouteLoader />}>{node}</Suspense>
    </PageTransition>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isClientRoute = location.pathname.startsWith("/client");
  const hideMarketingChrome = isAdminRoute || isClientRoute;

  return (
    <>
      <GoogleAnalytics />
      <ScrollToTop />
      {!hideMarketingChrome ? <Header /> : null}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={routeElement(<Home />)} />
          <Route path="/case/:slug" element={routeElement(<CaseStudy />)} />
          <Route path="/platform/:slug" element={routeElement(<PlatformDetail />)} />
          <Route path="/pricing" element={routeElement(<Pricing />)} />
          <Route path="/graphics" element={routeElement(<Graphics />)} />
          <Route path="/websites" element={routeElement(<Websites />)} />
          <Route path="/work" element={routeElement(<Work />)} />
          <Route path="/projects" element={routeElement(<Projects />)} />
          <Route
            path="/projects/website/:slug"
            element={routeElement(<WebsiteProjectSummary />)}
          />
          <Route
            path="/projects/graphics/:slug"
            element={routeElement(<GraphicsProjectSummary />)}
          />
          <Route path="/admin" element={routeElement(<AdminSubmissions />)} />
          <Route path="/contact" element={routeElement(<Contact />)} />
          <Route path="/about" element={routeElement(<About />)} />

          <Route path="/request" element={routeElement(<RequestSelector />)} />
          <Route
            path="/request/discovery"
            element={routeElement(<RequestDiscovery />)}
          />
          <Route
            path="/request/software"
            element={routeElement(<RequestSoftware />)}
          />
          <Route path="/request/website" element={routeElement(<RequestWebsite />)} />
          <Route path="/client" element={routeElement(<ClientPortal />)} />

          <Route path="/services/discovery" element={routeElement(<DiscoveryService />)} />
          <Route path="/services/software" element={routeElement(<SoftwareService />)} />
          <Route path="/services/websites" element={routeElement(<WebsiteService />)} />

          <Route
            path="/request/ai"
            element={routeElement(<Navigate to="/request/discovery" replace />)}
          />
          <Route
            path="/request/3d"
            element={routeElement(<Navigate to="/request/discovery" replace />)}
          />
          <Route
            path="/request/research"
            element={routeElement(<Navigate to="/request/discovery" replace />)}
          />
        </Routes>
      </AnimatePresence>

      {!hideMarketingChrome ? <Footer /> : null}
    </>
  );
}
