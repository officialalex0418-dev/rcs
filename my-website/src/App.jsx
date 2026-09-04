import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, Outlet, Navigate } from "react-router-dom";
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
import Login from "./admin/pages/Login";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import JobsList from "./admin/pages/JobsList";
import JobForm from "./admin/pages/JobForm";
import ApplicationsList from "./admin/pages/ApplicationsList";
import InquiriesList from "./admin/pages/InquiriesList";
import GalleryManager from "./admin/pages/GalleryManager";
import ProjectManager from "./admin/pages/ProjectManager";
import ProjectForm from "./admin/pages/ProjectForm";
import Reports from "./admin/pages/Reports";
import EmployeeManager from "./admin/pages/EmployeeManager";
import TaskManager from "./admin/pages/TaskManager";
import PayrollManager from "./admin/pages/PayrollManager";
import SupportManager from "./admin/pages/SupportManager";
import ChangePassword from "./pages/ChangePassword";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

const PublicLayout = () => (
  <div className="app-shell">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

function Site() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />

        {/* Admin Portal - Protected Area */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/edit/:id" element={<ProjectForm />} />
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

        {/* Employee Portal */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STAFF']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/employee/dashboard" element={<Navigate to="/dashboard" replace />} />

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
    </>
  );
}

export default function App() { return <BrowserRouter><Site /></BrowserRouter>; }
