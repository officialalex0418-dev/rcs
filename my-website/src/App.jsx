import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import ProjectDetail from "./pages/ProjectDetail";
import Projects from "./pages/Projects";
import Services from "./pages/Services";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Site() {
  return <div className="app-shell"><ScrollToTop /><Navbar /><main><Routes>
    <Route path="/" element={<Home />} /><Route path="/services" element={<Services />} />
    <Route path="/projects" element={<Projects />} /><Route path="/projects/:slug" element={<ProjectDetail />} />
    <Route path="/products" element={<Products />} /><Route path="/about" element={<About />} />
    <Route path="/insights" element={<Insights />} /><Route path="/contact" element={<Contact />} />
    <Route path="/privacy" element={<Legal type="privacy" />} /><Route path="/terms" element={<Legal type="terms" />} />
    <Route path="*" element={<NotFound />} />
  </Routes></main><Footer /></div>;
}

export default function App() { return <BrowserRouter><Site /></BrowserRouter>; }
