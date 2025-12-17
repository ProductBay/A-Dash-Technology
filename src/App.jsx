import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";

import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Footer from "./components/Footer";
import Pricing from "./pages/Pricing";

export default function App() {
  return (
    <>
      {/* Global header */}
      <Header />

      {/* Page routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/case/:slug" element={<CaseStudy />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        
      </Routes>

      {/* Footer will go here next */}
      <Footer />
    </>
  );
}
