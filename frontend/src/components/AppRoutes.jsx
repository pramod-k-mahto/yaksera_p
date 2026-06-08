import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider.jsx";

// Pages
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import Hire from "../pages/Hire";
import About from "../pages/About";
import BlogDetail from "../pages/BlogDetail";
import CaseStudies from "../pages/CaseStudies";
import PortfolioDetail from "../pages/PortfolioDetail";
import CaseStudiesDetail from "../pages/CaseStudiesDetail.jsx";
import ServicesDetail from "../pages/ServicesDetail.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";
import Login from "../pages/Login";
import Register from "../auth/Register.jsx";
import PageNotFound from "../pages/PageNotFound.jsx";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import BlogManagement from "../pages/admin/BlogManagement";
import ClientsManagement from "../pages/admin/ClientsManagement";
import ContactFormManagement from "../pages/admin/ContactFormManagement";
import JobApplied from "../pages/admin/JobApplied";
import LogoManagement from "../pages/admin/LogoManagement";
import PortfolioManagement from "../pages/admin/PortfolioManagement";
import ProjectsManagement from "../pages/admin/ProjectsManagement";
import QAManagement from "../pages/admin/QAManagement";
import ServiceManagement from "../pages/admin/ServiceManagement";
import StaffManagement from "../pages/admin/StaffManagement";
import TestimonialManagement from "../pages/admin/TestimonialManagement";
import VacancyManagement from "../pages/admin/VacancyManagement";
import CaseStudiesManagement from "../pages/admin/CaseStudiesManagement";
import Profile from "../pages/admin/Profile.jsx";

// Admin Actions
import AddPortfolio from "../pages/admin/AddPortfolio.jsx";
import AddVacancy from "./AddVacancy.jsx";
import AddNewBlog from "../pages/admin/AddNewBlog.jsx";
import EditBlog from "../pages/admin/EditBlog.jsx";
import EditPortfolio from "../pages/admin/EditPortfolio.jsx";
import EditVacancyManagement from "../pages/admin/EditVacancyManagement.jsx";
import AddCaseStudy from "../pages/admin/AddCaseStudy.jsx";
import AddService from "../pages/admin/AddService.jsx";

// Other
import JobApplicationForm from "../components/JobApplicationForm.jsx";
import ProtectedRoutes from "./ProtectedRoutes";

function AppRoutes() {
  const { loading } = useContext(UserContext);
  // console.log(loading)

  // ✅ FIX: handle loading outside Routes
  if (loading) {
    return (
      <div className="min-h-screen text-black flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/hire" element={<Hire />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/jobApplicationForm" element={<JobApplicationForm />} />

      <Route path="/caseStudies" element={<CaseStudies />} />
      <Route path="/caseStudiesDetail/:id" element={<CaseStudiesDetail />} />
      <Route path="/blogDetail/:id" element={<BlogDetail />} />
      <Route path="/portfolioDetail" element={<PortfolioDetail />} />
      <Route path="/servicesDetail/:id" element={<ServicesDetail />} />
      <Route path="/verifyEmail/:token" element={<VerifyEmail />} />

      {/* ADMIN ROUTES (PROTECTED) */}
      <Route
        path="/admin/"
        element={<ProtectedRoutes comp={<Dashboard />} />}
      >
        <Route index element={<LogoManagement />} />

        <Route path="logoManagement" element={<LogoManagement />} />
        <Route path="profile" element={<Profile />} />

        <Route path="blogManagement" element={<BlogManagement />} />
        <Route path="addNewBlog" element={<AddNewBlog />} />
        <Route path="editBlog/:id" element={<EditBlog />} />

        <Route path="caseStudiesManagement" element={<CaseStudiesManagement />} />
        <Route path="addCaseStudy" element={<AddCaseStudy />} />

        <Route path="clientsManagement" element={<ClientsManagement />} />
        <Route path="contactFormManagement" element={<ContactFormManagement />} />

        <Route path="jobApplied" element={<JobApplied />} />

        <Route path="portfolioManagement" element={<PortfolioManagement />} />
        <Route path="addPortfolio" element={<AddPortfolio />} />
        <Route path="editPortfolio/:id" element={<EditPortfolio />} />

        <Route path="projectsManagement" element={<ProjectsManagement />} />
        <Route path="qAManagement" element={<QAManagement />} />

        <Route path="serviceManagement" element={<ServiceManagement />} />
        <Route path="addService" element={<AddService />} />

        <Route path="staffManagement" element={<StaffManagement />} />
        <Route path="testimonialManagement" element={<TestimonialManagement />} />

        <Route path="vacancyManagement" element={<VacancyManagement />} />
        <Route path="addVacancy" element={<AddVacancy />} />
        <Route path="editVacancy/:id" element={<EditVacancyManagement />} />
      </Route>

      {/* 404 PAGE */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AppRoutes;