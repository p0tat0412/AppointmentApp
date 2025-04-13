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

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/medical-history" element={<MedicalHistoryPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
