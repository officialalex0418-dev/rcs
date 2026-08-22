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
import Careers from "./pages/Careers";
import CareerDetail from "./pages/CareerDetail";

// Admin Pages
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminLogin from "./admin/pages/AdminLogin";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import JobsList from "./admin/pages/JobsList";
import JobForm from "./admin/pages/JobForm";
import ApplicationsList from "./admin/pages/ApplicationsList";
import InquiriesList from "./admin/pages/InquiriesList";
import GalleryManager from "./admin/pages/GalleryManager";
import ProjectManager from "./admin/pages/ProjectManager";
import Reports from "./admin/pages/Reports";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Site() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="app-shell">
        <ScrollToTop />
        <main>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="careers" element={<JobsList />} />
              <Route path="careers/new" element={<JobForm />} />
              <Route path="careers/edit/:id" element={<JobForm />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="inquiries" element={<InquiriesList />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<div className="p-6 text-2xl font-bold">System Settings Coming Soon</div>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:slug" element={<CareerDetail />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() { return <BrowserRouter><Site /></BrowserRouter>; }
