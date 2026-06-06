import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Contact from "../pages/Contact";
import Hire from "../pages/Hire";
import About from "../pages/About";
import BlogDetail from "../pages/BlogDetail";
import CaseStudies from "../pages/CaseStudies";
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
import Login from "../pages/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import PortfolioDetail from "../pages/PortfolioDetail";
import AddPortfolio from "../pages/admin/AddPortfolio.jsx";
import JobApplicationForm from "../components/JobApplicationForm.jsx";
import AddVacancy from "./AddVacancy.jsx";
import AddNewBlog from "../pages/admin/AddNewBlog.jsx";
import EditBlog from "../pages/admin/EditBlog.jsx";
import EditPortfolio from "../pages/admin/EditPortfolio.jsx";
import EditVacancyManagement from "../pages/admin/EditVacancyManagement.jsx";
import AddCaseStudy from "../pages/admin/AddCaseStudy.jsx";
import CaseStudiesDetail from "../pages/CaseStudiesDetail.jsx";
import ServicesDetail from "../pages/ServicesDetail.jsx";
import AddService from "../pages/admin/AddService.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";
import Profile from "../pages/admin/Profile.jsx";
import ComingSoon from "../pages/ComingSoon.jsx";
import Register from "../auth/Register.jsx";
function AppRoutes() {
  return (
    <Routes>
      {/* HOME */}
      {/* <Route path="/" element={<ComingSoon />} /> */}
      <Route path="/" element={<Home />} />
      {/* REAL PAGES */}
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/hire" element={<Hire />} />
      <Route path="/jobApplicationForm" element={<JobApplicationForm />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/caseStudies" element={<CaseStudies />} />
      <Route path="/caseStudiesDetail/:id" element={<CaseStudiesDetail />} />
      <Route path="/blogDetail/:id" element={<BlogDetail />} />
      <Route path="/portfolioDetail" element={<PortfolioDetail />} />
      <Route path="/servicesDetail/:id" element={<ServicesDetail />} />
      <Route path="/verifyEmail/:token" element={<VerifyEmail />} />

      {/* Admin */}

      <Route path="/admin/" element={<ProtectedRoutes comp={<Dashboard />} />}>
        <Route path="logoManagement" element={<LogoManagement />} />
        <Route index element={<LogoManagement />} />
        <Route path="profile" element={<Profile />} />

        <Route path="blogManagement" element={<BlogManagement />} />
        <Route path="addNewBlog" element={<AddNewBlog />} />
        <Route path="editBlog/:id" element={<EditBlog />} />

        <Route
          path="caseStudiesManagement"
          element={<CaseStudiesManagement />}
        />

        <Route path="addCaseStudy" element={<AddCaseStudy />} />
        <Route path="clientsManagement" element={<ClientsManagement />} />
        <Route
          path="contactFormManagement"
          element={<ContactFormManagement />}
        />
        <Route path="addVacancy" element={<AddVacancy />} />
        <Route path="editVacancy/:id" element={<EditVacancyManagement />} />

        <Route path="jobApplied" element={<JobApplied />} />

        <Route path="portfolioManagement" element={<PortfolioManagement />} />
        <Route path="editPortfolio/:id" element={<EditPortfolio />} />
        <Route path="addPortfolio" element={<AddPortfolio />} />

        <Route path="projectsManagement" element={<ProjectsManagement />} />
        <Route path="qAManagement" element={<QAManagement />} />
        <Route path="serviceManagement" element={<ServiceManagement />} />
        <Route path="addService" element={<AddService />} />
        <Route path="staffManagement" element={<StaffManagement />} />
        <Route
          path="testimonialManagement"
          element={<TestimonialManagement />}
        />
        <Route path="vacancyManagement" element={<VacancyManagement />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
