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
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/booking" element={<BookingPage />} />
          <Route exact path="/profile" element={<ProfilePage />} />
          <Route
            exact
            path="/medical-history"
            element={<MedicalHistoryPage />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
