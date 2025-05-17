import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./auth/login";
import SignUp from "./auth/signup";
import BookingPage from "./components/BookingPage";
import ProfilePage from "./components/profile";
import Navbar from "./components/Navbar";
import MedicalHistoryPage from "./components/medical_history";
import HomePage from "./components/Home";
import Footer from "./components/Footer";
import DoctorDashboard from "./components/DoctorDashboard";
import DoctorAppointments from "./components/DoctorAppointments";
import DoctorAvailability from "./components/DoctorAvailability";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/booking" element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <BookingPage />
          </ProtectedRoute>
        } />
        <Route path="/medical-history" element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <MedicalHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/appointments" element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorAppointments />
          </ProtectedRoute>
        } />
        <Route path="/doctor/availability" element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorAvailability />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/profile" element={<ProfilePage />} />
        {/* <Route path="/medical-history" element={<MedicalHistoryPage />} /> */}
        {/* <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/availability" element={<DoctorAvailability />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
