import React, { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";

const DoctorNavbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(()=>{
    let token = localStorage.getItem("userInfo");
    if(token){
      setIsLoggedIn(true)
    }
  },[navigate])
  const handleSignOut = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="bg-[#E0F2FE] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/doctor/dashboard" className="text-2xl font-bold text-[#2563EB]">
          MedStudent (Doctor)
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/doctor/dashboard"
            className="text-gray-800 hover:text-[#2563EB] text-sm font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/doctor/appointments"
            className="text-gray-800 hover:text-[#2563EB] text-sm font-medium"
          >
            Appointments
          </Link>
          <Link
            to="/doctor/availability"
            className="text-gray-800 hover:text-[#2563EB] text-sm font-medium"
          >
            Availability
          </Link>
          <Link
              to="/profile"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Profile
          </Link>          

            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
        </div>

      </div>
    </nav>
  );
};

export default DoctorNavbar;
