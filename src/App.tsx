import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import DoctorNavbar from "./components/DoctorNavbar";

function App() {
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => {
      setVersion((v) => v + 1); // force re-render
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setUser(parsed);
    }
  }, []);

  const isDoctor = user?.role === "doctor";

  return (
    <div key={version}>
    <BrowserRouter>
      {isDoctor ? <DoctorNavbar /> : <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/medical-history" element={<MedicalHistoryPage />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/availability" element={<DoctorAvailability />} />
      </Routes>
      <Footer />
    </BrowserRouter>
    </div>
  );
}

export default App;
