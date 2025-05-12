import React, { useState, useRef, useEffect } from "react";
import { IoMdNotifications } from "react-icons/io";
import { Link, useNavigate  } from "react-router-dom";
import DoctorNavbar from "./DoctorNavbar";

interface Notification {
  id: number;
  date: string;
  type: "appointment" | "change" | "notes" | "history";
  title: string;
  message: string;
  read: boolean;
}

const Navbar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDoctor, setIsDoctor] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(()=>{
    let token = localStorage.getItem("userInfo");
    if(token){
      let role = JSON.parse(token).role;
      setIsDoctor(role === 'doctor')
      setIsLoggedIn(true)
    }
  },[navigate])

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      date: "Today",
      type: "appointment",
      title: "Scheduled Appointment",
      message: "Eye check-up",
      read: false,
    },
    {
      id: 2,
      date: "Today",
      type: "change",
      title: "Scheduled Change",
      message: "Headache",
      read: false,
    },
    {
      id: 3,
      date: "Today",
      type: "notes",
      title: "Medical Notes",
      message: "Your appointment has been booked successfully",
      read: false,
    },
    {
      id: 4,
      date: "Yesterday",
      type: "appointment",
      title: "Scheduled Appointment",
      message: "Having a fever",
      read: true,
    },
    {
      id: 5,
      date: "15 April",
      type: "history",
      title: "Medical History Update",
      message: "Having headaches for the past week",
      read: true,
    },
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setNotifications((notifs) => notifs.map((n) => ({ ...n, read: true })));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return "🕒";
      case "change":
        return "🔄";
      case "history":
        return "📝";
      default:
        return "ℹ️";
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
    {
      isDoctor ? (
        <DoctorNavbar />
      ):(
      <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              MedStudent
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/booking"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Booking
            </Link>
            <Link
              to="/medical-history"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Medical History
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Profile
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none relative"
              >
                <IoMdNotifications className="h-5 w-5" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-sm font-medium text-gray-700">
                        Notifications
                      </h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                        >
                          <div className="flex items-start">
                            <span className="mr-2">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {notification.date}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
                      View All Notifications
                    </div>
                  </div>
                </div>
              )}
            </div>

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
      </div>
    </nav>
      )
    }
    </>
  );
};

export default Navbar;
