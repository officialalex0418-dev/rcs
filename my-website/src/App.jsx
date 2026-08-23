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
import EmployeeManager from "./admin/pages/EmployeeManager";
import TaskManager from "./admin/pages/TaskManager";
import PayrollManager from "./admin/pages/PayrollManager";
import SupportManager from "./admin/pages/SupportManager";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

import { Outlet } from "react-router-dom";

const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

function Site() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Routes>
        {/* Admin Portal - Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Portal - Protected Area */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="inquiries" element={<InquiriesList />} />
          <Route path="employees" element={<EmployeeManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="tasks" element={<TaskManager />} />
          <Route path="payroll" element={<PayrollManager />} />
          <Route path="reports" element={<Reports />} />
          <Route path="support" element={<SupportManager />} />
          <Route path="settings" element={<div className="p-8 text-2xl font-bold">System Settings Coming Soon</div>} />
          <Route path="careers" element={<JobsList />} />
          <Route path="careers/new" element={<JobForm />} />
          <Route path="careers/edit/:id" element={<JobForm />} />
          <Route path="applications" element={<ApplicationsList />} />
        </Route>

        {/* Public Website */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="products" element={<Products />} />
          <Route path="about" element={<About />} />
          <Route path="careers" element={<Careers />} />
          <Route path="careers/:slug" element={<CareerDetail />} />
          <Route path="insights" element={<Insights />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Legal type="privacy" />} />
          <Route path="terms" element={<Legal type="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default function App() { return <BrowserRouter><Site /></BrowserRouter>; }
